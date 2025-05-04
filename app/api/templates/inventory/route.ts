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

    // Sample product data (20 rows)
    const data = Array.from({ length: 20 }).map((_, i) => {
      const brands = [
        "MedEquip",
        "LifeSaver",
        "CardioPro",
        "HealthTech",
        "MediCore",
      ];
      const models = [`MD-${100 + i}`];
      const manufacturers = [
        "MediTech Inc.",
        "GlobalHealth",
        "BioSystems Ltd.",
        "PulseCorp",
        "CareMakers",
      ];
      const countries = ["USA", "Germany", "China", "Japan", "UK"];
      const applications = [
        "Emergency",
        "Surgery",
        "ICU",
        "Ambulance",
        "Clinic",
      ];
      const chargeTimes = [
        "5 Seconds",
        "7 Seconds",
        "10 Seconds",
        "3 Seconds",
        "6 Seconds",
      ];
      const contactTypes = ["Paddles", "Pads"];
      const powerSources = ["AC", "Battery", "AC / Battery"];
      const operationTypes = ["Manual", "Automatic", "Semi-Automatic"];
      const promptTypes = ["Voice", "Visual", "None"];
      const locations = [
        "Warehouse A",
        "Warehouse B",
        "Main Store",
        "Offsite",
        "Storage Room",
      ];
      const features = [
        "Rechargeable, Portable",
        "Lightweight, Durable",
        "Wireless, High Capacity",
        "Multi-language, Easy to Use",
        "Compact, Waterproof",
      ];

      return [
        `Defibrillator ${i + 1}`,
        (Math.random() * (2000 - 500) + 500).toFixed(2),
        `CODE-${1000 + i}`,
        `MD-${100 + i}`,
        brands[i % brands.length],
        manufacturers[i % manufacturers.length],
        countries[i % countries.length],
        applications[i % applications.length],
        chargeTimes[i % chargeTimes.length],
        contactTypes[i % contactTypes.length],
        "10 x 5 x 3 Inch",
        "LCD",
        `${Math.floor(Math.random() * 200 + 100)} joules`,
        operationTypes[i % operationTypes.length],
        powerSources[i % powerSources.length],
        promptTypes[i % promptTypes.length],
        `${Math.floor(Math.random() * 89999999 + 10000000)}`,
        `${Math.floor(Math.random() * 7 + 3)} lbs`,
        `${Math.floor(Math.random() * 26 + 5)}`,
        `${Math.floor(Math.random() * 9 + 2)}`,
        locations[i % locations.length],
        features[i % features.length],
      ];
    });

    // Create a worksheet with headers and product data
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

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
