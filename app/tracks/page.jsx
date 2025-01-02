"use client";

import MusicListLazy from "@/components/musicList/musicListLazy";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function Page() {
  const searchParams = useSearchParams();
  const genre = searchParams.get("genre");

  return (
    <div className="mt-32 flex justify-center items-center flex-col">
      <h1 className="text-5xl pb-8">All Tracks</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <MusicListLazy genreFilter={genre || ""} />
      </Suspense>
    </div>
  );
}

export default Page;
