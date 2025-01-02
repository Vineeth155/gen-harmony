import { useState } from "react";
import { useAppContext } from "@/app/context/appContext";
import { client } from "@/utils/sanityClient";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import useUpdateData from "@/hooks/useUpdateData";
import { useRouter } from "next/navigation";

export default function MusicReviewScreen({
  audioUrl,
  audioBlob,
  generationTime,
  message,
  onBack,
  genres,
}) {
  const [name, setName] = useState("");
  const { userID, user } = useAppContext();
  const { updateData } = useUpdateData();

  const labels = genres.slice(1).map((item) => item.label);

  const router = useRouter();

  const handlePublish = async () => {
    const audioFile = new File([audioBlob], "audio-file.wav", {
      type: "audio/wav",
    });

    try {
      const audioAsset = await client.assets.upload("file", audioFile, {
        contentType: "audio/wav",
        filename: "generated-audio.wav",
      });

      const sanityAudioUrl = audioAsset.url;

      await client.create({
        _type: "audio",
        title: name, // Assuming title is added to your form
        description: message,
        audioUrl: sanityAudioUrl, // Store the Sanity URL in Firebase
        generationTime: generationTime,
        generatedAt: new Date().toISOString(),
        userId: userID, // User ID from your app context
        userMail: user.email,
      });

      const musicMetaData = {
        userId: userID,
        description: message,
        audioUrl: sanityAudioUrl,
        generationTime,
        generatedAt: serverTimestamp(),
        genres: labels,
        likes: 1,
        comments: [],
        isPublic: true,
        name,
      };

      try {
        const collectionRef = collection(db, "music");
        const newDocRef = await addDoc(collectionRef, musicMetaData);

        const unsubscribe = onSnapshot(
          doc(db, "music", newDocRef.id),
          (doc) => {
            if (doc.exists()) {
              const updatedGenMusic =
                user.genMusic.length !== null
                  ? [...user.genMusic, newDocRef.id]
                  : [newDocRef.id];
              updateData("users", userID, "genMusic", updatedGenMusic);
              unsubscribe();
              router.push(`/tracks/${newDocRef.id}`);
            }
          }
        );
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.error("Error publishing audio:", error);
    }
  };

  return (
    <div className="px-4">
      <audio controls src={audioUrl} className="mt-4 w-full mb-6" />
      {labels && (
        <div className="flex gap-1 flex-wrap">
          {labels.map((label, index) => (
            <p className="px-2 py-1 border rounded-[20rem] text-xs" key={index}>
              {label}
            </p>
          ))}
        </div>
      )}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name your audio"
        className="rounded-md w-full p-2 border border-foreground mt-4 text-foreground bg-background"
      />
      <button
        onClick={handlePublish}
        disabled={!name.trim()}
        className={`rounded-md w-full py-3 bg-background border-4 border-foreground mt-4 ${name.trim() ? "hover:bg-foreground hover:text-background duration-200" : "bg-gray-400 border-gray-400"}`}
      >
        Publish
      </button>
      <button
        onClick={onBack}
        className="rounded-md w-full py-3 bg-gray-600 mt-2 text-background dark:text-foreground hover:text-foreground hover:bg-slate-200 dark:hover:text-background duration-200"
      >
        Back
      </button>
    </div>
  );
}
