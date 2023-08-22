// Get the camera button element
const cameraButton = document.getElementById("camera-button");

navigator.mediaDevices
  .getUserMedia({
    video: { facingMode: { exact: "environment" } },
  })
  .then(function (stream) {
    var video = document.querySelector("#video");
    video.srcObject = stream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
  })
  .catch(function (err) {
    console.log("Error: " + err);
  });

// Add a click event listener to the camera button
cameraButton.addEventListener("click", function () {
  // Get the video, canvas, and stillframe elements
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const stillframe = document.getElementById("stillframe");
  const labelElement = document.getElementById("label");
  const languageSelect = document.getElementById("language-select");

  // Hide the video element, show the stillframe element
  video.style.display = "none";
  stillframe.style.display = "block";

  // Capture the image from the video stream
  canvas
    .getContext("2d")
    .drawImage(video, 0, 0, canvas.width, canvas.height);
  stillframe.setAttribute("src", canvas.toDataURL("image/png"));

  // Classify the captured image
  classifyImage(stillframe).then((label) => {
    const selectedLanguage = languageSelect.value;

    if (selectedLanguage !== "en") {
      // Translate the label to the selected language
      translateText(label, selectedLanguage).then((translation) => {
        // Display the translated label over the stillframe
        labelElement.innerHTML = translation;
        labelElement.style.display = "block";
      });
    } else {
      // Display the label without translation
      labelElement.innerHTML = label;
      labelElement.style.display = "block";
    }
  });

  // Show the "Back to Camera" button
  backToCameraButton.style.display = "inline-block";
});

// Get the back button element
const backToCameraButton = document.getElementById("back-button");

// Add a click event listener to the back button
backToCameraButton.addEventListener("click", function () {
  // Get the video, canvas, and stillframe elements
  const video = document.getElementById("video");
  const stillframe = document.getElementById("stillframe");
  const labelElement = document.getElementById("label");
  const languageSelect = document.getElementById("language-select");

  // Hide the stillframe element, show the video element
  stillframe.style.display = "none";
  video.style.display = "block";

  // Hide the label and reset the selected language
  labelElement.style.display = "none";
  languageSelect.value = "en";

  // Hide the "Back to Camera" button
  backToCameraButton.style.display = "none";
});

function classifyImage(image) {
  return new Promise((resolve, reject) => {
    // Load the MobileNet model
    tf.loadGraphModel(
      "https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/5"
    )
      .then((model) => {
        // Convert the image to a tensor
        const tensor = tf.browser.fromPixels(image);

        // Resize the tensor to 224x224 and normalize its values
        const resized = tf.image
          .resizeBilinear(tensor, [224, 224])
          .div(255)
          .expandDims();

        // Make a prediction with the model
        model.predict(resized).data().then((prediction) => {
          // Get the top predicted label
          const topLabelIndex = Array.from(prediction).indexOf(
            Math.max(...prediction)
          );
          fetch(
            "https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_1.0_224_frozen.json"
          )
            .then((res) => res.json())
            .then((data) => {
              const label = data[topLabelIndex];
              resolve(label);
            })
            .catch((error) => reject(error));
        });
      })
      .catch((error) => reject(error));
  });
}

function translateText(text, language) {
  return new Promise((resolve, reject) => {
    // Make a request to OpenAI for translation
    fetch("https://api.openai.com/v1/engines/translation-codex/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
      },
      body: JSON.stringify({
        prompt: `Translate the following English text to ${language}: ${text}`,
        max_tokens: 16,
        temperature: 0,
        top_p: 1.0,
        n: 1,
        stop: ["\n"],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const translations = data.choices[0].text.trim().split("\n");
        const translation = translations[translations.length - 1];
        resolve(translation);
      })
      .catch((error) => reject(error));
  });
}