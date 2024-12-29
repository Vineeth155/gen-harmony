"use client";

import { generateBase64SVG } from "@/utils/gradients";
import useFetchDataByID from "../../hooks/useFetchDataByID";
import fetchDataByID from "@/utils/fetchDataByID";
import { useEffect, useState } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/audioPlayer/audioPlayer";

export default function TrackCard({ slug }) {
  const [user, setUser] = useState(null);
  const { fetchedData } = useFetchDataByID(slug, "music");
  const data = fetchedData?._document?.data?.value?.mapValue?.fields;

  useEffect(() => {
    const fetchUser = async () => {
      if (data?.userId?.stringValue) {
        try {
          const lead = await fetchDataByID(data.userId.stringValue, "users");
          if (!lead.error) {
            setUser(lead.data);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser(); // Call the async function
  }, [data]);

  return (
    <div className="w-4/5 grid grid-cols-[0.5fr_1.5fr] mt-12">
      <div className="h-full">
        {data?.description && (
          //   <img
          //     className={`object-cover h-full max-h-full`}
          //     alt={data?.description?.stringValue}
          //     src={generateBase64SVG(
          //       data?.description?.stringValue,
          //       300,
          //       "square"
          //     )}
          //   />
          <AudioPlayer
            url={data?.audioUrl?.stringValue}
            // title={data.name.stringValue}
            image={generateBase64SVG(
              data?.description?.stringValue,
              300,
              "square"
            )}
          />
        )}
      </div>
      {data && (
        <div className="w-full h-full px-4 ">
          <div>
            <p>Title</p>
            <h2 className="text-6xl font-medium border-2 border-foreground w-fit p-1 pb-2">
              {data?.name?.stringValue}
            </h2>
          </div>
          <p className="text-xl mb-8 border-2 border-foreground w-fit p-1">
            {data?.description?.stringValue}
          </p>
          {user && (
            <Link
              href={`/profile/${data.userId.stringValue}`}
              className="group flex border-2 border-foreground w-fit hover:bg-foreground hover:text-background font-medium ease-in-out duration-800"
            >
              <span className="block p-1">{user.displayName}</span>
              {"  "}
              <span className="block p-1 text-background bg-foreground h-full border-l border-transparent group-hover:border-background">
                ({user?.genMusic?.length} tracks)
              </span>
            </Link>
          )}
          {data && (
            <div className="mt-8 border-2 border-foreground w-fit p-1">
              <p>
                <span className="px-2 py-1 mr-2 bg-foreground text-background border border-foreground w-fit rounded-full">
                  {data?.likes.integerValue}
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
