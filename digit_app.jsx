import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Zap, Loader } from 'lucide-react';

const DigitRecognitionApp = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [probabilities, setProbabilities] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
    setConfidence(0);
    setProbabilities({});
    setError('');
  };

  const predictDigit = async () => {
    setLoading(true);
    setError('');
    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL('image/png');
      const base64Data = imageData.split(',')[1];

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Data }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      if (result.success) {
        setPrediction(result.digit);
        setConfidence(result.confidence);
        setProbabilities(result.probabilities);
      } else {
        setError(result.error || 'Prediction failed');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf > 0.8) return 'from-green-500 to-emerald-500';
    if (conf > 0.6) return 'from-blue-500 to-cyan-500';
    if (conf > 0.4) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeInDown">
          <div className="inline-block mb-4">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white text-sm font-bold rounded-full">
              ✨ AI POWERED
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-4 leading-tight">
            Digit Recognition
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Draw a digit and let our AI-powered deep learning model identify it with incredible accuracy. Experience the power of neural networks in real-time!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Canvas Section */}
          <div className="flex justify-center animate-fadeInLeft">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-75 animate-pulse"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Draw a Digit</h2>
                  <p className="text-gray-600">Write a number from 0-9 on the canvas</p>
                </div>
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="border-4 border-gradient-to-br from-purple-300 to-pink-300 rounded-2xl cursor-crosshair bg-white shadow-lg hover:shadow-xl transition-shadow"
                  style={{
                    borderImage: 'linear-gradient(135deg, #ec4899, #a855f7, #3b82f6) 1',
                  }}
                />
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={clearCanvas}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Trash2 size={20} />
                    Clear
                  </button>
                  <button
                    onClick={predictDigit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Predicting...
                      </>
                    ) : (
                      <>
                        <Zap size={20} />
                        Predict
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="animate-fadeInRight">
            {error && (
              <div className="mb-6 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-400 rounded-2xl">
                <p className="text-red-300 font-semibold">❌ {error}</p>
                <p className="text-red-200 text-sm mt-2">Make sure the Flask server is running on port 5000</p>
              </div>
            )}

            {prediction !== null && !error && (
              <div className="space-y-6 animate-bounceIn">
                {/* Main Prediction */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl blur-xl opacity-75 animate-pulse"></div>
                  <div className={`relative bg-gradient-to-br ${getConfidenceColor(confidence)} p-12 rounded-2xl shadow-2xl text-center`}>
                    <p className="text-white text-sm font-bold uppercase tracking-widest mb-4 opacity-90">Recognized Digit</p>
                    <div className="text-9xl font-black text-white drop-shadow-lg mb-4 animate-scaleIn">
                      {prediction}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                      <p className="text-white font-bold text-xl">
                        {(confidence * 100).toFixed(1)}% Confident
                      </p>
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Confidence Meter */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-purple-500/30 shadow-xl">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></span>
                    Confidence Meter
                  </h3>
                  <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden border border-purple-400/30">
                    <div
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getConfidenceColor(confidence)} transition-all duration-700 rounded-full`}
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-300 text-sm mt-2">
                    {confidence > 0.9 ? '🔥 Outstanding!' : confidence > 0.7 ? '⭐ Excellent!' : confidence > 0.5 ? '👍 Good!' : '🤔 Fair'}
                  </p>
                </div>

                {/* Probability Distribution */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/30 shadow-xl">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></span>
                    Prediction Probabilities
                  </h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {Object.entries(probabilities).map(([digit, prob]) => (
                      <div key={digit} className="flex items-center gap-3">
                        <span className="text-white font-bold text-lg w-8">{digit}</span>
                        <div className="flex-1">
                          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                prediction === parseInt(digit)
                                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
                              }`}
                              style={{ width: `${prob * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold w-12 text-right ${
                          prediction === parseInt(digit) ? 'text-yellow-300' : 'text-gray-300'
                        }`}>
                          {(prob * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {prediction === null && !error && (
              <div className="text-center py-20">
                <div className="inline-block mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border-2 border-purple-400/30 animate-pulse">
                    <Zap size={40} className="text-purple-300" />
                  </div>
                </div>
                <p className="text-gray-300 text-lg font-semibold">
                  Draw a digit and click<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    "Predict"
                  </span>
                  {' '}to get started!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400 text-sm">
          <p>Powered by PyTorch | CNN Deep Learning Model | MNIST Dataset</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounceIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out 0.1s both;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out 0.1s both;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        canvas {
          transition: box-shadow 0.3s ease;
        }

        canvas:hover {
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.1);
        }
      `}</style>
    </div>
  );
};

export default DigitRecognitionApp;
