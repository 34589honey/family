import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const storage = getStorage();

function uploadDocument(file, userId) {
  const storageRef = ref(storage, `${userId}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on('state_changed', 
    () => {}, 
    (error) => console.error(error), 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        // Save to Firestore DB as well
      });
    }
  );
}
