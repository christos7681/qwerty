const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const VIDEO_DIR = path.join(__dirname, 'videos');
const THUMBNAIL_DIR = path.join(__dirname, 'thumbnails');


// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve static files from the "thumbnails" folder
app.use('/thumbnails', express.static(THUMBNAIL_DIR));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to list video files
app.get('/api/videos', (req, res) => {
    fs.readdir(VIDEO_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load videos' });
        }
        const videoFiles = files.filter(file => file.endsWith('.mp4'));
        res.json(videoFiles);
    });
});

// Serve video files
app.get('/videos/:filename', (req, res) => {
    const filePath = path.join(VIDEO_DIR, req.params.filename);
    res.sendFile(filePath);
});

// Start the server
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
