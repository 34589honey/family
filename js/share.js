import { auth, db } from './db.js';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const shareForm = document.getElementById('shareForm');
const shareStatus = document.getElementById('shareStatus');

onAuthStateChanged(auth, (user) => {
  if (user) {
    shareForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const docName = document.getElementById('docName').value;
      const recipientEmail = document.getElementById('recipientEmail').value;

      if (!docName || !recipientEmail) {
        shareStatus.innerText = "Please enter all fields.";
        return;
      }

      try {
        const docRef = doc(db, 'documents', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userDocs = docSnap.data().files || [];

          const fileToShare = userDocs.find(file => file.name === docName);
          if (!fileToShare) {
            shareStatus.innerText = "Document not found.";
            return;
          }

          // Add to recipient's shared_docs
          const recipientRef = doc(db, 'shared_docs', recipientEmail);
          await setDoc(recipientRef, {
            files: arrayUnion({
              name: fileToShare.name,
              url: fileToShare.url,
              owner: auth.currentUser.email,
              sharedAt: new Date().toISOString()
            })
          }, { merge: true });

          shareStatus.innerText = "Document shared successfully!";
        } else {
          shareStatus.innerText = "No documents found to share.";
        }
      } catch (error) {
        console.error("Error sharing document:", error);
        shareStatus.innerText = "Failed to share document.";
      }
    });
  } else {
    window.location.href = 'login.html';
  }
});
