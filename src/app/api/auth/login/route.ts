import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSyntheticEmail } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { success } = rateLimit(`login:${ip}`, { maxRequests: 10, windowMs: 60_000 });
    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    const { accountNumber, contactNumber } = await request.json();

    if (!accountNumber || !contactNumber) {
      return NextResponse.json(
        { error: "Account number and contact number are required." },
        { status: 400 }
      );
    }

    if (typeof accountNumber !== "string" || typeof contactNumber !== "string") {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    if (accountNumber.length > 50 || contactNumber.length > 50) {
      return NextResponse.json({ error: "Input too long." }, { status: 400 });
    }

    const supabase = await createClient();
    const syntheticEmail = generateSyntheticEmail(accountNumber);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password: contactNumber,
    });

    if (error) {
      return NextResponse.json(
        { error: "Invalid account number or contact number." },
        { status: 401 }
      );
    }

    // Get user role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    return NextResponse.json({
      message: "Login successful.",
      role: profile?.role || "user",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
