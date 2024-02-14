import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import Swiper from 'swiper';
import 'swiper/css';

// Initialize Firebase app
const app = firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Storage service
const storage = firebase.storage();
const imageRef = storage.ref('images/');

const uploadFile = async (file) => {
  try {
    // upload file to Firebase storage
    const uploadTask = imageRef.child(file.name).put(file);

    // Get upload progress
    uploadTask.on('state_changed',
      (snapshot) => {
        // Handle progress
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Handle Errors
        console.error('Upload failed:', error);
      },
      () => {
        // Handle successfuly upload
        console.log('Upload successful');
        window.location.href = 'my_photo.html'; // Redirect to my_photo.html after successful upload
      }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

// Fetch image URLs
const fetchImageURLs = async () => {
  try {
    const imageList = await imageRef.listAll();
    const imageURLs = await Promise.all(imageList.items.map(async (item) => {
      return getDownloadURL(item);
    }));
    return imageURLs;
  } catch (error) {
    console.error('Error fetching image URLs: ', error);
    return [];
  }
};

// Event listener for form submission
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  
  const fileInput = document.querySelector('.btn-choose-file');
  const file = fileInput.files[0]; // Get the selected file
  
  if (file) {
    // Call uploadFile() function with the selected file
    await uploadFile(file);
  } else {
    console.error('No file selected');
  }
});







