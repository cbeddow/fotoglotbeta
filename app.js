// Get the camera button element
const cameraButton = document.getElementById('camera-button');
const backButton = document.getElementById('back-button');
const languageDropdown = document.getElementById('language');

let selectedLanguage = 'en';

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
    // Translate the label to the selected language
    translateLabelToLanguage(label, selectedLanguage).then(translatedLabel => {
      // Display the predicted label over the stillframe
      const labelElement = document.getElementById('label');
      labelElement.innerHTML = translatedLabel;
      labelElement.style.display = 'block';
    });
  });
  
  // Show the "Back to Camera" button
  backButton.style.display = 'inline-block';
  // Hide the camera button
  cameraButton.style.display = 'none';
});

// Add a change event listener to the language dropdown
languageDropdown.addEventListener('change', function() {
  selectedLanguage = this.value;
});

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
  
  // Hide the "Back to Camera" button
  backButton.style.display = 'none';
  // Show the camera button
  cameraButton.style.display = 'inline-block';
});

async function classifyImage(image) {
  // Load the MobileNet model
  const model = await mobilenet.load();
  
  // Convert the image to a tensor
  const tensor = tf.browser.fromPixels(image);
  
  // Resize the tensor to 224x224 and normalize its values
  const resized = tf.image.resizeBilinear(tensor, [224, 224]).div(255);
  
  // Make a prediction with the model
  const prediction = await model.classify(resized);
  
  // Get the top predicted label
  const topLabel = prediction[0].className;
  
  // Clean up
  tensor.dispose();
  resized.dispose();
  model.dispose();
  
  // Return the label
  return topLabel;
}

async function translateLabelToLanguage(label, language) {
  // Make a request to OpenAI API for translation
  const response = await fetch('https://api.openai.com/v1/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      text: label,
      model: `text-davinci-003`,
      target_lang: language
    })
  });
  
  const data = await response.json();
  
  if (data?.translations?.length > 0) {
    return data.translations[0].translation;
  } else {
    console.error('Translation failed');
    return label;
  }
}