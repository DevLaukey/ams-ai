// app/api/dev/create-user/route.ts (only available in development)
import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  const userData = await req.json();

  console.log("Creating user:", userData);
  try {
    const { error } = await supabase.from("users").insert({
      clerk_user_id: userData.id || `dev_${Date.now()}`,
      email: userData.emailAddresses.emailAddress || "dev@example.com",
      first_name: userData.firstName || "Dev",
      last_name: userData.lastName || "User",
      tier: userData.tier || 1,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Unexpected error in webhook handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
