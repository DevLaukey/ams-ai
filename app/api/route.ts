  import { NextResponse } from "next/server";

  const API_URL = "http://3.92.135.80:5000/api/chat";

  export async function POST(request: Request) {
    try {
      const body = await request.json();

      // Prepare the request body in the format expected by the API
      // Log the incoming request for debugging
      console.log("Incoming request body:", body);

      // Check if we have either message or question field
      const userMessage = body.message || body.question;

      if (!userMessage) {
        return NextResponse.json(
          {
            error: "Missing required field: message or question",
          },
          { status: 400 }
        );
      }

      // Prepare the request body in the format expected by the API
       const requestBody = {
         session_id: body.session_id || "new-test",
         message: body.message,
       };

      // Log what we're sending to the API
      console.log("Sending to API:", requestBody);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Try to get more information about the error
        const errorText = await response.text();
        console.error(`API error (${response.status}):`, errorText);

        try {
          // If it's JSON, parse it for better error details
          const errorJson = JSON.parse(errorText);
          throw new Error(
            `API returned ${response.status}: ${JSON.stringify(errorJson)}`
          );
        } catch (e) {
          // If not JSON, use the raw text
          throw new Error(`API returned ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();

      // Return the response in the same format as the external API
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error in chat API route:", error);
      return NextResponse.json(
        {
          response: {
            error: "Failed to process request",
            response:
              "I apologize, but I encountered an error processing your request. Please try again.",
          },
        },
        { status: 500 }
      );
    }
  }
