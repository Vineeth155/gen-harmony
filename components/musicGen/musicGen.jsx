"use client";

import { useState } from "react";
import MusicInputScreen from "./musicInputScreen";
import MusicReviewScreen from "./musicReviewScreen";

const MusicGenApp = () => {
  const [message, setMessage] = useState("");
  const [generationTime, setGenerationTime] = useState(0);
  const [genres, setGenres] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const handleGenerateSuccess = (url, blob, time, genres) => {
    setAudioUrl(url);
    setAudioBlob(blob);
    setGenerationTime(time);
    setGenres(genres);
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
          setGenres={setGenres}
          onGenerateSuccess={handleGenerateSuccess}
        />
      ) : (
        <MusicReviewScreen
          audioUrl={audioUrl}
          audioBlob={audioBlob}
          generationTime={generationTime}
          message={message}
          genres={genres}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default MusicGenApp;
