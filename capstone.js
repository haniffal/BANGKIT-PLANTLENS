let model;
async function loadModel() {
    model = await tf.loadLayersModel('model_tfjs/model.json');
    console.log("Model loaded successfully!");
}

function handleImageUpload(event) {
    const image = document.getElementById('image');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.style.display = 'block';
    image.onload = function() {
        predictImage(image);
    }
}

async function predictImage(image) {
    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([160, 160])  // Sesuaikan ukuran gambar
        .toFloat()
        .expandDims(0)
        .div(tf.scalar(255));

    const predictions = await model.predict(tensor).data();
    displayPrediction(predictions);
}

function displayPrediction(predictions) {
    const result = predictions[0] > 0.5 ? "Penyakit Terdeteksi" : "Tanaman Sehat";
    document.getElementById('predictionResult').innerText = `Prediksi: ${result}`;
}
