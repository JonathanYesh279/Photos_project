const express = require("express");
const multer = require("multer");
const path = require("path");
const admin = require("firebase-admin");
const serviceAccount = require('./serviceAccountKey.json');
const port = 5000;
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://photos-project-b23da.appspot.com',
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/upload', upload.array('image', 10), async (req, res) => {
  console.log('Upload route handler called.');

  try {
    const bucket = admin.storage().bucket();

    // Iterrrate over each uploaded file
    for (const file of req.files) {
      const imageBuffer = file.buffer;
      const imageName = file.originalname;
      const cloudFile = bucket.file(imageName);

      await cloudFile.save(imageBuffer, { contentType: 'image/png' });

      const [exists] = await cloudFile.exists();
      if (exists) {
        console.log('Image uploaded successfully', imageName);
        // Redirect to my_photos.html after successful upload
      } else {
        console.log('Image upload failed', imageName);
      }
    }
    res.redirect('/my_photos.html');
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Please choose a file.');
  }
});


app.get('/images', async (req, res) => {
  try {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles();
    const imageUrls = await Promise.all(files.map(async (file) => {
      const [_, imageName] = file.name.split('/');
      const signedUrls = await bucket 
        .file(file.name)
        .getSignedUrl({
          action: 'read',
          expires: '03-09-2025', 
        })
      return signedUrls[0];
    }));
    const imagesHtml = imageUrls.map((url) => `<img src="${url}" />`).join('');
    res.send(imagesHtml);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Error fetching images.');
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
