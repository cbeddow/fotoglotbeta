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
    
    // Translate the label if it's not in English
    const selectedLanguage = document.getElementById('language-select').value;
    if (selectedLanguage !== 'English') {
      translateLabel(label, 'English', selectedLanguage).then(translation => {
        labelElement.innerHTML = translation;
      });
    }
  });
  
  // Show the "Clear", "Back to Camera", and "Favorite" buttons
  clearButton.style.display = 'inline-block';
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
  
  // Hide the "Clear", "Back to Camera", and "Favorite" buttons
  clearButton.style.display = 'none';
  backButton.style.display = 'none';
  favoriteButton.style.display = 'none';
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
  
  // Hide the "Clear", "Back to Camera", and "Favorite" buttons
  clearButton.style.display = 'none';
  backButton.style.display = 'none';
  favoriteButton.style.display = 'none';
});

// Get the favorite button element
const favoriteButton = document.getElementById('favorite-button');

// Add a click event listener to the favorite button
favoriteButton.addEventListener('click', function() {
  // TODO: Add code to favorite the image and label combo
});

async function classifyImage(image) {
  // Load the InceptionV3 model
  const model = await tf.loadGraphModel('https://tfhub.dev/google/tfjs-model/imagenet/inception_v3/classification/5');
  
  // Convert the image to a tensor
  const tensor = tf.browser.fromPixels(image);
  
  // Resize the tensor to 299x299 and normalize its values
  const resized = tf.image.resizeBilinear(tensor, [299, 299]).div(255);
  
  // Make a prediction with the model
  const prediction = await model.predict(resized.expandDims());
  
  // Get the top predicted label
  const topLabelIndex = prediction.argMax(1).dataSync()[0];
  const labels = await fetch('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224_frozen.json').then(res => res.json());
  const label = labels[topLabelIndex];
  
  // Clean up
  tensor.dispose();
  resized.dispose();
  prediction.dispose();
  model.dispose();
  
  // Return the label
  return label;
}

async function translateLabel(text, sourceLanguage, targetLanguage) {
  const apiKey = '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';
  
  // Prepare the translation request
  const translateRequest = {
    text: text,
    sourceLanguage: sourceLanguage,
    targetLanguage: targetLanguage
  };
  
  try {
    // Send the translation request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(translateRequest)
    });
    
    if (!response.ok) {
      throw new Error('Translation request failed');
    }
    
    const translation = await response.json();
    
    // Extract the translated text from the response
    const translatedText = translation.data.translations[0].translation;
    
    // Return the translated text
    return translatedText;
  } catch (error) {
    console.error(error);
    return text; // Return the original text on error
  }
}