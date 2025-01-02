import React, { useRef, useState } from "react";
// import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
// import { PlayIcon, PauseIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { generateBase64SVG } from "@/utils/gradients";

// const sound = {
//   title: "Card Title",
//   waveType: "Ocean.mp3",
//   imageUrl: "/CalmOceanWaves.png",
// };

const AudioPlayer = ({ url, title = "", description }) => {
  const [play, setPlay] = useState(false);
  const oceanRef = useRef(null);
  const MAX = 20;

  function toggleAudio() {
    if (play) {
      oceanRef.current?.pause();
      setPlay(false);
    } else {
      void oceanRef.current?.play();
      setPlay(true);
    }
  }

  function handleVolume(e) {
    const { value } = e.target;
    const volume = Number(value) / MAX;
    oceanRef.current.volume = volume;
  }

  return (
    <>
      <main className="flex min-h-full h-full md:w-4/5 mx-auto flex-col items-center justify-center bg-background sm:w-full rounded-2xl">
        <div className="bg-accent flex h-full max-w-fit flex-col border-2 border-foreground pb-4 text-center w-full rounded-2xl ">
          <div className="relative flex-col space-y-0 h-full grid grid-rows-[1.7fr_0.3fr]">
            <Image
              width={200}
              height={200}
              className="mx-auto w-full aspect-auto flex-shrink-0 h-full object-cover rounded-t-xl"
              src={generateBase64SVG(description, 300, "square")}
              alt="waves"
            />
            <button
              onClick={toggleAudio}
              type="button"
              className="absolute right-5 left-0 top-[35%] m-auto w-9 rounded-full p-2 text-white"
            >
              {!play ? (
                // <PlayIcon className="" aria-hidden="true" />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-12 w-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            {title.trim() && (
              <dl className="mt-1 flex flex-col p-2 pb-0">
                <dd className="md:text-lg text-sm">{title}</dd>
              </dl>
            )}
            <div className="mx-4 flex pt-4">
              <input
                type="range"
                className="mr-2 w-full accent-cyan-700"
                min={0}
                max={MAX}
                onChange={(e) => handleVolume(e)}
              />
              {/* <SpeakerWaveIcon
                className="h-5 w-5 text-white"
                aria-hidden="true"
              /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <audio ref={oceanRef} loop src={url} />
      </main>
    </>
  );
};

export default AudioPlayer;
