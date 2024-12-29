"use client";

import React, { useEffect, useState } from "react";
import fetchMusicRecordsByIds from "@/utils/fetchMusicRecordsByIds";
import { useAppContext } from "@/app/context/appContext";
import AudioPlayer from "../audioPlayer/audioPlayer";

const ProfileTracks = () => {
  const { user } = useAppContext();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedRecords = await fetchMusicRecordsByIds(user?.genMusic);
        setRecords(fetchedRecords);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user?.genMusic]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="py-4 mt-16 relative">
      <h2 className="z-10 bg-background text-2xl sticky top-16 font-bold mb-4 text-center border-2 border-foreground p-2">
        Music Collection
      </h2>
      {/* <MusicCardList records={records} /> */}
      <div className="grid grid-cols-4 gap-8 mt-8 w-4/5 justify-self-center">
        {records?.map((record) => (
          <AudioPlayer
            url={record?.audioUrl}
            title={record?.name}
            description={record?.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileTracks;
