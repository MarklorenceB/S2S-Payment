import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSyntheticEmail } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { accountNumber, contactNumber } = await request.json();

    if (!accountNumber || !contactNumber) {
      return NextResponse.json(
        { error: "Account number and contact number are required." },
        { status: 400 }
      );
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
