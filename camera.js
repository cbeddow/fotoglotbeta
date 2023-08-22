// Get the camera button element
const cameraButton = document.getElementById('camera-button');

// Add a click event listener to the camera button
cameraButton.addEventListener('click', function() {
  // Get the video element
  const video = document.getElementById('video');
  
  // Get the canvas element
  const canvas = document.getElementById('canvas');
  
  // Get the stillframe element
  const stillframe = document.getElementById('stillframe');
  
  // Get the clear button element
  const clearButton = document.getElementById('clear-button');
  
  // Get the copy button element
  const copyButton = document.getElementById('copy-button');
  
  // Get the favorite button element
  const favoriteButton = document.getElementById('favorite-button');
  
  // Show the canvas and stillframe elements, hide the video element
  video.style.display = 'none';
  canvas.style.display = 'block';
  stillframe.style.display = 'block';
  
  // Get the canvas context and set its dimensions to match the video element
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw the current frame of the video onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Get the captured image element
  const capturedImage = document.getElementById('captured-image');
  
  // Set the source of the image element to the stillframe
  capturedImage.src = stillframe.toDataURL('image/jpeg', 1.0);
  
  // Classify the captured image
  classifyImage(capturedImage).then(label => {
    // Display the predicted label over the stillframe
    const labelElement = document.getElementById('label');
    labelElement.innerHTML = label;
    labelElement.style.display = 'block';
  });
  
  // Show the "Clear", "Copy", and "Favorite" buttons
  clearButton.style.display = 'inline-block';
  copyButton.style.display = 'inline-block';
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
  
  // Hide the canvas and stillframe elements, show the video element
  video.style.display = 'block';
  canvas.style.display = 'none';
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

// Get the favorite button element
const favoriteButton = document.getElementById('favorite-button');

// Add a click event listener to the favorite button
favoriteButton.addEventListener('click', function() {
  // TODO: Add code to favorite the image and label combo
});
