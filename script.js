import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

// Initialize Firebase app
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Storage service
const storage = firebase.storage();
const imageRef = storage.ref('images/');

// Get references to HTML elements
const btnUpload = document.querySelector('.btn-submit');
const fileInput = document.querySelector('.btn-choose-file');
const fileErrorMessage = document.querySelector('.file-error-message');

// Event listener for the upload button
btnUpload.addEventListener('click', (e) => {
  e.preventDefault();

  // Check if a file is selected
  if (fileInput.files.length === 0) {
    fileErrorMessage.style.display = 'block';
    return;
  }

  window.location.href = '/my_photos.html';

  imageRef
    .getDownloadURL()
    .then(function (url) {
      // Once we have the download URL, we set it to our img element
      const img = document.createElement('img');
      img.src = url;
      const imageContainer = document.querySelector('.image-container');
      imageContainer.appendChild(img);
    })
    .catch(function (error) {
      // If anything goes wrong while getting the download URL, log the error
      console.error(error);
    });
});








