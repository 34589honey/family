import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"; 

const db = getFirestore();

async function logAction(userId, action) {
  await addDoc(collection(db, "logs"), {
    userId,
    action,
    timestamp: serverTimestamp()
  });
}
