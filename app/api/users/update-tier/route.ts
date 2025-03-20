import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase"; 
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await req.json();

    // Validate tier value
    if (![1, 2, 3].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid tier value" },
        { status: 400 }
      );
    }

    // Update user tier in the database
    const { data, error } = await supabase
      .from('users')
      .update({ tier, tier_updated_at: new Date() })
      .eq('clerk_user_id', userId)
      .select('id, tier');

    if (error) {
      throw error;
    }

    const result = { rows: data, rowCount: data.length };

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Log the tier change for analytics
    const { error: insertError } = await supabase
      .from('tier_changes')
      .insert({
        user_id: result.rows[0].id,
        old_tier: (await supabase.from('users').select('tier').eq('clerk_user_id', userId).single()).data.tier,
        new_tier: tier
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: `User tier updated to ${tier}`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user tier:", error);
    return NextResponse.json(
      { error: "Failed to update user tier" },
      { status: 500 }
    );
  }
}
