import TrackCard from "../../../components/trackCard/trackCard";

export default async function Page({ params }) {
  const slug = (await params).slug;

  return (
    <div className="mt-32 w-full flex flex-col justify-center items-center pb-32">
      <h1
        className="text-center font-semibold text-xl mx-4 lg:text-3xl"
        style={{ lineBreak: "anywhere" }}
      >
        Track ID: {slug}
      </h1>
      <TrackCard slug={slug} />
    </div>
  );
}
