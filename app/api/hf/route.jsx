// import { NextResponse } from "next/server";
// import { inference } from "@/app/utils/hf";
// import fs from "fs/promises";
// import path from "path";
// import { parse } from "url";

// export async function POST(request ) {
//   const { query } = parse(request.url, true);
//   const type = query.type;

//   const formData = await request.formData();

//   try {
//     // if (type == "comp") {
//     let message = formData.get("message");

//     const out = await inference.chatCompletion({
//       model: "facebook/musicgen-small",
//       message: [
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//       max_tokens: 1000,
//     });

//     console.log(out);

//     return NextResponse.json({ message: out }, { status: 200 });
//     // }
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { parse } from "url";

export async function POST(request) {
  const { query } = parse(request.url, true);
  const type = query.type;

  const formData = await request.formData();

  try {
    let message = formData.get("message");

    // Prepare the data to send to Hugging Face
    const data = {
      inputs: message, // User input (e.g., "liquid drum and bass, atmospheric synths, airy sounds")
    };

    // Send the request to Hugging Face's MusicGen API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_BREARER_TOKEN}`, // Replace with your Hugging Face API token
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(
        `Hugging Face API request failed: ${response.statusText}`
      );
    }

    // Convert the response to a blob (audio data)
    const audioBlob = await response.blob();

    // Convert the blob to base64 string (using a helper function)
    const base64Audio = await blobToBase64(audioBlob);

    return NextResponse.json(
      {
        audioBase64: base64Audio, // Send the base64 encoded audio data
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error); // Log the error for debugging
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Helper function to convert blob to base64 string
async function blobToBase64(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}
