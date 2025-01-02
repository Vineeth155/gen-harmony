import { useAppContext } from "@/app/context/appContext";
import { useEffect, useState } from "react";

export default function MusicInputScreen({
  onGenerateSuccess,
  message,
  setMessage,
}) {
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generationTime, setGenerationTime] = useState(0);
  const [intervalId, setIntervalId] = useState(0);

  const handleGenerateMusic = async () => {
    setError("");
    setLoading(true);
    setGenerationTime(0);

    const id = setInterval(() => {
      setGenerationTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);

    try {
      const data = { inputs: message };
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/musicgen-small",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_BREARER_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Hugging Face API request failed: ${response.statusText}`
        );
      }

      const audioBlob = await response.blob();

      const blobToBase64 = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString("base64");
      };

      const base64Audio = await blobToBase64(audioBlob);
      const audioUrl = `data:audio/wav;base64,${base64Audio}`;
      clearInterval(id);

      // Classifier request
      const classifierResponse = await fetch(
        "https://api-inference.huggingface.co/models/MIT/ast-finetuned-audioset-10-10-0.4593",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_BREARER_TOKEN}`,
          },
          body: audioBlob, // Pass the raw audio blob here
        }
      );

      if (!classifierResponse.ok) {
        throw new Error(
          `Classifier API request failed: ${classifierResponse.statusText}`
        );
      }

      const classificationResult = await classifierResponse.json();
      setLoading(false);
      onGenerateSuccess(
        audioUrl,
        audioBlob,
        generationTime,
        classificationResult
      );
    } catch (error) {
      setError(`Error generating music: ${error.message}`);
      clearInterval(id);
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="px-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter music description"
        rows={5}
        disabled={loading}
        className="rounded-md resize-none w-full p-4 border border-foreground mb-4 bg-background"
      />
      <button
        onClick={handleGenerateMusic}
        disabled={loading || !message || message.trim().length === 0 || !user}
        className={`rounded-md w-full py-3 border-4 ${
          loading || !message.trim() || !user
            ? "bg-gray-600 text-background border-transparent"
            : "bg-background border-foreground hover:bg-foreground hover:text-background duration-200"
        } `}
      >
        {loading
          ? "Generating..."
          : !user
            ? "Sign in to Generate"
            : "Generate Music"}
      </button>
      {
        <p className={`text-center mt-4 ${loading ? "visible" : "invisible"}`}>
          {generationTime} seconds
        </p>
      }
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
    </div>
  );
}
