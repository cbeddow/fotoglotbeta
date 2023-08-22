// Get the camera button element
const cameraButton = document.getElementById('camera-button');

navigator.mediaDevices.getUserMedia({
  video: { facingMode: { exact: "environment" } }
}).then(function(stream) {
  var video = document.querySelector('#video');
  video.srcObject = stream;
  video.onloadedmetadata = function(e) {
    video.play();
  };
}).catch(function(err) {
  console.log("Error: " + err);
});

// Add a click event listener to the camera button
cameraButton.addEventListener('click', function() {
  // Get the video, canvas, and stillframe elements
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const stillframe = document.getElementById('stillframe');
  
  // Hide the video and canvas elements, show the stillframe element
  video.style.display = 'none';
  canvas.style.display = 'none';
  stillframe.style.display = 'block';
  
  // Get the captured image element
  const capturedImage = document.getElementById('captured-image');
  
  // Set the source of the image element to the stillframe
  capturedImage.src = stillframe.src;
  
  // Classify the captured image
  classifyImage(capturedImage).then(label => {
    // Display the predicted label over the stillframe
    const labelElement = document.getElementById('label');
    labelElement.innerHTML = label;
    labelElement.style.display = 'block';
  });
  
  // Show the "Clear", "Copy", "Back to Camera", and "Favorite" buttons
  clearButton.style.display = 'inline-block';
  copyButton.style.display = 'inline-block';
  backButton.style.display = 'inline-block';
  favoriteButton.style.display = 'inline-block';
});

// Get the clear button element
const clearButton = document.getElementById('clear-button');

// Add a click event listener to the clear button
clearButton.addEventListener('click', function() {
  // Get the video, canvas, and stillframe elements
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const stillframe = document.getElementById('stillframe');
  
  // Get the label element and hide it
  const labelElement = document.getElementById('label');
  labelElement.style.display = 'none';
  
  // Hide the stillframe element, show the video and canvas elements
  video.style.display = 'block';
  canvas.style.display = 'block';
  stillframe.style.display = 'none';
});

// Get the copy button element
const copyButton = document.getElementById('copy-button');

// Add a click event listener to the copy button
copyButton.addEventListener('click', function() {
  // Get the label element
  const labelElement = document.getElementById('label');
  
  // Copy the label text to the clipboard
  navigator.clipboard.writeText(labelElement.innerHTML).then(function() {
    console.log('Label copied to clipboard');
  }, function() {
    console.error('Label copy failed');
  });
});

// Get the back button element
const backButton = document.getElementById('back-button');

// Add a click event listener to the back button
backButton.addEventListener('click', function() {
  // Get the video, canvas, and stillframe elements
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const stillframe = document.getElementById('stillframe');
  
  // Hide the stillframe element, show the video and canvas elements
  video.style.display = 'block';
  canvas.style.display = 'block';
  stillframe.style.display = 'none';
  
  // Hide the "Clear", "Copy", "Back to Camera", and "Favorite" buttons
  clearButton.style.display = 'none';
  copyButton.style.display = 'none';
  backButton.style.display = 'none';
  favoriteButton.style.display = 'none';
});

// Get the favorite button element
const favoriteButton = document.getElementById('favorite-button');

// Add a click event listener to the favorite button
favoriteButton.addEventListener('click', function() {
  // TODO: Add code to favorite the image and label combo
});
