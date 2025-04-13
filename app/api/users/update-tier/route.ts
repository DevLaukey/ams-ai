import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data with the Excel file
    const formData = await req.formData();
    const excelFile = formData.get("file") as File | null;

    if (!excelFile) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Get the user's database ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_user_id", userId)
      .single();

    if (userError) {
      throw userError;
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId_db = userData.id;

    // Process Excel file
    const fileBuffer = await excelFile.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(fileBuffer), {
      cellDates: true,
      cellStyles: true,
      cellNF: true,
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Map Excel data to inventory schema
    const inventoryItems = jsonData.map((item: any) => {
      // Determine stock status based on some logic or default to "In Stock"
      let status = "In Stock";

      return {
        name: item["Product Title"] || "",
        category: item["Application"] || "Other",
        sku: item["Manufacturer_code"] || "",
        quantity: 1, // Default quantity, adjust as needed
        reorder_point: 0, // Default reorder point
        price: parseFloat(item["Price"]) || 0,
        supplier: item["Manufacturer"] || "",
        last_ordered: new Date().toISOString().split("T")[0],
        status: status,
        location: "",
        user_id: userId_db,
        // Additional fields from the Excel file
        model: item["Model"] || "",
        brand: item["Brand"] || "",
        weight: String(item["Weight"]) || "",
        dimensions: String(item["Dimensions"]) || "",
        features: String(item["features"]) || "",
      };
    });

    // Insert inventory items in batches to avoid exceeding request size limits
    const BATCH_SIZE = 50;
    const totalItems = inventoryItems.length;
    let insertedCount = 0;

    for (let i = 0; i < totalItems; i += BATCH_SIZE) {
      const batch = inventoryItems.slice(i, i + BATCH_SIZE);
      const { data: insertedData, error: insertError } = await supabase
        .from("inventory")
        .insert(batch)
        .select("id");

      if (insertError) {
        throw insertError;
      }

      insertedCount += insertedData?.length || 0;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${insertedCount} inventory items`,
      data: {
        import: {
          totalItems,
          importedItems: insertedCount,
        },
      },
    });
  } catch (error) {
    console.error("Error processing inventory upload:", error);
    return NextResponse.json(
      { error: "Failed to process inventory upload" },
      { status: 500 }
    );
  }
}
