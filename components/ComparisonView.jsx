import React from "react";
import { Copy, ThumbsUp, ThumbsDown, RefreshCcw } from "lucide-react";

// Component for displaying comparison items side by side
const ComparisonView = ({ items }) => {
  // If there are no items or only one item, return null
  if (!items || items.length <= 1) return null;

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex space-x-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-1 min-w-[250px] p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            {item.title && (
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {item.title}
              </h3>
            )}

            {item.image && (
              <div className="mb-3">
                <img
                  src={item.image}
                  alt={item.title || `Product ${index + 1}`}
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}

            {item.price && (
              <div className="text-lg font-bold text-blue-600 mb-2">
                {typeof item.price === "number"
                  ? `$${item.price.toFixed(2)}`
                  : item.price}
              </div>
            )}

            {item.features && item.features.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Features:
                </h4>
                <ul className="text-sm text-gray-600">
                  {item.features.map((feature, i) => (
                    <li key={i} className="mb-1 flex items-start">
                      <span className="text-green-500 mr-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {item.description && (
              <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            )}

            {/* Add any additional fields you want to display */}
            {item.specs && (
              <div className="text-xs text-gray-500">
                <h4 className="font-medium mb-1">Specifications:</h4>
                <ul>
                  {Object.entries(item.specs).map(([key, value], i) => (
                    <li key={i} className="mb-1">
                      <span className="font-medium">{key}:</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Function to detect if a response contains comparable items
const detectComparisonItems = (content) => {
  try {
    // First try to parse as JSON if it's a string
    if (typeof content === "string") {
      try {
        const data = JSON.parse(content);

        // Check if parsed data is an array with 2-3 items
        if (Array.isArray(data) && data.length >= 2 && data.length <= 3) {
          return data;
        }

        // Check if data has a specific property that contains comparison items
        if (
          data &&
          data.comparisonItems &&
          Array.isArray(data.comparisonItems) &&
          data.comparisonItems.length >= 2 &&
          data.comparisonItems.length <= 3
        ) {
          return data.comparisonItems;
        }

        // Check if data has a products array
        if (
          data &&
          data.products &&
          Array.isArray(data.products) &&
          data.products.length >= 2 &&
          data.products.length <= 3
        ) {
          return data.products;
        }
      } catch (e) {
        // If JSON parsing fails, it might be a formatted text with numbered items
        // Continue to text-based parsing below
      }

      // Text-based parsing for numbered or bulleted lists with products/comparisons
      // For better accuracy, look specifically for patterns like "1. **Product Name**: Description with $price"
      const lines = content.split("\n");
      const introRegex =
        /(?:here are|comparing|top|best|cheapest|most popular)\s+(?:the\s+)?(\d+)/i;
      const productRegex = /^\s*(\d+)\.?\s+\*\*([^*:]+)\*\*\s*:\s*(.*)/i;
      const priceRegex = /\$(\d+(?:,\d+)*(?:\.\d+)?)/;

      // First, check if this looks like a comparison list by checking for an intro line
      let itemCount = 0;
      const introMatch = content.match(introRegex);
      if (introMatch) {
        itemCount = parseInt(introMatch[1]);
        // Only continue if we expect 2-3 items
        if (itemCount < 2 || itemCount > 3) {
          return null;
        }
      }

      const potentialProducts = [];

      // Now look for numbered product items
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Look for lines that start with a number followed by a product name in bold
        const productMatch = line.match(productRegex);

        if (productMatch) {
          const productNum = parseInt(productMatch[1]);

          // Only accept product numbers 1-3
          if (productNum >= 1 && productNum <= 3) {
            const title = productMatch[2].trim();
            const description = productMatch[3].trim();

            // Try to extract price from the description
            const priceMatch = description.match(priceRegex);
            let price = null;
            if (priceMatch) {
              price = parseFloat(priceMatch[1].replace(/,/g, ""));
            }

            // Extract features from the description
            const features = [];

            // Add descriptions for different product types based on the content
            if (description.toLowerCase().includes("defibrillator")) {
              features.push(
                description.includes("automatic")
                  ? "Automatic operation"
                  : "Semi-automatic operation",
                description.includes("portable")
                  ? "Portable design"
                  : "Standard design",
                description.includes("voice")
                  ? "Voice prompts"
                  : "Visual guides"
              );
            }

            potentialProducts.push({
              title,
              price,
              description,
              features,
            });
          }
        }
      }

      // Only return the list if we found 2-3 products
      if (potentialProducts.length >= 2 && potentialProducts.length <= 3) {
        return potentialProducts;
      }

      // If we didn't find a structured comparison pattern, we can also check
      // for specific patterns common in AI responses about product comparisons
      if (
        content.includes("cheapest") ||
        content.includes("best") ||
        (content.includes("compare") && content.includes("price"))
      ) {
        // Detect line-by-line format with numbers/bullets and extract products
        const productPatterns = content.match(
          /(?:\d+\.|\*)\s+\*\*([^*:]+)\*\*:\s+([^.]+)/g
        );

        if (
          productPatterns &&
          productPatterns.length >= 2 &&
          productPatterns.length <= 3
        ) {
          const extractedProducts = productPatterns
            .map((pattern) => {
              const match = pattern.match(
                /(?:\d+\.|\*)\s+\*\*([^*:]+)\*\*:\s+(.+)/
              );
              if (match) {
                const title = match[1].trim();
                const description = match[2].trim();
                const priceMatch = description.match(
                  /\$(\d+(?:,\d+)*(?:\.\d+)?)/
                );

                return {
                  title,
                  description,
                  price: priceMatch
                    ? parseFloat(priceMatch[1].replace(/,/g, ""))
                    : null,
                  features: [],
                };
              }
              return null;
            })
            .filter(Boolean);

          if (extractedProducts.length >= 2 && extractedProducts.length <= 3) {
            return extractedProducts;
          }
        }
      }
    } else if (typeof content === "object") {
      // Handle if it's already an object
      if (
        Array.isArray(content) &&
        content.length >= 2 &&
        content.length <= 3
      ) {
        return content;
      }

      if (
        content &&
        content.comparisonItems &&
        Array.isArray(content.comparisonItems) &&
        content.comparisonItems.length >= 2 &&
        content.comparisonItems.length <= 3
      ) {
        return content.comparisonItems;
      }

      if (
        content &&
        content.products &&
        Array.isArray(content.products) &&
        content.products.length >= 2 &&
        content.products.length <= 3
      ) {
        return content.products;
      }
    }

    return null;
  } catch (e) {
    console.error("Error in detectComparisonItems:", e);
    return null;
  }
};

// Function to handle copying text to clipboard
const handleCopyText = (text) => {
  navigator.clipboard.writeText(text);
};

// Enhanced Message component to replace the current message rendering
const EnhancedMessage = ({ message }) => {

    console.log(message);
  // Try to detect if this message contains comparable items
  const comparisonItems =
    message.type === "ai" ? detectComparisonItems(message.content) : null;

  return (
    <div className="flex items-start space-x-4 mb-6">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
          ${message.type === "ai" ? "bg-blue-600" : "bg-gray-600"}`}
      >
        <span className="text-white text-sm">
          {message.type === "ai" ? "AI" : "U"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-medium">
            {message.type === "ai" ? "AMS AI" : "You"}
          </span>
          <span className="text-gray-400 text-sm">{message.timestamp}</span>
        </div>

        {(!comparisonItems || message.type !== "ai") && (
          <p
            className={`mt-2 ${
              message.type === "error" ? "text-red-500" : "text-gray-700"
            }`}
          >
            {message.content}
          </p>
        )}

        {/* Render comparison view if applicable */}
        {comparisonItems && message.type === "ai" && (
          <>
            {/* Show intro text before comparison cards if we can extract it */}
            {typeof message.content === "string" && (
              <p className="mt-2 mb-2 text-gray-700">
                {message.content.split("\n")[0]}
              </p>
            )}
            <ComparisonView items={comparisonItems} />

            {/* Show conclusion text after comparison cards if we can extract it */}
            {typeof message.content === "string" &&
              message.content.includes("note that") && (
                <p className="mt-4 text-gray-600 text-sm italic">
                  {message.content
                    .split("\n")
                    .filter(
                      (line) =>
                        line.includes("note that") ||
                        line.includes("important to") ||
                        line.includes("recommended")
                    )
                    .join(" ")}
                </p>
              )}
          </>
        )}

        {/* Sources if available */}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700">Sources:</h4>
            <ul className="text-sm text-gray-500">
              {message.sources.map((source, idx) => (
                <li key={idx} className="mt-1">
                  <a
                    href={source.url || "#"}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.title || source}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        {message.type === "ai" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => handleCopyText(message.content)}
            >
              <Copy className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ThumbsUp className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ThumbsDown className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCcw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { EnhancedMessage, ComparisonView, detectComparisonItems };
