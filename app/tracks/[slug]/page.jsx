import TrackCard from "../../../components/trackCard/trackCard";
import MusicListLazy from "../../../components/musicList/musicListLazy";
export default async function Page({ params }) {
  const slug = (await params).slug;

  return (
    <div className="relative mt-32 w-full flex flex-col justify-center items-center pb-32">
      <h1
        className="text-center font-semibold text-xl mx-4 lg:text-3xl"
        style={{ lineBreak: "anywhere" }}
      >
        Track ID: {slug}
      </h1>
      <TrackCard slug={slug} />
      <h2 className="sticky top-16 z-[2] bg-background text-center mt-24 w-full font-semibold text-xl py-3 mb-12 border-2 mx-4 lg:text-xl ">
        All Tracks
      </h2>
      <div className=" w-4/5">
        <MusicListLazy />
      </div>
    </div>
  );
}
