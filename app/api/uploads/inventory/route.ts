import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import supabase from "@/lib/supabase";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    // Get authentication info
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file uploaded",
        },
        { status: 400 }
      );
    }

    // Get the user's database ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, tier")
      .eq("clerk_user_id", userId)
      .single();

    if (userError) {
      console.error("Database user error:", userError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch user data",
        },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    const userId_db = userData.id;
    const oldTier = userData.tier || 1;

    try {
      // KNOWN VALID CATEGORIES from the database constraint
      const validCategories = ["Small", "Medium", "Large"];

      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid Excel file: No sheets found",
          },
          { status: 400 }
        );
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "Excel file contains no data",
          },
          { status: 400 }
        );
      }

      console.log(`Processing ${jsonData.length} inventory items`);

      // Log the first row to understand structure
      if (jsonData.length > 0) {
        console.log("Excel first row:", JSON.stringify(jsonData[0]));
      }

      // Map Excel data to inventory schema and assign appropriate size category
      const inventoryItems = [];

      for (const item of jsonData) {
        // Default status based on quantity
        let status = "In Stock";
        let quantity = 0;

        try {
          quantity = parseInt(String(item["Quantity"] || "0"));
          if (isNaN(quantity)) quantity = 0;
        } catch (e) {
          quantity = 0;
        }

        let reorderPoint = 0;
        try {
          reorderPoint = parseInt(String(item["Reorder Point"] || "0"));
          if (isNaN(reorderPoint)) reorderPoint = 0;
        } catch (e) {
          reorderPoint = 0;
        }

        if (quantity <= 0) {
          status = "Out of Stock";
        } else if (quantity <= reorderPoint) {
          status = "Low Stock";
        }

        // Determine which column contains the product name
        let productName = "Unknown Product";
        const possibleNameColumns = [
          "Product Title",
          "Product Name",
          "Name",
          "Product",
          "Title",
          "Description",
        ];

        for (const colName of possibleNameColumns) {
          if (item[colName] !== undefined && item[colName] !== null) {
            productName = String(item[colName]);
            break;
          }
        }

        // DETERMINE SIZE CATEGORY:
        // For defibrillators, we can categorize based on specific traits if available
        // Otherwise, default to Medium as that's likely appropriate for most items

        let sizeCategory = "Medium"; // Default to Medium for most items

        // Try to extract any size-related information from the data
        const productNameLower = productName.toLowerCase();
        const modelInfo = String(item["Model"] || "").toLowerCase();
        const description = String(item["Description"] || "").toLowerCase();

        // Check if there are explicit size indicators
        if (
          productNameLower.includes("small") ||
          modelInfo.includes("small") ||
          description.includes("small") ||
          productNameLower.includes("compact") ||
          productNameLower.includes("portable") ||
          productNameLower.includes("mini")
        ) {
          sizeCategory = "Small";
        } else if (
          productNameLower.includes("large") ||
          modelInfo.includes("large") ||
          description.includes("large") ||
          productNameLower.includes("professional") ||
          productNameLower.includes("hospital") ||
          productNameLower.includes("industrial")
        ) {
          sizeCategory = "Large";
        }

        // Create the inventory item with the valid size category
        const inventoryItem = {
          name: productName,
          // Use the determined size as the category
          category: sizeCategory,
          sku: String(
            item["Manufacturer_code"] ||
              item["SKU"] ||
              item["Product Code"] ||
              ""
          ),
          quantity: quantity,
          reorder_point: reorderPoint,
          price: parseFloat(String(item["Price"] || "0")),
          supplier: String(item["Manufacturer"] || item["Supplier"] || ""),
          last_ordered: new Date().toISOString().split("T")[0],
          status: status,
          location: String(item["Location"] || ""),
          user_id: userId_db,
          // Additional fields if they exist
          ...(item["Model"] && { model: String(item["Model"]) }),
          ...(item["Brand"] && { brand: String(item["Brand"]) }),
          ...(item["Weight"] && { weight: String(item["Weight"]) }),
          ...(item["Dimensions"] && { dimensions: String(item["Dimensions"]) }),
          ...(item["features"] && { features: String(item["features"]) }),
        };

        inventoryItems.push(inventoryItem);
      }

      // Insert inventory items in batches
      const BATCH_SIZE = 10;
      const totalItems = inventoryItems.length;
      let insertedCount = 0;
      let failedItems = [];

      for (let i = 0; i < totalItems; i += BATCH_SIZE) {
        const batch = inventoryItems.slice(
          i,
          Math.min(i + BATCH_SIZE, totalItems)
        );

        // Check if any item has more than 3900 characters in a single field
        for (const item of batch) {
          for (const [key, value] of Object.entries(item)) {
            if (typeof value === "string" && value.length > 3900) {
              (item as any)[key] = value.substring(0, 3900) + "...";
            }
          }
        }

        try {
          const { data: insertedData, error: insertError } = await supabase
            .from("inventory")
            .insert(batch)
            .select("id");

          if (insertError) {
            console.error("Insert error:", insertError);
            failedItems.push(...batch);
          } else {
            insertedCount += insertedData?.length || 0;
          }
        } catch (batchError) {
          console.error(`Batch insert error:`, batchError);
          failedItems.push(...batch);
        }
      }

      // Only proceed with tier upgrade if we actually inserted some items
      let tierUpgraded = false;

      if (insertedCount > 0 && oldTier < 2) {
        try {
          const { error: tierError } = await supabase
            .from("users")
            .update({
              tier: 2,
              tier_updated_at: new Date().toISOString(),
            })
            .eq("id", userId_db);

          if (!tierError) {
            tierUpgraded = true;

            // Log the tier change
            await supabase.from("tier_changes").insert({
              user_id: userId_db,
              old_tier: oldTier,
              new_tier: 2,
            });
          }
        } catch (tierUpdateError) {
          console.error("Error updating tier:", tierUpdateError);
          // Continue even if tier update fails
        }
      }

      return NextResponse.json({
        success: insertedCount > 0,
        message: `Successfully imported ${insertedCount} inventory items${
          failedItems.length > 0
            ? `, failed to import ${failedItems.length} items`
            : ""
        }`,
        data: {
          import: {
            totalItems,
            importedItems: insertedCount,
            failedItems: failedItems.length,
          },
          tierUpgraded: tierUpgraded,
        },
      });
    } catch (xlsxError: any) {
      console.error("XLSX processing error:", xlsxError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to process Excel file: ${xlsxError.message}`,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Top-level error during inventory upload:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to process inventory upload: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
