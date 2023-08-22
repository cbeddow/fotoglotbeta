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
  