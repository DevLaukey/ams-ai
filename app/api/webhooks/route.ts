import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  // Get headers - correctly using headers() without await
  const headersList = headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Error: Missing Svix headers");
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  // Get the Clerk webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error(
      "Error: Missing CLERK_WEBHOOK_SECRET in environment variables"
    );
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Get raw request body
  const payload = await req.text();

  // Verify webhook signature
  const wh = new Webhook(webhookSecret);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Error: Webhook verification failed", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  // Parse the verified payload
  const body = JSON.parse(payload);
  const eventType = body.type;

  console.log(`✅ Received Clerk webhook event: ${eventType}`);

  try {
    if (eventType === "user.created") {
      await handleUserCreated(body.data);
    } else if (eventType === "user.updated") {
      await handleUserUpdated(body.data);
    } else if (eventType === "user.deleted") {
      await handleUserDeleted(body.data);
    } else {
      console.warn(`⚠️ Unhandled webhook event type: ${eventType}`);
    }
  } catch (error) {
    console.error("Error processing webhook event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

async function handleUserCreated(user: any) {
  try {
    console.log("🚀 Handling user.created event:", user);
    console.log("User ID from Clerk:", user.id);
    console.log("User email:", user.email_addresses?.[0]?.email_address);

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, clerk_user_id")
      .eq("clerk_user_id", user.id)
      .single();

    if (fetchError) {
      console.error("Error checking existing user:", fetchError);
      // PGRST116 is the "not found" error code from PostgREST
      if (fetchError.code !== "PGRST116") {
        return;
      }
    }

    if (existingUser) {
      console.log("⚠️ User already exists in Supabase:", existingUser);
      return;
    }

    // Insert new user
    const newUser = {
      clerk_user_id: user.id,
      email: user.email_addresses?.[0]?.email_address || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      tier: 1, // Default to Tier 1
      created_at: new Date().toISOString(),
    };

    console.log("Creating new user in Supabase:", newUser);

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select();

    if (error) {
      console.error("Error inserting new user:", error);
    } else {
      console.log("✅ User successfully created in Supabase:", data);
    }
  } catch (error) {
    console.error("Error in handleUserCreated:", error);
  }
}

async function handleUserUpdated(user: any) {
  try {
    console.log("🔄 Handling user.updated event:", user);

    const updateData = {
      email: user.email_addresses?.[0]?.email_address || null,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      updated_at: new Date().toISOString(),
    };

    console.log("Updating user in Supabase:", updateData);

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("clerk_user_id", user.id)
      .select();

    if (error) {
      console.error("Error updating user in database:", error);
    } else {
      console.log("✅ User successfully updated in Supabase:", data);
    }
  } catch (error) {
    console.error("Error in handleUserUpdated:", error);
  }
}

async function handleUserDeleted(user: any) {
  try {
    console.log("🗑️ Handling user.deleted event:", user);

    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("clerk_user_id", user.id)
      .select();

    if (error) {
      console.error("Error deleting user from database:", error);
    } else {
      console.log("✅ User successfully deleted from Supabase:", data);
    }
  } catch (error) {
    console.error("Error in handleUserDeleted:", error);
  }
}
