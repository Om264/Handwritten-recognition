from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import base64
import io
from PIL import Image
import numpy as np
import cv2
import json

# Import the model from digit_model.py
import sys
sys.path.append('.')

class DigitRecognitionCNN(nn.Module):
    def __init__(self):
        super(DigitRecognitionCNN, self).__init__()
        
        # First convolutional block
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(2, 2)
        
        # Second convolutional block
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(2, 2)
        
        # Third convolutional block
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.relu3 = nn.ReLU()
        self.pool3 = nn.MaxPool2d(2, 2)
        
        # Fully connected layers
        self.fc1 = nn.Linear(128 * 3 * 3, 256)
        self.relu4 = nn.ReLU()
        self.dropout = nn.Dropout(0.5)
        self.fc2 = nn.Linear(256, 128)
        self.relu5 = nn.ReLU()
        self.fc3 = nn.Linear(128, 10)
    
    def forward(self, x):
        # First block
        x = self.conv1(x)
        x = self.relu1(x)
        x = self.pool1(x)
        
        # Second block
        x = self.conv2(x)
        x = self.relu2(x)
        x = self.pool2(x)
        
        # Third block
        x = self.conv3(x)
        x = self.relu3(x)
        x = self.pool3(x)
        
        # Flatten
        x = x.view(x.size(0), -1)
        
        # Fully connected
        x = self.fc1(x)
        x = self.relu4(x)
        x = self.dropout(x)
        x = self.fc2(x)
        x = self.relu5(x)
        x = self.fc3(x)
        
        return x


app = Flask(__name__)
CORS(app)

# Load model globally
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = DigitRecognitionCNN().to(device)

try:
    model.load_state_dict(torch.load('digit_recognition_model.pth', map_location=device))
    model.eval()
    print(f"Model loaded successfully on {device}")
except FileNotFoundError:
    print("Warning: Model file not found. Please train the model first using digit_model.py")


def preprocess_image(image_data):
    """
    Preprocess the image for model inference
    Expects base64 encoded image data
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        
        # Resize to 28x28 (MNIST size)
        resized = cv2.resize(gray, (28, 28))
        
        # Invert colors if needed (make background white, digit black)
        # Check if the image has more white than black
        if np.mean(resized) > 127:
            resized = 255 - resized
        
        # Normalize to [0, 1]
        normalized = resized.astype(np.float32) / 255.0
        
        # Apply MNIST normalization
        normalized = (normalized - 0.1307) / 0.3081
        
        # Convert to tensor
        tensor = torch.from_numpy(normalized).unsqueeze(0).unsqueeze(0)
        
        return tensor, resized
    except Exception as e:
        raise ValueError(f"Error preprocessing image: {str(e)}")


@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict digit from image
    Expects JSON with 'image' field containing base64 encoded image
    """
    try:
        data = request.json
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Preprocess image
        image_tensor, processed_image = preprocess_image(data['image'])
        image_tensor = image_tensor.to(device)
        
        # Make prediction
        with torch.no_grad():
            outputs = model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        predicted_digit = predicted.item()
        confidence_score = confidence.item()
        
        # Get all probabilities for visualization
        all_probs = probabilities[0].cpu().numpy()
        prob_dict = {str(i): float(all_probs[i]) for i in range(10)}
        
        return jsonify({
            'digit': predicted_digit,
            'confidence': confidence_score,
            'probabilities': prob_dict,
            'success': True
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
