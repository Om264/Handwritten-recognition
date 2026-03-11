# 📂 Project Structure & File Organization

## Directory Layout

```
digit-recognition/
├── 🐍 Backend (Python/Flask)
│   ├── digit_model.py              # Model definition & training script
│   ├── app.py                      # Flask REST API server
│   ├── digit_recognition_model.pth # Trained model (generated after training)
│   ├── requirements.txt            # Python dependencies
│   └── data/                       # MNIST dataset (auto-downloaded)
│
├── ⚛️ Frontend (React/Node.js)
│   ├── public/
│   │   └── index.html             # HTML entry point
│   │
│   ├── src/
│   │   ├── index.js               # React DOM rendering
│   │   ├── index.css              # Tailwind CSS imports
│   │   ├── App.js                 # Main App component
│   │   ├── App.css                # App-level styles
│   │   └── components/
│   │       └── DigitRecognitionApp.jsx  # Main component (digit_app.jsx)
│   │
│   ├── package.json               # Node dependencies
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── node_modules/              # Dependencies (auto-created)
│
├── 📖 Documentation
│   ├── README.md                   # Project overview
│   └── INSTALLATION_GUIDE.md       # Step-by-step setup
│
└── .gitignore (optional)           # Git ignore file
```

---

## 📋 Step-by-Step File Organization

### Phase 1: Initial Setup

1. **Create main project folder:**
   ```bash
   mkdir digit-recognition
   cd digit-recognition
   ```

2. **Download all provided files** into this folder

3. **Your folder should now contain:**
   - `digit_model.py`
   - `app.py`
   - `digit_app.jsx`
   - `requirements.txt`
   - `package.json`
   - `tailwind.config.js`
   - `README.md`
   - `INSTALLATION_GUIDE.md`
   - And other supporting files

### Phase 2: React Project Initialization

Create the React project structure:

```bash
# Create React directory structure
mkdir src src/components public

# Move/copy files to correct locations
cp index.html public/
cp index.js src/
cp index.css src/
cp App.js src/
cp App.css src/
cp digit_app.jsx src/components/DigitRecognitionApp.jsx

# Create .env file (optional)
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

**After this, your src/ folder should look like:**
```
src/
├── components/
│   └── DigitRecognitionApp.jsx
├── index.js
├── index.css
├── App.js
└── App.css
```

### Phase 3: Install Dependencies

```bash
# Install Python packages
pip install -r requirements.txt

# Install Node packages
npm install
```

### Phase 4: Files Ready to Use

At this point, you have:
- ✅ `digit_model.py` - Ready to train
- ✅ `app.py` - Ready to run as server
- ✅ React app files - Ready to start with `npm start`

---

## 📝 File Descriptions

### Backend Files

#### `digit_model.py`
- **Purpose**: Define CNN architecture and train model
- **What it does**:
  - Defines `DigitRecognitionCNN` class
  - Downloads MNIST dataset
  - Trains model for 15 epochs
  - Saves model to `digit_recognition_model.pth`
- **Run**: `python digit_model.py`
- **Time**: 5-10 minutes (CPU), 1-2 minutes (GPU)
- **Output**: `digit_recognition_model.pth` (~1.1 MB)

#### `app.py`
- **Purpose**: Flask REST API server
- **What it does**:
  - Loads trained model
  - Provides `/predict` endpoint
  - Handles image preprocessing
  - Returns predictions with confidence
- **Run**: `python app.py`
- **Port**: http://localhost:5000
- **Requires**: `digit_recognition_model.pth` to exist

#### `requirements.txt`
- **Purpose**: List Python dependencies
- **Contents**:
  - torch, torchvision (deep learning)
  - flask, flask-cors (web server)
  - pillow, numpy, opencv-python (image processing)

### Frontend Files

#### `digit_app.jsx` (= `src/components/DigitRecognitionApp.jsx`)
- **Purpose**: Main React component
- **What it does**:
  - Renders drawing canvas
  - Handles mouse drawing events
  - Sends images to Flask API
  - Displays prediction results with animations
  - Shows confidence meter and probability distribution
- **Canvas Size**: 400×400 pixels
- **API Integration**: Connects to `http://localhost:5000/predict`

