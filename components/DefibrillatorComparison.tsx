"use client";

import React, { useState, useEffect } from "react";
import DefibrillatorDetail from "./DefibrillatorDetail";
import SideByComparison from "./SideByComparison";

// Define types for different response formats
type ResponseType = "single" | "multiple" | "comparison" | "table" | "features";
type ViewMode = "list" | "detail" | "sideBySide";

interface BaseResponseData {
  type: ResponseType;
  title: string;
  disclaimer?: string;
}

interface SingleResponseData extends BaseResponseData {
  type: "single";
  content: string;
  importance?: string;
  actionPrompt?: string;
  isSimpleResponse?: boolean;
}

interface MultipleResponseData extends BaseResponseData {
  type: "multiple";
  items: {
    name: string;
    description: string;
    icon?: string;
  }[];
  prompt?: string;
}

interface ComparisonResponseData extends BaseResponseData {
  type: "comparison";
  items: {
    number: number;
    name: string;
    price: string;
    type: string;
    features: string[];
    manufacturer?: string;
    brand?: string;
    energy?: string;
    chargeTime?: string;
    weight?: string;
    warranty?: string;
  }[];
}

interface TableResponseData extends BaseResponseData {
  type: "table";
  headers: string[];
  rows: string[][];
  caption?: string;
}

interface FeaturesResponseData extends BaseResponseData {
  type: "features";
  features: {
    id: number;
    name: string;
    details?: string;
    category: string;
  }[];
  categories?: string[];
}

type ResponseData = SingleResponseData | MultipleResponseData | ComparisonResponseData | TableResponseData | FeaturesResponseData;

