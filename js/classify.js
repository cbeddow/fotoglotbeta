function classifyMN(img) {
  // Load the model.
  mobilenet.load().then(model => {
    // Classify the image.
    model.classify(img).then(predictions => {
      console.log('Predictions: ');
      console.log(predictions);
    });
  });
}

async function classifyCC(img) {
    // Load the model.
    const model = await cocoSsd.load();
  
    // Detect objects in the image.
    const predictions = await model.detect(img);
  
    // Get the output class.
    const outputClass = predictions[0]['class'];
  
    // add output text to screen
    addText(outputClass);

    // Return the output class.
    return outputClass;
  }
  