#### `App.js`
- **Purpose**: Root React component
- **What it does**:
  - Imports and renders `DigitRecognitionApp`
  - Sets up main layout

#### `index.js`
- **Purpose**: React DOM entry point
- **What it does**:
  - Creates React root
  - Renders App component into `#root` div

#### `public/index.html`
- **Purpose**: HTML entry point
- **Contains**:
  - `<div id="root"></div>` (React mounts here)
  - Meta tags for responsiveness
  - Page title and metadata

#### `package.json`
- **Purpose**: Node.js project configuration
- **Contains**:
  - Project metadata
  - Dependencies list
  - npm scripts (start, build, test)

#### `tailwind.config.js`
- **Purpose**: Tailwind CSS configuration
- **Customizes**:
  - Purge paths
  - Custom colors
  - Extensions

#### CSS Files
- **index.css**: Tailwind imports and global styles
- **App.css**: App-level CSS resets

### Documentation Files

#### `README.md`
- Overview of the project
- Features and architecture
- Performance metrics
- API documentation
- Troubleshooting guide

#### `INSTALLATION_GUIDE.md`
- Step-by-step installation instructions
- System requirements
- Detailed setup for both backend and frontend
- Troubleshooting solutions
- Deployment options

---

## 🔄 Workflow Overview

### Development Workflow

1. **Terminal 1 - Backend**
   ```bash
   # Train model (one time)
   python digit_model.py
   
   # Start server
   python app.py
   # Output: Running on http://127.0.0.1:5000
   ```

2. **Terminal 2 - Frontend**
   ```bash
   npm start
   # Opens http://localhost:3000
   ```

3. **Browser**
   - Open http://localhost:3000
   - Draw digit
   - Click Predict
   - View results

### Data Flow

```
User Drawing
    ↓
Canvas → Base64 Image
    ↓
POST to Flask API (/predict)
    ↓
Image Preprocessing (28×28, normalize)
    ↓
PyTorch Model Inference
    ↓
Softmax Probabilities
    ↓
JSON Response (digit, confidence, probabilities)
    ↓
React Component Updates UI
    ↓
Display Results with Animations
```

---

## 🛠️ Common Tasks

### Train Model Again
```bash
python digit_model.py
```

### Change API URL
Edit `digit_app.jsx`, find fetch URL:
```javascript
const response = await fetch('http://localhost:5000/predict', {
```

### Clear Node Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check if Ports are Available
```bash
# Check port 5000 (Flask)
lsof -i :5000

# Check port 3000 (React)
lsof -i :3000
```

### Build for Production
```bash
npm run build
# Creates optimized build in ./build folder
```

---

## ✅ Verification Checklist

After setting up all files:

- [ ] `digit_model.py` exists in root
- [ ] `app.py` exists in root
- [ ] `requirements.txt` exists in root
- [ ] `package.json` exists in root
- [ ] `src/components/DigitRecognitionApp.jsx` exists
- [ ] `public/index.html` exists
- [ ] `node_modules/` folder exists after `npm install`
- [ ] `digit_recognition_model.pth` exists after training
- [ ] `python app.py` starts Flask server
- [ ] `npm start` starts React app
- [ ] App loads at `http://localhost:3000`
- [ ] Drawing canvas appears
- [ ] Predict button works

---

## 📦 File Sizes (Approximate)

| File | Size | Purpose |
|------|------|---------|
| `digit_model.py` | 5 KB | Model training |
| `app.py` | 5 KB | Flask server |
| `digit_app.jsx` | 15 KB | React component |
| `digit_recognition_model.pth` | 1.1 MB | Trained model |
| `node_modules/` | 300+ MB | React dependencies |
| `MNIST dataset` | 11 MB | Training data |

---

## 🚀 Next Steps

1. **Organize files** as described above
2. **Install dependencies** (pip and npm)
3. **Train the model** (one time only)
4. **Start both servers** (Flask and React)
5. **Open app** in browser and start drawing!

---

## 💡 Tips

- Keep both servers running in separate terminal windows
- Don't close terminals during operation
- Check browser console (F12) for frontend errors
- Check Flask terminal for backend errors
- If changes don't appear, try hard-refresh (Ctrl+Shift+R)
- For production, run `npm run build` then deploy the `build/` folder

---

For detailed setup instructions, see **INSTALLATION_GUIDE.md**
