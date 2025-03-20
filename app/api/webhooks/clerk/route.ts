import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  // Verify the webhook signature
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing svix headers" },
      { status: 400 }
    );
  }

  // Get the Clerk webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Get the raw body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Error verifying webhook" },
      { status: 400 }
    );
  }

  // Handle different webhook events
  const eventType = evt.type;

  if (eventType === "user.created") {
    await handleUserCreated(body.data);
  } else if (eventType === "user.updated") {
    await handleUserUpdated(body.data);
  } else if (eventType === "user.deleted") {
    await handleUserDeleted(body.data);
  }

  return NextResponse.json({ success: true });
}

async function handleUserCreated(user: any) {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, clerk_user_id")
      .eq("clerk_user_id", user.id)
      .single();

    if (!existingUser) {
      // Insert new user
      const { error } = await supabase.from("users").insert({
        clerk_user_id: user.id,
        email: user.email_addresses?.[0]?.email_address || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        username: user.username || null,
        avatar_url: user.image_url || null,
        tier: 1, // Start at Tier 1
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Error creating user in database:", error);
      }
    }
  } catch (error) {
    console.error("Error in handleUserCreated:", error);
  }
}

async function handleUserUpdated(user: any) {
  try {
    // Update existing user
    const { error } = await supabase
      .from("users")
      .update({
        email: user.email_addresses?.[0]?.email_address || null,
        first_name: user.first_name || null,
        last_name: user.last_name || null,
        username: user.username || null,
        avatar_url: user.image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("clerk_user_id", user.id);

    if (error) {
      console.error("Error updating user in database:", error);
    }
  } catch (error) {
    console.error("Error in handleUserUpdated:", error);
  }
}

async function handleUserDeleted(user: any) {
  try {
    // Delete user
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("clerk_user_id", user.id);

    if (error) {
      console.error("Error deleting user from database:", error);
    }
  } catch (error) {
    console.error("Error in handleUserDeleted:", error);
  }
}
