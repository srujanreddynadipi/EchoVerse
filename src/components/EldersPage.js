import React, { useState, useRef } from 'react';
import { API_ENDPOINTS } from '../utils/api';
import {
  Upload,
  FileText,
  BookOpen,
  Play,
  Download,
  Volume2,
  Loader,
  CheckCircle,
  AlertCircle,
  Newspaper,
  Star,
  Globe,
  Search,
  Mic,
  Eye
} from 'lucide-react';

const EldersPage = ({ user }) => {
  const [selectedCategory, setSelectedCategory] = useState('news');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState('david');
  const [selectedTone, setSelectedTone] = useState('neutral');

  // Sample content for elders
  const sampleContent = {
    news: {
      title: "Today's News Headlines",
      content: `Breaking News: Scientists have made a breakthrough in renewable energy technology. A new solar panel design has achieved 40% efficiency, significantly higher than current commercial panels.

Weather Update: Expect partly cloudy skies with temperatures reaching 75°F today. Light winds from the southwest at 5-10 mph.

Health Tip: Regular walking for just 30 minutes a day can significantly improve cardiovascular health and mental well-being, especially for seniors.

Community News: The local library is hosting a free technology workshop for seniors every Wednesday at 2 PM. Learn about smartphones, tablets, and staying connected with family.`
    },
    articles: {
      title: "Health & Lifestyle Articles",
      content: `The Benefits of Gardening for Seniors

Gardening is more than just a hobby; it's a therapeutic activity that offers numerous physical and mental health benefits for seniors. The gentle physical activity involved in gardening helps maintain flexibility, strength, and coordination.

Mental Health Benefits:
- Reduces stress and anxiety
- Provides a sense of purpose and accomplishment
- Connects you with nature
- Offers opportunities for social interaction

Physical Benefits:
- Improves hand strength and dexterity
- Provides moderate exercise
- Encourages outdoor activity and vitamin D absorption
- Helps maintain balance and coordination

Getting Started:
Start small with container gardening or raised beds. Choose easy-to-grow plants like tomatoes, herbs, or flowers. Remember to stay hydrated and take breaks when needed.`
    },
    reviews: {
      title: "Book & Movie Reviews",
      content: `Book Review: "The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid

This captivating novel tells the story of reclusive Hollywood icon Evelyn Hugo, who finally decides to tell her life story to an unknown journalist. The book masterfully weaves themes of love, ambition, and the price of fame.

Rating: 4.5/5 stars
What we loved: Complex characters, engaging plot, beautiful writing
Best for: Fans of historical fiction and Hollywood glamour

Movie Review: "The Best Exotic Marigold Hotel"

A heartwarming film about British retirees who move to India for a more affordable retirement. The movie beautifully explores themes of aging, friendship, and finding new purpose later in life.

Rating: 4/5 stars
What we loved: Stellar cast, beautiful scenery, uplifting message
Perfect for: A cozy movie night with family`
    }
  };

  const categories = [
    { id: 'news', name: 'News', icon: Newspaper, description: 'Daily news and current events' },
    { id: 'articles', name: 'Articles', icon: BookOpen, description: 'Health, lifestyle, and informative articles' },
    { id: 'reviews', name: 'Reviews', icon: Star, description: 'Book and movie recommendations' }
  ];

  const voices = [
    { id: 'david', name: 'David', description: 'Warm, mature male voice' },
    { id: 'olivia', name: 'Olivia', description: 'Gentle, caring female voice' },
    { id: 'kevin', name: 'Kevin', description: 'Clear, authoritative male voice' },
    { id: 'emily', name: 'Emily', description: 'Soothing, friendly female voice' }
  ];

  const tones = [
    { id: 'calm', name: 'Calm', description: 'Relaxed and soothing' },
    { id: 'cheerful', name: 'Cheerful', description: 'Upbeat and positive' },
    { id: 'neutral', name: 'Neutral', description: 'Clear and balanced' },
    { id: 'inspiring', name: 'Inspiring', description: 'Motivational and uplifting' }
  ];

  // Load sample content
  const loadSampleContent = (category) => {
    setSelectedCategory(category);
    setInputText(sampleContent[category].content);
  };

  // Generate audio
  const generateAudio = async () => {
    if (!inputText.trim()) {
      alert('Please enter some text or select sample content');
      return;
    }

    setIsProcessing(true);
    setAudioUrl(null);

    try {
      const response = await fetch(API_ENDPOINTS.SYNTHESIZE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          voice: selectedVoice,
          tone: selectedTone,
          user_id: user?.id || 'elder_user'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        alert('Failed to generate audio. Please try again.');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Error generating audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download audio
  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `elders-audiobook-${Date.now()}.mp3`;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Eye className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Content for Elders
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay informed and entertained with news, articles, and reviews. Listen to content that matters to you with our easy-to-use audio generation.
          </p>
        </div>

        {/* Category Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => loadSampleContent(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <IconComponent className={`w-8 h-8 mx-auto mb-3 ${
                  selectedCategory === category.id ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="space-y-6">
            {/* Current Content Display */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">
                  {sampleContent[selectedCategory]?.title || 'Content'}
                </h3>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Your content will appear here, or you can paste your own text..."
                  className="w-full h-64 bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg leading-relaxed"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setInputText('')}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl transition-all duration-300"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Audio Generation */}
          <div className="space-y-6">
            {/* Voice & Tone Selection */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Volume2 className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Audio Settings</h3>
              </div>
              
              <div className="space-y-4">
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {voices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {voice.name} - {voice.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tone Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {tones.map((tone) => (
                      <option key={tone.id} value={tone.id}>
                        {tone.name} - {tone.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Audio */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Mic className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Generate Audio</h3>
              </div>
              
              <button
                onClick={generateAudio}
                disabled={isProcessing || !inputText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:transform-none text-lg font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Audio...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>Generate Audiobook</span>
                  </>
                )}
              </button>

              {/* Audio Player */}
              {audioUrl && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Audio Ready!</span>
                  </div>
                  
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full mb-3"
                  />
                  
                  <button
                    onClick={downloadAudio}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Audio</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EldersPage;
