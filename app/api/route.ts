
import { NextResponse } from 'next/server';

const API_URL = "https://ams-api-534297186371.us-central1.run.app/";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // Return the response in the same format as the external API
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      {
        response: {
          error: 'Failed to process request',
          response:
            'I apologize, but I encountered an error processing your request. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
