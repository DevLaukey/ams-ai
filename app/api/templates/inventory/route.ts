import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Define the column headers for the inventory template
    const headers = [
      "Product Title",
      "Price",
      "Manufacturer_code",
      "Model",
      "Brand",
      "Manufacturer",
      "Country of Origin",
      "Application",
      "Charge Time",
      "Contact Type",
      "Dimensions",
      "Display Type",
      "Energy Output",
      "Operation Type",
      "Power Source",
      "Prompt Type",
      "UNSPSC Code",
      "Weight",
      "Quantity",
      "Reorder Point",
      "Location",
      "features",
    ];

    // Create a worksheet with headers only
    const ws = XLSX.utils.aoa_to_sheet([headers]);

    // Add example row with format instructions
    const exampleRow = [
      "Example Product", // Product Title
      "100.00", // Price
      "ABC-123", // Manufacturer_code
      "Model123", // Model
      "Example Brand", // Brand
      "Example Manufacturer", // Manufacturer
      "USA", // Country of Origin
      "Category", // Application
      "5 Seconds", // Charge Time
      "Paddles", // Contact Type
      "10 x 5 x 3 Inch", // Dimensions
      "LCD", // Display Type
      "100-200 joules", // Energy Output
      "Automatic", // Operation Type
      "AC / Battery", // Power Source
      "Voice", // Prompt Type
      "12345678", // UNSPSC Code
      "5 lbs", // Weight
      "10", // Quantity
      "3", // Reorder Point
      "Warehouse A", // Location
      "Feature 1, Feature 2", // features
    ];

    // Add the example row
    XLSX.utils.sheet_add_aoa(ws, [exampleRow], { origin: "A2" });

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Template");

    // Convert the workbook to a buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Create response with appropriate headers for file download
    return new NextResponse(buf, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="inventory_template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error generating template:", error);
    return NextResponse.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}
