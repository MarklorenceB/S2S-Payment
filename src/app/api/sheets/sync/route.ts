import { NextResponse } from "next/server";
import { google } from "googleapis";

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY || "{}";
  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch {
    console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY. Length:", raw.length);
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_KEY");
  }

  if (!credentials.client_email) {
    console.error("GOOGLE_SERVICE_ACCOUNT_KEY missing client_email");
    throw new Error("Invalid service account credentials");
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

export async function POST(request: Request) {
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "";

  try {
    const body = await request.json();
    const { action } = body;

    console.log("Sheets sync called:", action, "Sheet ID:", SPREADSHEET_ID ? "set" : "MISSING");

    if (!SPREADSHEET_ID) {
      return NextResponse.json(
        { error: "Google Sheet ID not configured" },
        { status: 500 }
      );
    }

    if (action === "append") {
      return handleAppend(body, SPREADSHEET_ID);
    } else if (action === "update_status") {
      return handleStatusUpdate(body, SPREADSHEET_ID);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Google Sheets sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync with Google Sheets" },
      { status: 500 }
    );
  }
}

async function handleAppend(body: {
  id: string;
  full_name: string;
  account_number: string;
  contact_number: string;
  gcash_reference: string;
  screenshot_url: string;
  created_at: string;
}, SPREADSHEET_ID: string) {
  const sheets = getSheets();

  // First, ensure headers exist
  const headerCheck = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1:I1",
  });

  if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A1:I1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "Request ID",
            "Name",
            "Account Number (WiFi)",
            "Contact Number",
            "GCash Reference #",
            "Date & Time",
            "Status",
            "Screenshot (GCash Payment)",
            "Last Updated",
          ],
        ],
      },
    });
  }

  const dateTime = new Date(body.created_at).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const appendResult = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          body.id,
          body.full_name,
          body.account_number,
          body.contact_number,
          body.gcash_reference || "",
          dateTime,
          "Pending",
          `=IMAGE("${body.screenshot_url}", 2)`,
          dateTime,
        ],
      ],
    },
  });

  // Auto-resize the new row so the screenshot image is visible
  const updatedRange = appendResult.data.updates?.updatedRange || "";
  const rowMatch = updatedRange.match(/(\d+)$/);
  if (rowMatch) {
    const rowIndex = parseInt(rowMatch[1], 10) - 1; // 0-indexed for API
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
              properties: {
                pixelSize: 100,
              },
              fields: "pixelSize",
            },
          },
          {
            updateDimensionProperties: {
              range: {
                sheetId: 0,
                dimension: "COLUMNS",
                startIndex: 7, // Column H - screenshot (0-indexed)
                endIndex: 8,
              },
              properties: {
                pixelSize: 250,
              },
              fields: "pixelSize",
            },
          },
        ],
      },
    });
  }

  return NextResponse.json({ success: true });
}

async function handleStatusUpdate(body: {
  id: string;
  status: string;
}, SPREADSHEET_ID: string) {
  const sheets = getSheets();

  // Find the row with this request ID
  const data = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A:A",
  });

  const rows = data.data.values || [];
  let rowIndex = -1;

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === body.id) {
      rowIndex = i + 1; // Sheets is 1-indexed
      break;
    }
  }

  if (rowIndex === -1) {
    return NextResponse.json({ error: "Row not found" }, { status: 404 });
  }

  const now = new Date().toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const statusLabel =
    body.status.charAt(0).toUpperCase() + body.status.slice(1);

  // Update status (col G) and last updated (col I)
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        {
          range: `Sheet1!G${rowIndex}`,
          values: [[statusLabel]],
        },
        {
          range: `Sheet1!I${rowIndex}`,
          values: [[now]],
        },
      ],
    },
  });

  return NextResponse.json({ success: true });
}
