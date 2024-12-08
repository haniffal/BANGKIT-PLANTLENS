import sys
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
from PIL import Image
import os

# Ambil path file gambar dari argumen
image_input = sys.argv[1]

# Fungsi untuk memuat gambar dari path lokal
def load_image(input_path):
    if os.path.exists(input_path):
        img = Image.open(input_path)
    else:
        raise ValueError("Input harus berupa path lokal yang valid.")
    return img

# Memuat gambar
img = load_image(image_input)

# Preprocessing gambar
img = img.resize((224, 224))
img_array = np.array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0

# Memuat model .h5
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'models', 'plant_disease_model.h5')
model = load_model(model_path)

# Daftar kelas untuk prediksi
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Corn___Cercospora_leaf_spot Gray_leaf_spot', 'Corn___Common_rust', 'Corn___healthy',
    'Corn___Northern_Leaf_Blight', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___healthy',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Orange___Haunglongbing_(Citrus_greening)',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___healthy',
    'Potato___Late_blight', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
    'Strawberry___healthy', 'Strawberry___Leaf_scorch', 'Tomato___Bacterial_spot', 'Tomato___Early_blight',
    'Tomato___healthy', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_mosaic_virus',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
]

# Prediksi
predictions = model.predict(img_array)
predicted_class = np.argmax(predictions, axis=-1)
predicted_class_name = class_names[predicted_class[0]]

# Output prediksi
print(predicted_class_name)



# Ambil URL gambar dari argumen
#image_url = sys.argv[1]

# Mendownload gambar dari URL
#response = requests.get(image_url)
#img = Image.open(BytesIO(response.content))

# Memuat model .h5
#model = load_model('./models/plant_disease_model.h5')

# Daftar kelas untuk prediksi
#class_names = [
#    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
#    'Corn___Northern_Leaf_Blight', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___healthy',
#    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Orange___Haunglongbing_(Citrus_greening)',
#    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___healthy',
#    'Potato___Late_blight', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew',
#    'Strawberry___healthy', 'Strawberry___Leaf_scorch', 'Tomato___Bacterial_spot', 'Tomato___Early_blight',
#    'Tomato___healthy', 'Tomato___Late_blight', 'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot',
#    'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot', 'Tomato___Tomato_mosaic_virus',
#   'Tomato___Tomato_Yellow_Leaf_Curl_Virus'
#]

# Preprocessing gambar
#img = img.resize((224, 224))
#img_array = np.array(img)
#mg_array = np.expand_dims(img_array, axis=0)
#mg_array = img_array / 255.0

# Prediksi
#predictions = model.predict(img_array)
#predicted_class = np.argmax(predictions, axis=-1)
#redicted_class_name = class_names[predicted_class[0]]

# Output prediksi
#print(predicted_class_name)



