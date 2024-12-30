"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { redirect } from "next/navigation";
import { AudioPlayer } from "react-audio-play";
import { useRouter } from "next/navigation";

const MusicListLazy = () => {
  const [musicList, setMusicList] = useState(null);
  const [lastDoc, setLastDoc] = useState(null); // For tracking the last loaded document
  const [isLoading, setIsLoading] = useState(false);
  const [isEnd, setIsEnd] = useState(false); // State to track if it's the end
  const loaderRef = useRef(null);

  const router = useRouter();

  // Fetch the next set of documents
  const fetchMoreMusic = async () => {
    if (isLoading) return; // Prevent multiple triggers
    setIsLoading(true);

    try {
      const musicRef = collection(db, "music");
      let q = query(musicRef, orderBy("generatedAt", "desc"), limit(15));

      // If there's a last document, use startAfter to paginate
      if (lastDoc) {
        q = query(
          musicRef,
          orderBy("generatedAt", "desc"),
          startAfter(lastDoc),
          limit(15)
        );
      }

      const querySnapshot = await getDocs(q);

      const newMusic = [];
      let newLastDoc = null;

      querySnapshot.forEach((doc) => {
        const docData = { id: doc.id, ...doc.data() };
        newMusic.push({
          ...docData,
          generatedAt: docData.generatedAt?.toDate().toISOString(),
        });
        newLastDoc = doc; // Track the last document
      });

      if (newMusic.length > 0) {
        // Append the new music list only if there are new documents
        musicList
          ? setMusicList((prev) => [...prev, ...newMusic])
          : setMusicList(newMusic);
        setLastDoc(newLastDoc); // Update last document for pagination
      } else {
        // If no new music is found, it's the end
        setIsEnd(true);
      }
    } catch (error) {
      console.error("Error fetching more music:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Observe the loader element
  useEffect(() => {
    if (isEnd) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreMusic();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [isEnd, loaderRef.current, lastDoc]); // Re-run if the loaderRef or lastDoc changes

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {musicList?.map((item) => (
        <div
          key={item.id}
          className=" group p-4 pr-6 pb-6 flex flex-col justify-between relative z-[1] bg-foreground border rounded-lg before:content-[' '] before:border before:rounded-lg before:absolute before:-left-2 before:-top-2 before:bg-background before:h-full before:w-full before:border-foreground before:-z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 24 24"
            className="invisible absolute group-hover:visible top-0 right-4 h-7 w-7 cursor-pointer bg-foreground fill-background p-1 rounded-full"
            onClick={() => router.push(`/track/${item.id}`)}
          >
            <path d="M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 L 5 3 z M 14 3 L 14 5 L 17.585938 5 L 8.2929688 14.292969 L 9.7070312 15.707031 L 19 6.4140625 L 19 10 L 21 10 L 21 3 L 14 3 z"></path>
          </svg>
          <div>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <AudioPlayer
            src={item.audioUrl}
            style={{ zIndex: "2" }}
            className="custom-audio-player bg-foreground"
          />
          {/* <audio controls className="mt-4 w-full">
            <source src={item.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio> */}
        </div>
      ))}
      <div ref={loaderRef} className="h-10"></div>
      {isLoading && <p>Loading more...</p>}
      {isEnd && <p className="mt-4 text-center text-xl">That's the end!</p>}
    </div>
  );
};

export default MusicListLazy;
