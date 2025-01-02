"use client";

import MusicListLazy from "@/components/musicList/musicListLazy";
import React from "react";

function Page() {
  return (
    <div className="mt-32 flex justify-center items-center flex-col">
      <h1 className="text-5xl pb-8">All Tracks</h1>
      <MusicListLazy />
    </div>
  );
}

export default Page;