// Main Component
const DefibrillatorResponse = ({ responseText }: { responseText: string }) => {
  const [parsedData, setParsedData] = useState<ResponseData | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (responseText) {
      const data = parseResponseText(responseText);
      setParsedData(data);
    }
  }, [responseText]);

  // Function to parse the response text into the appropriate structured format
  function parseResponseText(text: string): ResponseData | null {
    // Check if the text looks like a narrative format about defibrillators
    if (
      (text.includes("defibrillator") || text.includes("Defibrillator")) &&
      text.includes("Price:") &&
      (text.includes("features") || text.includes("Features"))
    ) {
      return parseComparisonData(text);
    }

    // Otherwise use the original type detection
    const responseType = determineResponseType(text);

    switch (responseType) {
      case "single":
        return parseSingleResponse(text);
      case "multiple":
        return parseMultipleResponse(text);
      case "comparison":
        return parseComparisonData(text);
      case "table":
        return parseTableData(text);
      case "features":
        return parseFeaturesData(text);
      default:
        return null;
    }
  }

  // Function to determine the type of response
  function determineResponseType(text: string): ResponseType {
    const lowerText = text.toLowerCase();

    // Check if it has the characteristics of a narrative comparison
    if (
      (lowerText.includes("defibrillator") || lowerText.includes("aed")) &&
      (lowerText.includes("price:") || lowerText.match(/\$[\d,]+/g)) &&
      (lowerText.includes("features") || lowerText.includes("key features"))
    ) {
      return "comparison";
    }

    // Check if it's a table
    if (
      (lowerText.includes("comparison") || lowerText.includes("compare")) &&
      (lowerText.includes("table") ||
        text.includes("|") ||
        text.match(/\|\s*-+\s*\|/))
    ) {
      return "table";
    }

    // Check if it's a features list
    if (
      lowerText.includes("features") &&
      (lowerText.includes("key features") ||
        lowerText.match(/\d+\.\s+[A-Za-z]+/g))
    ) {
      return "features";
    }

    // Check if it's a comparison
    if (
      (lowerText.includes("here are") || lowerText.includes("options")) &&
      (lowerText.includes("price") || lowerText.match(/\$[\d,]+/g))
    ) {
      return "comparison";
    }

    // Check if it's a multiple response
    if (
      lowerText.match(/\d+\.\s+[A-Za-z]+/) ||
      lowerText.includes("types of") ||
      text.match(/- [A-Za-z]+/) ||
      text.match(/• [A-Za-z]+/)
    ) {
      return "multiple";
    }

    // Default to single response
    return "single";
  }

  // Parse single response (explanation or definition)
  function parseSingleResponse(text: string): SingleResponseData {
    // Check if this is a simple, short response (like Claude AI)
    const isSimpleResponse = text.split(".").length <= 2 && text.length < 200;

    let title = isSimpleResponse ? "" : "About Defibrillators";
    let content = text;
    let importance = "";
    let disclaimer = "";

    // Only parse for title/importance if it's not a simple response
    if (!isSimpleResponse) {
      // Extract title if it looks like a question was asked
      const questionMatch = text.match(
        /^(What is|How does|When should|Why is)[^?]+\?/i
      );
      if (questionMatch) {
        title = questionMatch[0];
        content = text.replace(questionMatch[0], "").trim();
      }

      // Extract importance statement
      const importanceMatches = [
        "important",
        "crucial",
        "essential",
        "significant",
        "vital",
      ];

      for (const term of importanceMatches) {
        if (text.toLowerCase().includes(term)) {
          const sentence = text
            .split(".")
            .find((s) => s.toLowerCase().includes(term));
          if (sentence) {
            importance = sentence.trim() + ".";
            break;
          }
        }
      }
    }

    // Extract disclaimer
    if (text.includes("Note:") || text.includes("Important:")) {
      const noteIndex = Math.max(
        text.indexOf("Note:"),
        text.indexOf("Important:")
      );
      const endIndex = text.indexOf(".", noteIndex);
      if (endIndex !== -1) {
        disclaimer = text.substring(noteIndex, endIndex + 1).trim();
      }
    }

    return {
      type: "single",
      title,
      content,
      importance,
      disclaimer,
      isSimpleResponse: isSimpleResponse,
    };
  }

  // Parse multiple response (list of items)
  function parseMultipleResponse(text: string): MultipleResponseData {
    let title = "Types of Defibrillators";
    let prompt = "";
    const items = [];

    // Try to extract title
    const titleMatches = [
      "types of defibrillators",
      "kinds of defibrillators",
      "defibrillator types",
    ];

    for (const titleMatch of titleMatches) {
      if (text.toLowerCase().includes(titleMatch)) {
        const index = text.toLowerCase().indexOf(titleMatch);
        const endOfSentence = text.indexOf(".", index);
        if (endOfSentence !== -1) {
          title = text.substring(index, endOfSentence).trim();
          break;
        }
      }
    }

    // Extract list items - try numbered list first
    const numberedListPattern = /(\d+)\.\s+([^:]+):?\s+([^\n]+)/g;
    let match;

    while ((match = numberedListPattern.exec(text)) !== null) {
      items.push({
        name: match[2].trim(),
        description: match[3].trim(),
      });
    }

    // If no numbered list found, try bullet points
    if (items.length === 0) {
      const bulletPattern = /(?:- |• )([^:]+):?\s+([^\n]+)/g;

      while ((match = bulletPattern.exec(text)) !== null) {
        items.push({
          name: match[1].trim(),
          description: match[2].trim(),
        });
      }
    }

    // Extract any final prompt or question
    const promptPatterns = [
      "would you like",
      "do you need",
      "can i help",
      "are you looking",
    ];

    for (const promptPattern of promptPatterns) {
      if (text.toLowerCase().includes(promptPattern)) {
        const index = text.toLowerCase().indexOf(promptPattern);
        const endOfSentence = text.indexOf("?", index);
        if (endOfSentence !== -1) {
          prompt = text.substring(index, endOfSentence + 1).trim();
          break;
        }
      }
    }

    return {
      type: "multiple",
      title,
      items,
      prompt,
    };
  }

  // Parse comparison data (for defibrillator products)
  function parseComparisonData(text: string): ComparisonResponseData {
    // Use the existing logic from the original component
    const result = {
      type: "comparison" as const,
      title: "Defibrillator Options",
      items: [] as {
        number: number;
        name: string;
        price: string;
        type: string;
        features: string[];
        manufacturer?: string;
        brand?: string;
        energy?: string;
        chargeTime?: string;
        weight?: string;
        warranty?: string;
      }[],
      disclaimer: "",
    };

    // Find disclaimer
    const disclaimerMatches = [
      "It is important to note",
      "It's important to note",
      "It's worth noting",
      "Note:",
    ];

    for (const disclaimerStart of disclaimerMatches) {
      if (text.includes(disclaimerStart)) {
        const startIndex = text.indexOf(disclaimerStart);
        const endOfSentence = text.indexOf(".", startIndex);
        if (endOfSentence !== -1) {
          result.disclaimer = text
            .substring(startIndex, endOfSentence + 1)
            .trim();
          break;
        }
      }
    }

    // Extract defibrillator listings from the text
    // Pattern 1: Numbered list starting with a number and a period
    const numberedListPattern = /(\d+)\.\s+([^:]+)(?::|Price:)\s+\$([0-9,.]+)/g;
    let match;
    let itemCounter = 0;

    // Try to find numbered list pattern
    while ((match = numberedListPattern.exec(text)) !== null) {
      const number = parseInt(match[1]);
      const name = match[2].replace(/\*\*/g, "").trim();
      const price = `$${match[3]}`;

      // Extract surrounding text for this item (up to 500 chars after the price)
      const startPos = match.index;
      const endPos = text.indexOf("\n\n", startPos + match[0].length);
      const itemText = text.substring(
        startPos,
        endPos !== -1 ? endPos : startPos + 500
      );

      // Extract features and additional info
      const features = extractFeatures(itemText);
      const additionalInfo = extractAdditionalInfo(itemText);

      result.items.push({
        number,
        name,
        price,
        type: additionalInfo.type || "Not specified", // Ensure 'type' is always provided
        ...additionalInfo,
        features,
      });

      itemCounter++;
    }

    // If no numbered list found, try narrative format patterns
    if (itemCounter === 0) {
      // Pattern for product name and price in narrative format
      const narrativePatterns = [
        /([A-Za-z0-9®\s-]+(?:Defibrillator|AED|Unit)[A-Za-z0-9®\s-]*)(?:[^$]*?)(?:Price:)?\s+\$([0-9,.]+)/gi,
        /([A-Za-z0-9®\s-]+)(?:[^$]*?)(?:Price:|costs|priced at)\s+\$([0-9,.]+)/gi,
      ];

      for (const pattern of narrativePatterns) {
        pattern.lastIndex = 0; // Reset pattern matching
        while ((match = pattern.exec(text)) !== null) {
          const name = match[1].replace(/\*\*/g, "").trim();
          const price = `$${match[2].replace(/,/g, "")}`;

          // Skip if we already have this device (by name)
          if (result.items.some((item) => item.name === name)) {
            continue;
          }

          // Extract surrounding paragraph for this item (200 chars before and 500 after)
          const startPos = Math.max(0, match.index - 200);
          const endPos = Math.min(
            text.length,
            match.index + match[0].length + 500
          );
          const itemText = text.substring(startPos, endPos);

          // Extract features and additional info
          const features = extractNarrativeFeatures(itemText);
          const additionalInfo = extractNarrativeAdditionalInfo(itemText);

          result.items.push({
            number: result.items.length + 1,
            name,
            price,
            type: additionalInfo.type || "Not specified", // Ensure 'type' is always provided
            ...additionalInfo,
            features,
          });
        }
      }
    }

    // Determine appropriate title based on content
    if (
      text.toLowerCase().includes("affordable") ||
      text.toLowerCase().includes("cheapest") ||
      text.toLowerCase().includes("lower price")
    ) {
      result.title = "Most Affordable Defibrillators";
    } else if (
      text.toLowerCase().includes("expensive") ||
      text.toLowerCase().includes("high-end") ||
      text.toLowerCase().includes("premium")
    ) {
      result.title = "Premium Defibrillator Options";
    } else if (
      text.toLowerCase().includes("best") ||
      text.toLowerCase().includes("top rated") ||
      text.toLowerCase().includes("top-rated")
    ) {
      result.title = "Top-Rated Defibrillators";
    }

    return result;
  }

  // Parse table data
  function parseTableData(text: string): TableResponseData {
    let title = "Defibrillator Comparison";
    let headers: string[] = [];
    let rows: string[][] = [];
    let caption = "";

    // Try to extract title
    const titleMatches = [
      "comparison of",
      "comparing",
      "table of",
      "overview of",
    ];

    for (const titleMatch of titleMatches) {
      if (text.toLowerCase().includes(titleMatch)) {
        const startIndex = text.toLowerCase().indexOf(titleMatch);
        const endOfSentence = text.indexOf(".", startIndex);
        if (endOfSentence !== -1) {
          title = text.substring(startIndex, endOfSentence + 1).trim();
          break;
        }
      }
    }

    // Try to extract markdown table
    const tableLines = text
      .split("\n")
      .filter((line) => line.includes("|") && !line.trim().startsWith("<!--"));

    if (tableLines.length >= 2) {
      // First line should contain headers
      const headerLine = tableLines[0];
      headers = headerLine
        .split("|")
        .map((header) => header.trim())
        .filter((header) => header.length > 0);

      // Skip separator line (usually the second line)
      let startIndex = 1;
      if (tableLines[1].includes("-")) {
        startIndex = 2;
      }

      // Extract rows
      for (let i = startIndex; i < tableLines.length; i++) {
        const rowCells = tableLines[i]
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell.length > 0);

        if (rowCells.length > 0) {
          rows.push(rowCells);
        }
      }
    }

    // If no markdown table found, try to extract data in other formats
    if (rows.length === 0) {
      // Try to extract model names
      const modelPattern = /Model(?:s)?:?\s+([A-Za-z0-9\s,]+)/i;
      const modelMatch = modelPattern.exec(text);

      if (modelMatch) {
        const modelsText = modelMatch[1];
        const models = modelsText.split(",").map((model) => model.trim());

        // Create headers and empty rows
        headers = ["Model", "Type", "Price", "Features"];
        rows = models.map((model) => [model, "", "", ""]);

        // Try to fill in some data
        for (let i = 0; i < models.length; i++) {
          const model = models[i];

          // Look for price
          const pricePattern = new RegExp(`${model}[^$]*\\$(\\d[\\d,.]+)`, "i");
          const priceMatch = pricePattern.exec(text);
          if (priceMatch) {
            rows[i][2] = `$${priceMatch[1]}`;
          }

          // Look for type
          if (text.toLowerCase().includes(model.toLowerCase())) {
            if (text.includes("AED")) {
              rows[i][1] = "AED";
            } else if (text.includes("Manual")) {
              rows[i][1] = "Manual";
            }
          }
        }
      }
    }

    // Extract caption or note about the table
    const captionPatterns = [
      "note:",
      "caption:",
      "table shows",
      "table compares",
    ];

    for (const captionPattern of captionPatterns) {
      if (text.toLowerCase().includes(captionPattern)) {
        const startIndex = text.toLowerCase().indexOf(captionPattern);
        const endOfSentence = text.indexOf(".", startIndex);
        if (endOfSentence !== -1) {
          caption = text.substring(startIndex, endOfSentence + 1).trim();
          break;
        }
      }
    }

    return {
      type: "table",
      title,
      headers,
      rows,
      caption,
    };
  }

  // Parse features data
  function parseFeaturesData(text: string): FeaturesResponseData {
    let title = "Key Defibrillator Features";
    const features: {
      id: number;
      name: string;
      details?: string;
      category: string;
    }[] = [];
    let disclaimer = "";

    // Try to extract title
    const titleMatches = [
      "key features",
      "main features",
      "important features",
      "essential features",
    ];

    for (const titleMatch of titleMatches) {
      if (text.toLowerCase().includes(titleMatch)) {
        const startIndex = text.toLowerCase().indexOf(titleMatch);
        const lineEnd = text.indexOf("\n", startIndex);
        const periodEnd = text.indexOf(".", startIndex);
        const endIndex = Math.min(
          lineEnd !== -1 ? lineEnd : Number.MAX_SAFE_INTEGER,
          periodEnd !== -1 ? periodEnd + 1 : Number.MAX_SAFE_INTEGER
        );
        if (endIndex !== Number.MAX_SAFE_INTEGER) {
          title = text.substring(startIndex, endIndex).trim();
          break;
        }
      }
    }

    // Try to extract features - numbered list first
    const numberedFeaturePattern =
      /(\d+)\.\s+([^:(]+)(?:\s*\(([^)]+)\))?(?::\s*([^\n]+))?/g;
    let match;
    let counter = 0;

    while ((match = numberedFeaturePattern.exec(text)) !== null) {
      const id = parseInt(match[1]);
      const name = match[2].trim();
      const details = match[3] || match[4] || "";

      // Determine category
      let category = "general";

      if (
        name.toLowerCase().includes("display") ||
        name.toLowerCase().includes("screen")
      ) {
        category = "interface";
      } else if (
        name.toLowerCase().includes("battery") ||
        name.toLowerCase().includes("power")
      ) {
        category = "power";
      } else if (
        name.toLowerCase().includes("electrode") ||
        name.toLowerCase().includes("pad")
      ) {
        category = "electrodes";
      } else if (
        name.toLowerCase().includes("analysis") ||
        name.toLowerCase().includes("detect")
      ) {
        category = "analysis";
      } else if (
        name.toLowerCase().includes("cpr") ||
        name.toLowerCase().includes("compression")
      ) {
        category = "cpr";
      } else if (
        name.toLowerCase().includes("data") ||
        name.toLowerCase().includes("memory")
      ) {
        category = "data";
      } else if (
        name.toLowerCase().includes("technology") ||
        name.toLowerCase().includes("tech")
      ) {
        category = "technology";
      }

      features.push({
        id,
        name,
        details: details.trim(),
        category,
      });

      counter++;
    }

    // Try bullet points if no numbered list found
    if (counter === 0) {
      const bulletFeaturePattern =
        /(?:- |• )([^:(]+)(?:\s*\(([^)]+)\))?(?::\s*([^\n]+))?/g;

      while ((match = bulletFeaturePattern.exec(text)) !== null) {
        const name = match[1].trim();
        const details = match[2] || match[3] || "";

        // Determine category
        let category = "general";

        if (
          name.toLowerCase().includes("display") ||
          name.toLowerCase().includes("screen")
        ) {
          category = "interface";
        } else if (
          name.toLowerCase().includes("battery") ||
          name.toLowerCase().includes("power")
        ) {
          category = "power";
        } else if (
          name.toLowerCase().includes("electrode") ||
          name.toLowerCase().includes("pad")
        ) {
          category = "electrodes";
        } else if (
          name.toLowerCase().includes("analysis") ||
          name.toLowerCase().includes("detect")
        ) {
          category = "analysis";
        } else if (
          name.toLowerCase().includes("cpr") ||
          name.toLowerCase().includes("compression")
        ) {
          category = "cpr";
        } else if (
          name.toLowerCase().includes("data") ||
          name.toLowerCase().includes("memory")
        ) {
          category = "data";
        } else if (
          name.toLowerCase().includes("technology") ||
          name.toLowerCase().includes("tech")
        ) {
          category = "technology";
        }

        features.push({
          id: counter + 1,
          name,
          details: details.trim(),
          category,
        });

        counter++;
      }
    }

    // Extract disclaimer
    const disclaimerMatches = [
      "note:",
      "important:",
      "disclaimer:",
      "these features vary",
    ];

    for (const disclaimerStart of disclaimerMatches) {
      if (text.toLowerCase().includes(disclaimerStart)) {
        const startIndex = text.toLowerCase().indexOf(disclaimerStart);
        const endOfSentence = text.indexOf(".", startIndex);
        if (endOfSentence !== -1) {
          disclaimer = text.substring(startIndex, endOfSentence + 1).trim();
          break;
        }
      }
    }

    // Get unique categories
    const categories = Array.from(new Set(features.map((f) => f.category)));

    return {
      type: "features",
      title,
      features,
      categories,
      disclaimer,
    };
  }

  // Helper functions from original component
  function extractFeatures(itemText: string) {
    const features = [];

    // Look for bullet points or dashes
    const bulletPoints = itemText.match(/(?:- |• )([^\n-•]+)/g);
    if (bulletPoints) {
      bulletPoints.forEach((point) => {
        const feature = point.replace(/^- |^• /, "").trim();
        if (
          feature &&
          !feature.toLowerCase().includes("manufacturer:") &&
          !feature.toLowerCase().includes("brand:") &&
          !feature.toLowerCase().includes("operation type:")
        ) {
          features.push(feature);
        }
      });
    }

    // If no bullet points, try to extract features from sentences
    if (features.length === 0) {
      const sentences = itemText.split(/\. |\.\n/);
      for (let i = 1; i < sentences.length; i++) {
        // Skip first sentence (usually has the price)
        const sentence = sentences[i].trim();
        if (
          sentence &&
          !sentence.toLowerCase().includes("would you like") &&
          !sentence.toLowerCase().includes("here are") &&
          !sentence.startsWith("It")
        ) {
          features.push(sentence);
        }
      }
    }

    return features.length > 0 ? features : ["No specific features mentioned"];
  }

  function extractAdditionalInfo(itemText: string) {
    const info: {
      type?: string;
      manufacturer?: string;
      brand?: string;
      energy?: string;
      chargeTime?: string;
      weight?: string;
      warranty?: string;
    } = {};

    // Extract operation type
    if (itemText.toLowerCase().includes("fully automatic")) {
      info.type = "Fully Automatic";
    } else if (itemText.toLowerCase().includes("semi-automatic")) {
      info.type = "Semi-Automatic";
    } else if (itemText.toLowerCase().includes("automatic")) {
      info.type = "Automatic";
    } else if (itemText.toLowerCase().includes("manual operation")) {
      info.type = "Manual Operation";
    } else {
      info.type = "Not specified";
    }

    // Extract manufacturer
    const manufacturerMatch = itemText.match(/[Mm]anufacturer:?\s+([^,\n]+)/);
    if (manufacturerMatch) {
      info.manufacturer = manufacturerMatch[1].trim();
    }

    // Extract brand
    const brandMatch = itemText.match(/[Bb]rand:?\s+([^,\n]+)/);
    if (brandMatch) {
      info.brand = brandMatch[1].trim();
    }

    // Extract energy output
    const energyMatch = itemText.match(/[Ee]nergy [Oo]utput:?\s+([^,\n]+)/);
    if (energyMatch) {
      info.energy = energyMatch[1].trim();
    }

    // Extract charge time
    const chargeMatch = itemText.match(/[Cc]harge [Tt]ime:?\s+([^,\n]+)/);
    if (chargeMatch) {
      info.chargeTime = chargeMatch[1].trim();
    }

    // Extract weight
    const weightMatch = itemText.match(/[Ww]eight:?\s+([^,\n]+)/);
    if (weightMatch) {
      info.weight = weightMatch[1].trim();
    }

    // Extract warranty
    const warrantyMatch = itemText.match(/[Ww]arranty:?\s+([^,\n]+)/);
    if (warrantyMatch) {
      info.warranty = warrantyMatch[1].trim();
    }

    return info;
  }

  // New function to extract features from narrative text
  function extractNarrativeFeatures(itemText: string): string[] {
    const features = [];

    // Look for a features section that starts with "key features", "features include", etc.
    const featureSectionStarts = [
      "key features",
      "features include",
      "some key features",
      "features of this",
      "include:",
      "features:",
    ];

    let featureSection = "";
    for (const startPhrase of featureSectionStarts) {
      if (itemText.toLowerCase().includes(startPhrase)) {
        const startIndex =
          itemText.toLowerCase().indexOf(startPhrase) + startPhrase.length;
        const nextParagraph = itemText.indexOf("\n\n", startIndex);
        const endIndex = nextParagraph !== -1 ? nextParagraph : itemText.length;
        featureSection = itemText.substring(startIndex, endIndex);
        break;
      }
    }

    // If we found a feature section, try to parse it
    if (featureSection) {
      // Look for bullet points or dashes
      const bulletPoints = featureSection.match(/(?:- |• |^\* )([^\n-•]+)/gm);
      if (bulletPoints) {
        bulletPoints.forEach((point) => {
          const feature = point.replace(/^- |^• |^\* /, "").trim();
          if (feature) {
            features.push(feature);
          }
        });
      } else {
        // If no bullet points, split by lines or commas
        const lines = featureSection.split(/\n|,/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (
            trimmed &&
            !trimmed.toLowerCase().includes("manufacturer:") &&
            !trimmed.toLowerCase().includes("price:")
          ) {
            features.push(trimmed);
          }
        }
      }
    }

    // If we still don't have features, try to extract specifications as features
    if (features.length === 0) {
      // Look for technical specifications with colon
      const specPattern = /([A-Za-z\s]+):\s+([^,\n]+)/g;
      let specMatch;
      while ((specMatch = specPattern.exec(itemText)) !== null) {
        const specName = specMatch[1].trim();
        const specValue = specMatch[2].trim();

        // Skip some common non-feature specs
        if (
          !specName.toLowerCase().includes("price") &&
          !specName.toLowerCase().includes("manufacturer") &&
          !specName.toLowerCase().includes("brand")
        ) {
          features.push(`${specName}: ${specValue}`);
        }
      }
    }

    // If we still don't have features, try to find sentences with feature keywords
    if (features.length === 0) {
      const featureKeywords = [
        "display",
        "portable",
        "lightweight",
        "battery",
        "rechargeable",
        "technology",
        "automatic",
        "manual",
        "adult",
        "pediatric",
        "pads",
        "guidance",
        "instruction",
        "training",
        "warranty",
        "certified",
      ];

      const sentences = itemText.match(/[^.!?]+[.!?]+/g) || [];
      for (const sentence of sentences) {
        for (const keyword of featureKeywords) {
          if (
            sentence.toLowerCase().includes(keyword) &&
            !sentence.toLowerCase().includes("price") &&
            !sentence.toLowerCase().includes("would you like")
          ) {
            features.push(sentence.trim());
            break;
          }
        }
      }
    }

    return features.length > 0 ? features : ["No specific features mentioned"];
  }

  // Enhanced function to extract additional info from narrative text
  function extractNarrativeAdditionalInfo(itemText: string) {
    const info: {
      type?: string;
      manufacturer?: string;
      brand?: string;
      energy?: string;
      chargeTime?: string;
      weight?: string;
      warranty?: string;
    } = {};

    // Extract operation type
    if (itemText.toLowerCase().includes("fully automatic")) {
      info.type = "Fully Automatic";
    } else if (itemText.toLowerCase().includes("semi-automatic")) {
      info.type = "Semi-Automatic";
    } else if (itemText.toLowerCase().includes("automatic / manual")) {
      info.type = "Automatic / Manual";
    } else if (itemText.toLowerCase().includes("automatic and manual")) {
      info.type = "Automatic / Manual";
    } else if (itemText.toLowerCase().includes("automatic")) {
      info.type = "Automatic";
    } else if (itemText.toLowerCase().includes("manual operation")) {
      info.type = "Manual Operation";
    } else if (itemText.toLowerCase().includes("manual")) {
      info.type = "Manual";
    } else {
      info.type = "Not specified";
    }

    // Pattern to match various specifications
    const specPatterns = [
      { regex: /[Mm]anufacturer:?\s+([^,\n.]+)/, key: "manufacturer" },
      { regex: /[Bb]rand:?\s+([^,\n.]+)/, key: "brand" },
      { regex: /[Ee]nergy [Oo]utput:?\s+([^,\n.]+)/, key: "energy" },
      { regex: /[Ee]nergy:?\s+([^,\n.]+)/, key: "energy" },
      { regex: /[Cc]harge [Tt]ime:?\s+([^,\n.]+)/, key: "chargeTime" },
      { regex: /[Cc]harge:?\s+([^,\n.]+(?:seconds|sec))/, key: "chargeTime" },
      { regex: /[Ww]eight:?\s+([^,\n.]+(?:lbs|pounds|kg))/, key: "weight" },
      { regex: /([0-9.]+\s*(?:lbs|pounds|kg))/, key: "weight" },
      { regex: /[Ww]arranty:?\s+([^,\n.]+)/, key: "warranty" },
      { regex: /([0-9]+[- ]year warranty)/, key: "warranty" },
    ];

    for (const { regex, key } of specPatterns) {
      const match = itemText.match(regex);
      if (match && match[1]) {
        info[key as keyof typeof info] = match[1].trim();
      }
    }

    return info;
  }

  // Function to extract key features in a more concise format
  const extractKeyFeatures = (featureText: string) => {
    if (!featureText) return [];

    const text = featureText.toLowerCase();
    const keyFeatures = [];

    if (text.includes("lightweight")) keyFeatures.push("Lightweight");
    if (text.includes("portable")) keyFeatures.push("Portable");
    if (text.includes("user-friendly")) keyFeatures.push("User-friendly");
    if (text.includes("voice prompt")) keyFeatures.push("Voice prompts");
    if (text.includes("reliability") || text.includes("reliable"))
      keyFeatures.push("Reliable");
    if (text.includes("ease of use") || text.includes("easy to use"))
      keyFeatures.push("Easy to use");
    if (text.includes("professional")) keyFeatures.push("Professional grade");
    if (text.includes("automatic")) keyFeatures.push("Automatic operation");
    if (text.includes("manual")) keyFeatures.push("Manual operation");
    if (text.includes("display")) keyFeatures.push("Digital display");
    if (text.includes("battery")) keyFeatures.push("Battery operated");
    if (text.includes("quick")) keyFeatures.push("Quick response");
    if (text.includes("warranty")) keyFeatures.push("Warranty included");
    if (text.includes("lcd")) keyFeatures.push("LCD display");
    if (text.includes("advanced")) keyFeatures.push("Advanced features");
    if (text.includes("cpr")) keyFeatures.push("CPR guidance");
    if (text.includes("pad") || text.includes("electrode"))
      keyFeatures.push("Electrode pads");
    if (text.includes("adjustable")) keyFeatures.push("Adjustable settings");
    if (text.includes("quick charge") || text.includes("fast charge"))
      keyFeatures.push("Quick charging");
    if (text.includes("guidance") || text.includes("guide"))
      keyFeatures.push("User guidance");

    // If we didn't find any specific keywords, just return the original text (shortened if needed)
    if (keyFeatures.length === 0) {
      // Trim to reasonable length and add ellipsis if needed
      const trimmed =
        featureText.length > 50
          ? featureText.substring(0, 50) + "..."
          : featureText;
      return [trimmed];
    }

    return keyFeatures;
  };

  // Handler for viewing device details
  const handleViewDeviceDetail = (index: number) => {
    setSelectedDeviceIndex(index);
    setViewMode("detail");
  };

  // Handler for showing side-by-side comparison
  const handleViewSideBySide = () => {
    setViewMode("sideBySide");
  };

  // Handler for returning to list view
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedDeviceIndex(null);
  };

  // If no data or invalid response, don't render anything
  if (!parsedData) {
    return null;
  }

  // View a specific device detail
  if (
    viewMode === "detail" &&
    parsedData.type === "comparison" &&
    selectedDeviceIndex !== null
  ) {
    return (
      <DefibrillatorDetail
        device={parsedData.items[selectedDeviceIndex]}
        onBackClick={handleBackToList}
      />
    );
  }

  // View side-by-side comparison
  if (viewMode === "sideBySide" && parsedData.type === "comparison") {
    return (
      <SideByComparison
        devices={parsedData.items}
        onBackClick={handleBackToList}
        disclaimer={parsedData.disclaimer}
      />
    );
  }

  // Render main list view
  return (
    <div className="w-full mt-6 p-6 bg-white rounded-xl shadow-md">
      {/* Title for all response types */}
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        {parsedData.title}
      </h2>

      {/* Single Response */}
      {parsedData.type === "single" && (
        <div className="prose max-w-none">
          {parsedData.isSimpleResponse ? (
            // Simple Claude-like response without header or special formatting
            <div className="text-gray-700">{parsedData.content}</div>
          ) : (
            // Regular formatted response with header
            <>
              <div className="text-gray-700 mb-4">{parsedData.content}</div>
              {parsedData.importance && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-blue-800">{parsedData.importance}</p>
                </div>
              )}
            </>
          )}

          {parsedData.disclaimer && (
            <div className="mt-4 text-sm text-gray-500 italic">
              {parsedData.disclaimer}
            </div>
          )}

          {parsedData.actionPrompt && !parsedData.isSimpleResponse && (
            <div className="mt-6 flex justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
                {parsedData.actionPrompt}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Multiple Response */}
      {parsedData.type === "multiple" && (
        <div className="space-y-4">
          {parsedData.items.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {index + 1}. {item.name}
              </h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
          {parsedData.prompt && (
            <div className="mt-6 text-center">
              <p className="text-blue-600 font-medium">{parsedData.prompt}</p>
            </div>
          )}
        </div>
      )}

      {/* Comparison */}
      {parsedData.type === "comparison" && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {parsedData.items.map((device) => (
              <div
                key={device.number}
                className="border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
              >
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-center">
                  {parsedData.items.length > 1 ? (
                    <span>
                      #{device.number}{" "}
                      {parsedData.title.includes("Affordable")
                        ? "Most Affordable"
                        : "Recommended"}
                    </span>
                  ) : (
                    <span>
                      {parsedData.title.includes("Affordable")
                        ? "Most Affordable Option"
                        : "Recommended Option"}
                    </span>
                  )}
                </div>
                <div
                  className="p-5 flex-grow flex flex-col cursor-pointer hover:bg-gray-50"
                  onClick={() => handleViewDeviceDetail(device.number - 1)}
                >
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    {device.name}
                  </h3>
                  <div className="mb-3">
                    <span className="text-xl font-bold text-blue-600">
                      {device.price}
                    </span>
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {device.type && (
                      <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold">
                        {device.type}
                      </span>
                    )}
                    {device.manufacturer && (
                      <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-semibold">
                        {device.manufacturer}
                      </span>
                    )}
                    {device.brand && !device.name.includes(device.brand) && (
                      <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-xs font-semibold">
                        {device.brand}
                      </span>
                    )}
                  </div>

                  {/* Additional specs (if available) */}
                  {(device.energy ||
                    device.chargeTime ||
                    device.weight ||
                    device.warranty) && (
                    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Specifications
                      </h4>
                      <div className="grid grid-cols-1 gap-1">
                        {device.energy && (
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 mr-2">Energy:</span>
                            <span className="text-gray-800">
                              {device.energy}
                            </span>
                          </div>
                        )}
                        {device.chargeTime && (
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 mr-2">
                              Charge Time:
                            </span>
                            <span className="text-gray-800">
                              {device.chargeTime}
                            </span>
                          </div>
                        )}
                        {device.weight && (
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 mr-2">Weight:</span>
                            <span className="text-gray-800">
                              {device.weight}
                            </span>
                          </div>
                        )}
                        {device.warranty && (
                          <div className="flex items-center text-sm">
                            <span className="text-gray-500 mr-2">
                              Warranty:
                            </span>
                            <span className="text-gray-800">
                              {device.warranty}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Key Features */}
                  <div className="mt-auto">
                    <h4 className="font-semibold mb-2 text-gray-700">
                      Key Features:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {device.features.flatMap((feature) =>
                        extractKeyFeatures(feature).map((keyFeature, idx) => (
                          <span
                            key={`${device.number}-${idx}`}
                            className="inline-block bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700"
                          >
                            {keyFeature}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {parsedData.disclaimer && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium">Note:</span>{" "}
                {parsedData.disclaimer}
              </p>
            </div>
          )}
          {/* User options */}
          <div className="mt-6 text-center">
            <p className="text-blue-600 mb-4">
              Would you like more detailed information about any of these
              models, or would you prefer a side-by-side comparison of their
              specifications?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                onClick={handleViewSideBySide}
              >
                View side-by-side comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {parsedData.type === "table" && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {parsedData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedData.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {parsedData.caption && (
            <div className="mt-4 text-sm text-gray-500 italic text-center">
              {parsedData.caption}
            </div>
          )}
        </div>
      )}

      {/* Features */}
      {parsedData.type === "features" && (
        <div>
          {/* Category filters */}
          {parsedData.categories && parsedData.categories.length > 1 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  All Features
                </button>
                {parsedData.categories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parsedData.features
              .filter(
                (feature) =>
                  activeCategory === "all" ||
                  feature.category === activeCategory
              )
              .map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm mr-3">
                      {feature.id}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {feature.name}
                      </h3>
                      {feature.details && (
                        <p className="text-sm text-gray-600 mt-1">
                          {feature.details}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs">
                          {feature.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {parsedData.disclaimer && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium">Note:</span>{" "}
                {parsedData.disclaimer}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DefibrillatorResponse;