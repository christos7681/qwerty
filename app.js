const videoPlayer = document.getElementById('videoPlayer');
const loopCheckbox = document.getElementById('loopCheckbox');
const cameraFeed = document.getElementById('cameraFeed');
const thumbnailsContainer = document.getElementById('thumbnails'); // To display thumbnails

let currentIndex = 0;
let videos = [];

// Set loop based on checkbox state
loopCheckbox.addEventListener('change', () => {
    videoPlayer.loop = loopCheckbox.checked;
});

// Access user's camera and display in #cameraFeed
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = stream;
    } catch (error) {
        console.error("Error accessing webcam:", error);
    }
}

// Load video list from the server
async function loadVideoList() {
    try {
        const response = await fetch('http://localhost:3000/api/videos');
        const videoFiles = await response.json(); // Assuming server returns an array of video filenames
        videos = videoFiles;

        // Populate thumbnails below the video player
        populateThumbnails();
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

// Populate the thumbnails based on video files
function populateThumbnails() {
    thumbnailsContainer.innerHTML = ''; // Clear any existing thumbnails

    videos.forEach((video, index) => {
        const videoElement = document.createElement('video');
        videoElement.src = `/videos/${video}`;
        videoElement.classList.add('thumbnail');
        videoElement.muted = true;  // Mute the thumbnail video
        videoElement.playsInline = true;

        // Play the thumbnail briefly to generate the first frame
        videoElement.addEventListener('loadeddata', () => {
            videoElement.currentTime = 1; // Set to 1s for a visible frame
        });

        // Add click event to change main video when thumbnail is clicked
        videoElement.addEventListener('click', () => {
            videoPlayer.src = `/videos/${video}`;
            videoPlayer.play();
        });

        thumbnailsContainer.appendChild(videoElement); // Add the thumbnail to the container
    });
}
// Initialize the camera and load videos on page load
startCamera();
loadVideoList();
