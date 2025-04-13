import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    console.log("User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data with the file
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Process the file - this example stores it in Supabase Storage
    const fileBuffer = await file.arrayBuffer();
    const fileName = `inventory-${userId}-${Date.now()}.${file.name
      .split(".")
      .pop()}`;
    
    console.log("Uploading file:", fileName); 

    const { error: uploadError } = await supabase.storage
      .from("inventory-uploads")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Also store a record of the upload in the database
    const { error: dbError } = await supabase.from("inventory_uploads").insert({
      user_id: userId,
      file_name: fileName,
      original_name: file.name,
      file_type: file.type,
      file_size: file.size,
    });

    if (dbError) {
      console.error("Error logging upload to database:", dbError);
      // Continue anyway, not critical
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      fileName,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
