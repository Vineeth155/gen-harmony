"use client";

import fetchMusicWithUserDetails from "@/utils/fetchMusicWithUserDetails";
import { useEffect, useState } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/audioPlayer/audioPlayer";

export default function TrackCard({ slug }) {
  const [musicData, setMusicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await fetchMusicWithUserDetails(slug);
        setMusicData(details);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!musicData) {
    return <p>No Music Data available.</p>;
  }

  const { music, user } = musicData;

  return (
    <div className="max-w-11/12 px-4 lg:max-w-4/5 grid grid-cols-1 sm:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[0.5fr_1.5fr] mt-12 xl:gap-8">
      <div className="h-full">
        {music?.description && (
          <AudioPlayer
            url={music?.audioUrl}
            // title={music.name}
            description={music?.description}
          />
        )}
      </div>
      {music && (
        <div className="w-fit h-full pl-4 ">
          <div>
            <p className="invisible sm:visible">Title</p>
            <h2 className="text-6xl font-medium border-2 border-foreground w-fit p-1 pb-2">
              {music?.name}
            </h2>
          </div>
          <p className="text-xl mb-8 border-2 border-foreground w-fit p-1">
            {music?.description}
          </p>
          {user && (
            <Link
              href={`/profile/${music.userId}`}
              className="group flex border-2 border-foreground w-fit hover:bg-foreground hover:text-background font-medium ease-in-out duration-800"
            >
              <span className="block p-1">{user.displayName}</span>
              {"  "}
              <span className="block p-1 text-background bg-foreground h-full border-l border-transparent group-hover:border-background">
                ({user?.genMusic?.length} tracks)
              </span>
            </Link>
          )}
          {music && (
            <div className="mt-8 border-2 border-foreground w-fit p-1">
              <p>
                <span className="px-2 py-1 mr-2 bg-foreground text-background border border-foreground w-fit rounded-full">
                  {music?.likes}
                </span>
                likes
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
