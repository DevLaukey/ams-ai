import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase";

// Get user tier
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user tier from the database
    const { data, error } = await supabase
      .from("users")
      .select("tier")
      .eq("clerk_user_id", userId)
      .single();

    if (error) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      tier: data.tier,
    });
  } catch (error) {
    console.error("Error fetching user tier:", error);
    return NextResponse.json(
      { error: "Failed to fetch user tier" },
      { status: 500 }
    );
  }
}
