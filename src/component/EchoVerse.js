import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Volume2, 
  Download, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Headphones,
  Eye,
  Settings,
  Mic,
  Zap,
  Heart,
  Shield
} from 'lucide-react';

const EchoVerse = () => {
  const [inputText, setInputText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [selectedTone, setSelectedTone] = useState('neutral');
  const [selectedVoice, setSelectedVoice] = useState('lisa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const fileInputRef = useRef(null);

  const tones = [
    { 
      id: 'neutral', 
      name: 'Neutral', 
      icon: Shield, 
      gradient: 'from-blue-400 to-cyan-500',
      description: 'Clear and balanced narration'
    },
    { 
      id: 'suspenseful', 
      name: 'Suspenseful', 
      icon: Zap, 
      gradient: 'from-purple-500 to-pink-600',
      description: 'Dramatic and engaging delivery'
    },
    { 
      id: 'inspiring', 
      name: 'Inspiring', 
      icon: Heart, 
      gradient: 'from-orange-400 to-red-500',
      description: 'Uplifting and motivational tone'
    }
  ];

  const voices = [
    { id: 'lisa', name: 'Lisa', description: 'Warm and professional female voice' },
    { id: 'michael', name: 'Michael', description: 'Confident and clear male voice' },
    { id: 'allison', name: 'Allison', description: 'Friendly and expressive female voice' }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setInputText(content);
        setOriginalText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      setOriginalText(inputText);
      setIsProcessing(true);
      
      // Simulate API processing
      setTimeout(() => {
        const mockRewritten = `[${selectedTone.toUpperCase()} TONE] ${inputText}`;
        setRewrittenText(mockRewritten);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const generateAudio = () => {
    if (rewrittenText) {
      setIsProcessing(true);
      
      // Simulate audio generation
      setTimeout(() => {
        setAudioUrl('/api/generated-audio.mp3'); // Mock URL
        setIsProcessing(false);
      }, 3000);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'echoverse-audiobook.mp3';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            EchoVerse
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your text into expressive, AI-powered audiobooks with customizable tones and natural-sounding voices
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* Text Input Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Input Your Text</h3>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here or upload a .txt file..."
                  className="w-full h-48 bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload .txt</span>
                  </button>
                  
                  <button
                    onClick={handleTextSubmit}
                    disabled={!inputText.trim() || isProcessing}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {isProcessing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    <span>{isProcessing ? 'Processing...' : 'Process Text'}</span>
                  </button>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
              />
            </div>

            {/* Tone Selection */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Choose Tone</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {tones.map((tone) => {
                  const IconComponent = tone.icon;
                  return (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedTone === tone.id
                          ? `bg-gradient-to-r ${tone.gradient} border-transparent shadow-lg text-white`
                          : 'bg-white/70 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-white/90'
                      }`}
                    >
                      <IconComponent className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm font-semibold">{tone.name}</div>
                      <div className="text-xs opacity-80 mt-1">{tone.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Voice Selection */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Volume2 className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Select Voice</h3>
              </div>
              
              <div className="space-y-2">
                {voices.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-300 ${
                      selectedVoice === voice.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/70 text-gray-700 hover:bg-white/90 border border-gray-200'
                    }`}
                  >
                    <div className="font-semibold">{voice.name}</div>
                    <div className="text-sm opacity-80">{voice.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            {/* Text Comparison */}
            {(originalText || rewrittenText) && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
                <div className="flex items-center mb-4">
                  <Eye className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">Text Comparison</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Original Text</h4>
                    <div className="bg-gray-100 rounded-xl p-4 h-40 overflow-y-auto text-gray-800 text-sm border border-gray-300">
                      {originalText || 'No original text'}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Tone-Adapted Text</h4>
                    <div className="bg-gray-100 rounded-xl p-4 h-40 overflow-y-auto text-gray-800 text-sm border border-gray-300">
                      {rewrittenText || 'Processing will appear here...'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Audio Generation */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Volume2 className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Generate Audio</h3>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={generateAudio}
                  disabled={!rewrittenText || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {isProcessing ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  <span className="font-semibold">
                    {isProcessing ? 'Generating Audio...' : 'Generate Audiobook'}
                  </span>
                </button>
                
                {/* Audio Player */}
                {audioUrl && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-800 font-semibold">Your Audiobook</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={togglePlayPause}
                          className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <button
                          onClick={downloadAudio}
                          className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full w-1/3 transition-all duration-300"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Highlight */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mr-3"></div>
                  <span className="text-sm">AI-powered tone adaptation</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Natural-sounding voice narration</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm">Downloadable MP3 format</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mr-3"></div>
                  <span className="text-sm">Side-by-side text comparison</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoVerse;