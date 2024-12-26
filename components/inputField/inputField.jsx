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

    // Prepare form data
    const formData = new FormData();
    formData.append("message", message);

    try {
      // Make the API request to the backend
      const response = await fetch("/api/hf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Stop the real-time counter once the request is completed
      clearInterval(id);

      // Check if the response contains audio (base64 string)
      if (data.audioBase64) {
        // Create the audio URL from base64 string
        const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
        setAudioUrl(audioUrl); // Set audio URL to play the audio
        setSuccess(true); // Show success message
      } else {
        setError("Failed to generate music"); // Show error if no audio is returned
      }
    } catch (error) {
      // Handle errors in the fetch request
      setError(
        "Error generating music: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      // Turn off loading state
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Generate Music from Text
      </h1>

      {/* Input for the music description */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter music description (e.g., liquid drum and bass, atmospheric synths, airy sounds)"
        rows={5}
        className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Generate Music Button */}
      {user ? (
        <button
          onClick={handleGenerateMusic}
          disabled={loading || !message || message.trim().length === 0}
          className={`w-full py-3 text-white rounded-lg mb-6 focus:outline-none ${
            loading || !message || message.trim().length === 0
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Generating..." : "Generate Music"}
        </button>
      ) : (
        <div className="text-center text-gray-500">Login to generate</div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center text-gray-500">Loading... Please wait.</div>
      )}

      {/* Error message */}
      {error && <div className="text-center text-red-500 mt-4">{error}</div>}

      {/* Success message */}
      {success && !error && (
        <div className="text-center text-green-500 mt-4">
          <strong>Success!</strong> Your music has been generated.
        </div>
      )}

      {/* Display the time taken to generate audio */}
      {loading && (
        <div className="text-center text-gray-700 mt-4">
          <strong>Generation Time:</strong> {generationTime} seconds
        </div>
      )}

      {/* Audio player for the generated music */}
      {audioUrl && (
        <div className="text-center mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
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
  );
};

export default MusicGenApp;
