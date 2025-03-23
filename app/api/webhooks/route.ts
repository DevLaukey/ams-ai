import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Get headers safely
    let headersList;
    try {
      headersList = headers();
    } catch (e) {
      console.error("Error getting headers:", e);
      return NextResponse.json(
        { error: "Failed to read request headers" },
        { status: 500 }
      );
    }

    // Get Svix headers
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    // Log headers for debugging (in Vercel logs)
    console.log("Webhook request received with headers:", {
      "svix-id": svix_id ? "present" : "missing",
      "svix-timestamp": svix_timestamp ? "present" : "missing",
      "svix-signature": svix_signature ? "present" : "missing",
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Missing Svix headers" },
        { status: 400 }
      );
    }

    // Get the Clerk webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Server configuration error (missing webhook secret)" },
        { status: 500 }
      );
    }

    // Get raw request body with error handling
    let payload;
    try {
      payload = await req.text();
    } catch (e) {
      console.error("Error reading request body:", e);
      return NextResponse.json(
        { error: "Failed to read request body" },
        { status: 400 }
      );
    }

    if (!payload) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 }
      );
    }

    // Verify webhook signature with better error handling
    const wh = new Webhook(webhookSecret);
    try {
      wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // Parse the payload
    let body;
    try {
      body = JSON.parse(payload);
    } catch (e) {
      console.error("Error parsing JSON payload:", e);
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const eventType = body.type;
    console.log(`Received Clerk webhook event: ${eventType}`);

    // Handle events based on type
    try {
      if (eventType === "user.created") {
        await handleUserCreated(body.data);
      } else if (eventType === "user.updated") {
        await handleUserUpdated(body.data);
      } else if (eventType === "user.deleted") {
        await handleUserDeleted(body.data);
      } else {
        console.log(`Unhandled webhook event type: ${eventType}`);
      }
    } catch (error) {
      console.error(`Error handling ${eventType} event:`, error);
      // Continue processing - don't return error response
    }

    // Always return success, even if handling had issues
    // This prevents Clerk from retrying and potentially causing more errors
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unhandled error in webhook handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleUserCreated(user: any) {
  try {
    if (!user || !user.id) {
      console.error("Invalid user data in webhook:", user);
      return;
    }

    console.log("Handling user.created event for user ID:", user.id);

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, clerk_user_id")
      .eq("clerk_user_id", user.id)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors

    if (fetchError) {
      console.error("Error checking for existing user:", fetchError);
      return;
    }

    if (existingUser) {
      console.log("User already exists in Supabase, skipping creation");
      return;
    }

    // Get email with safety checks
    const email =
      user.email_addresses &&
      user.email_addresses.length > 0 &&
      user.email_addresses[0].email_address
        ? user.email_addresses[0].email_address
        : null;

    // Insert new user
    const newUser = {
      clerk_user_id: user.id,
      email: email,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      tier: 1, // Default to Tier 1
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("users").insert([newUser]);

    if (error) {
      console.error("Error inserting new user:", error);
    } else {
      console.log("User successfully created in Supabase");
    }
  } catch (error) {
    console.error("Error in handleUserCreated:", error);
  }
}

async function handleUserUpdated(user: any) {
  try {
    if (!user || !user.id) {
      console.error("Invalid user data in webhook:", user);
      return;
    }

    console.log("Handling user.updated event for user ID:", user.id);

    // Get email with safety checks
    const email =
      user.email_addresses &&
      user.email_addresses.length > 0 &&
      user.email_addresses[0].email_address
        ? user.email_addresses[0].email_address
        : null;

    const updateData = {
      email: email,
      first_name: user.first_name || null,
      last_name: user.last_name || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("users")
      .update(updateData)
      .eq("clerk_user_id", user.id);

    if (error) {
      console.error("Error updating user in database:", error);
    } else {
      console.log("User successfully updated in Supabase");
    }
  } catch (error) {
    console.error("Error in handleUserUpdated:", error);
  }
}

async function handleUserDeleted(user: any) {
  try {
    if (!user || !user.id) {
      console.error("Invalid user data in webhook:", user);
      return;
    }

    console.log("Handling user.deleted event for user ID:", user.id);

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("clerk_user_id", user.id);

    if (error) {
      console.error("Error deleting user from database:", error);
    } else {
      console.log("User successfully deleted from Supabase");
    }
  } catch (error) {
    console.error("Error in handleUserDeleted:", error);
  }
}
