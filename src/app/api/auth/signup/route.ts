import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateSyntheticEmail } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { success } = rateLimit(`signup:${ip}`, { maxRequests: 5, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    const { accountNumber, fullName, contactNumber, email } = await request.json();

    if (!accountNumber || !fullName || !contactNumber) {
      return NextResponse.json(
        { error: "Account number, full name, and contact number are required." },
        { status: 400 }
      );
    }

    if (
      typeof accountNumber !== "string" || typeof fullName !== "string" ||
      typeof contactNumber !== "string" || (email && typeof email !== "string")
    ) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    if (accountNumber.length > 50 || fullName.length > 100 || contactNumber.length > 20 || (email && email.length > 100)) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const syntheticEmail = generateSyntheticEmail(accountNumber);

    // Check if account already exists
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("account_number", accountNumber)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "This account number is already registered." },
        { status: 409 }
      );
    }

    // Create auth user with admin API (bypasses email confirmation)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: syntheticEmail,
      password: contactNumber,
      email_confirm: true, // Auto-confirm the email
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      account_number: accountNumber,
      full_name: fullName,
      contact_number: contactNumber,
      email: email || null,
      role: "user",
    });

    if (profileError) {
      // Cleanup: delete the auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: "Failed to create profile. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Account created successfully.",
      userId: authData.user.id,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
