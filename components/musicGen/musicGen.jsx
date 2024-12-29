"use client";

import { useState } from "react";
import MusicInputScreen from "./musicInputScreen";
import MusicReviewScreen from "./musicReviewScreen";

const MusicGenApp = () => {
  const [message, setMessage] = useState("");
  const [generationTime, setGenerationTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleGenerateSuccess = (url, blob, time) => {
    setAudioUrl(url);
    setAudioBlob(blob);
    setGenerationTime(time);
  };

  const handleBack = () => {
    setAudioUrl(null);
  };

  return (
    <div className="max-w-2xl mx-auto w-[50vw] min-w-64">
      {!audioUrl ? (
        <MusicInputScreen
          message={message}
          setMessage={setMessage}
          onGenerateSuccess={handleGenerateSuccess}
        />
      ) : (
        <MusicReviewScreen
          audioUrl={audioUrl}
          audioBlob={audioBlob}
          generationTime={generationTime}
          message={message}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default MusicGenApp;
