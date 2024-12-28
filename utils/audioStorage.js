import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadAudio = async (audioBlob, fileName) => {
  const storage = getStorage();
  const audioRef = ref(storage, `music/${fileName}`);
  await uploadBytes(audioRef, audioBlob);
  return getDownloadURL(audioRef);
};
