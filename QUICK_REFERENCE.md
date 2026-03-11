# ⚡ Quick Reference Cheatsheet

## 🚀 5-Minute Quick Start

```bash
# Terminal 1: Train & Run Backend
pip install -r requirements.txt
python digit_model.py              # ~5-10 min, one time only
python app.py                       # Runs on port 5000

# Terminal 2: Run Frontend
npm install                         # One time only
npm start                           # Runs on port 3000
```

✅ Open http://localhost:3000 → Draw digit → Click Predict → Done!

---

## 📁 Essential Files

| File | Purpose | Run? |
|------|---------|------|
| `digit_model.py` | Train CNN | `python digit_model.py` |
| `app.py` | Flask API | `python app.py` |
| `digit_app.jsx` | React UI | Part of `npm start` |
| `requirements.txt` | Python deps | `pip install -r requirements.txt` |
| `package.json` | Node deps | `npm install` |

---

## 🔗 URLs

| Service | URL |
|---------|-----|
| React App | http://localhost:3000 |
| Flask API | http://localhost:5000 |
| API Endpoint | http://localhost:5000/predict |
| Health Check | http://localhost:5000/health |

---

## 💻 Terminal Commands

### Backend (Python)

```bash
# Setup (one time)
pip install -r requirements.txt

# Train model (one time, 5-10 min)
python digit_model.py

# Start server (keep running)
python app.py

# Check if port 5000 is available
lsof -i :5000
```

### Frontend (Node.js)

```bash
# Setup (one time)
npm install

# Start development server (keep running)
npm start

# Build for production
npm run build

# Check if port 3000 is available
lsof -i :3000
```

---

## 🎨 UI Features

| Feature | Location |
|---------|----------|
| Drawing Canvas | Left side, 400×400px |
| Predicted Digit | Top of results panel |
| Confidence Meter | Progress bar with percentage |
| Probability Bars | All digits 0-9 with percentages |
| Predict Button | Blue button below canvas |
| Clear Button | Red button below canvas |

---

## 📊 Model Specs

```
Model Name:    DigitRecognitionCNN
Architecture:  3 Conv + 3 FC layers
Input Shape:   (1, 28, 28)           # Grayscale image
Output:        10 classes (0-9)
Parameters:    ~286K
Training Acc:  ~99.5%
Val Accuracy:  ~98.5%
Model Size:    1.1 MB
```

---

## 🐛 Quick Fixes

### "Connection refused"
```bash
# Check if Flask is running
python app.py
```

### "Module not found"
```bash
pip install -r requirements.txt    # Python
npm install                        # Node.js
```

### "Port already in use"
```bash
# Find and kill process
# macOS/Linux
lsof -i :5000  # For Flask
lsof -i :3000  # For React
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Model file not found"
```bash
# Train it first
python digit_model.py
```

### "Low accuracy"
- Write clearer digits
- Center digit on canvas
- Use thicker strokes
- Train longer (20+ epochs)

---

## 🌍 API Quick Reference

### Predict Endpoint

**Request:**
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image":"<base64_image>"}'
```

**Response:**
```json
{
  "digit": 7,
  "confidence": 0.9987,
  "probabilities": {
    "0": 0.0001,
    "1": 0.0002,
    "7": 0.9987,
    ...
  },
  "success": true
}
```

### Health Check
```bash
curl http://localhost:5000/health
```

---

## 📈 Performance Targets

| Metric | Expected |
|--------|----------|
| Training Time | 5-10 min (CPU) |
| Prediction Time | <100ms |
| Accuracy | 98%+ |
| Model Size | 1.1 MB |
| Canvas Response | <50ms |

---

## 🎯 Development Tips

1. **Keep terminals organized**
   - Terminal 1: Backend (Flask)
   - Terminal 2: Frontend (React)

2. **Testing predictions**
   ```bash
   # Use curl to test API
   curl http://localhost:5000/health
   ```

3. **Browser debugging**
   - Press F12 to open DevTools
   - Check Console for errors
   - Check Network tab for API calls

4. **Code changes**
   - Flask: Reload server (Ctrl+C, run again)
   - React: Auto-reloads on save

---

## 🔐 Default Settings

| Setting | Value |
|---------|-------|
| Canvas Size | 400×400px |
| Model Epochs | 15 |
| Batch Size | 64 |
| Learning Rate | 0.001 |
| Optimizer | Adam |
| Dropout Rate | 0.5 |

---

## 📚 File Locations

```
project-root/
├── Backend Files:
│   ├── digit_model.py
│   ├── app.py
│   ├── requirements.txt
│   └── digit_recognition_model.pth (generated)
│
├── Frontend Files:
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
│       ├── index.js
│       ├── App.js
│       └── components/
│           └── DigitRecognitionApp.jsx
│
└── Docs:
    ├── README.md
    ├── INSTALLATION_GUIDE.md
    └── PROJECT_STRUCTURE.md
```

---

## ✅ Verification Steps

```bash
# 1. Check Python
python --version        # Should be 3.8+

# 2. Check Node.js
node --version         # Should be 14+
npm --version

# 3. Install dependencies
pip install -r requirements.txt
npm install

# 4. Train model
python digit_model.py   # Wait for completion

# 5. Start Flask (Terminal 1)
python app.py

# 6. Start React (Terminal 2)
npm start

# 7. Open browser
# http://localhost:3000 should open automatically
```

---

## 🚀 Deployment Quick Links

- **Vercel (Frontend)**: `vercel deploy`
- **Heroku (Backend)**: `heroku create && git push heroku main`
- **AWS**: EC2 for backend, S3+CloudFront for frontend
- **Azure**: App Service for both

---

## 💡 Pro Tips

- **Faster Training**: Use GPU (`pip install torch-cuda`)
- **Better Accuracy**: Train more epochs (20+)
- **Production**: Use `npm run build`
- **Debugging**: Check browser console (F12)
- **API Testing**: Use Postman or curl
- **Performance**: Monitor with `top` or Task Manager

---

## 📖 Documentation Files

- **README.md**: Full project overview
- **INSTALLATION_GUIDE.md**: Step-by-step setup
- **PROJECT_STRUCTURE.md**: File organization
- **QUICK_REFERENCE.md**: This file!

---

## 🎓 Learning Resources

- PyTorch: https://pytorch.org/
- Flask: https://flask.palletsprojects.com/
- React: https://react.dev/
- MNIST: http://yann.lecun.com/exdb/mnist/

---

## ❓ FAQ

**Q: Why is prediction slow?**
A: First load takes time. Subsequent predictions are fast.

**Q: Can I use GPU?**
A: Yes, install PyTorch with CUDA support.

**Q: How do I improve accuracy?**
A: Train longer, write clearer digits, increase model capacity.

**Q: Can I deploy this?**
A: Yes, see deployment quick links above.

**Q: How to run on different port?**
A: Flask: `app.run(port=8000)`, React: `PORT=3001 npm start`

---

**Ready? Go to http://localhost:3000 and start drawing!** ✍️
