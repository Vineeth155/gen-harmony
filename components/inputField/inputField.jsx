"use client";

import { useAuth } from "@/app/context/authContext";
import { useState, useEffect } from "react";

const MusicGenApp = () => {
  const { user } = useAuth();

  const [message, setMessage] = useState(""); // User input for music description
  const [audioUrl, setAudioUrl] = useState(null); // URL of the generated audio
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [success, setSuccess] = useState(false); // Success state
  const [generationTime, setGenerationTime] = useState(0); // Time taken to generate audio
  const [intervalId, setIntervalId] = useState(0); // Store interval ID to clear it later

  // Function to handle the music generation
  const handleGenerateMusic = async () => {
    // Reset the previous state
    setAudioUrl(null);
    setError("");
    setSuccess(false);
    setLoading(true);
    setGenerationTime(0); // Reset generation time

    // Start a real-time counter while loading
    const id = setInterval(() => {
      setGenerationTime((prevTime) => prevTime + 1);
    }, 1000); // Update every second
    setIntervalId(id);

    try {
      // Prepare the data for the Hugging Face API
      const data = {
        inputs: message, // User input describing the music
      };

      // Call the Hugging Face MusicGen API directly
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_BREARER_TOKEN}`, // Hugging Face API token
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      // Check if the response was successful
      if (!response.ok) {
        throw new Error(
          `Hugging Face API request failed: ${response.statusText}`
        );
      }

      // Convert the response to a blob (audio data)
      const audioBlob = await response.blob();

      // Helper: Convert blob to base64
      const blobToBase64 = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString("base64");
      };

      // Convert the blob to a Base64 string
      const base64Audio = await blobToBase64(audioBlob);

      // Create an audio URL from the Base64 string
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      setAudioUrl(audioUrl); // Set the audio URL
      setSuccess(true); // Indicate success
    } catch (error) {
      // Handle errors
      setError(
        "Error generating music: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      // Turn off loading state and stop the timer
      clearInterval(id);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="rounded-md max-w-2xl mx-auto bg-background border-2 border-foreground shadow-lg">
      <h1 className="text-3xl p-6 font-semibold text-center text-foreground mb-6 bg-background border-2 border-b-4 border-foreground">
        Generate Music from Text
      </h1>

      {/* Input for the music description */}
      <div className="px-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter music description (e.g., liquid drum and bass, atmospheric synths, airy sounds)"
          rows={5}
          className="rounded-md resize-none w-full p-4 border border-foreground mb-4 focus:outline-8 focus:outline-forebackground bg-background text-foreground"
        />

        {/* Generate Music Button */}
        {user ? (
          <button
            onClick={handleGenerateMusic}
            disabled={loading || !message || message.trim().length === 0}
            className={`rounded-md w-full py-3 bg-background mb-6 focus:outline-none font-semibold ${
              loading || !message || message.trim().length === 0
                ? "bg-gray-600 text-background"
                : "bg-background border-4 border-foreground text-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            {loading ? "Generating..." : "Generate Music"}
          </button>
        ) : (
          <div className="text-center text-foreground pb-6">
            Login To Generate
          </div>
        )}
        {/* Loading indicator */}
        {loading && (
          <div className="text-center text-foreground">
            Loading... Please wait.
          </div>
        )}

        {/* Error message */}
        {error && <div className="text-center text-red-500 mt-4">{error}</div>}

        {/* Success message */}
        {success && !error && (
          <div className="text-center text-green-500">
            <strong>Success!</strong> Your music has been generated.
          </div>
        )}

        {/* Display the time taken to generate audio */}
        {loading && (
          <div className="text-center text-foreground mt-4 pb-2">
            <strong>Generation Time:</strong> {generationTime} seconds
          </div>
        )}

        {/* Audio player for the generated music */}
        {audioUrl && (
          <div className="text-center mt-2 pb-4">
            <h3 className="text-xl font-semibold text-foreground">
              Generated Music:
            </h3>
            <audio
              controls
              src={audioUrl}
              className="mt-4 w-full max-w-xs mx-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicGenApp;
