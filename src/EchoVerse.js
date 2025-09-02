import React, { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { API_ENDPOINTS, getAudioUrl } from './utils/api';
import { 
  Upload, 
  FileText, 
  Volume2, 
  Download, 
  RotateCcw,
  Sparkles,
  Headphones,
  Eye,
  Settings,
  Zap,
  Heart,
  Shield,
  Users,
  BookOpen,
  PlayCircle,
  Mic
} from 'lucide-react';
import Navbar from './components/Navbar';
import Hamburger from './components/Hamburger';
import HistoryPage from './components/HistoryPage.jsx';
import ProfilePage from './components/ProfilePage';
import DownloadsPage from './components/DownloadsPage';
import AboutPage from './pages/admin/AboutPage.js';
import ContactPage from './components/ContactPage';
import SettingsPage from './components/SettingsPage';
import StudentMaterialsPage from './components/StudentMaterialsPage';
import EldersPage from './components/EldersPage';
import VoiceInfo from './components/VoiceInfo';
import AudioPlayer from './components/AudioPlayer';

// Debug component type logging
console.log('Debug Component Types:', {
  HistoryPage: typeof HistoryPage,
  DownloadsPage: typeof DownloadsPage,
  ProfilePage: typeof ProfilePage,
  VoiceInfo: typeof VoiceInfo,
});
console.log('HistoryPage raw value:', HistoryPage);

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const EchoVerse = ({ user, onLogout }) => {
  const [inputText, setInputText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [rewrittenText, setRewrittenText] = useState('');
  const [selectedTone, setSelectedTone] = useState('neutral');
  const [selectedVoice, setSelectedVoice] = useState('david');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [currentCategory, setCurrentCategory] = useState('general');
  const [availableTones, setAvailableTones] = useState([]);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [storySegments, setStorySegments] = useState([]);
  const [isProcessingStory, setIsProcessingStory] = useState(false);
  const fileInputRef = useRef(null);

  // Load tones and voices from backend
  useEffect(() => {
    const loadTonesAndVoices = async () => {
      try {
        // Fetch tones
        const tonesResponse = await fetch(API_ENDPOINTS.TONES);
        if (tonesResponse.ok) {
          const tonesData = await tonesResponse.json();
          const mappedTones = tonesData.tones?.map(tone => mapToneFromBackend(tone)) || [];
          setAvailableTones(mappedTones.length > 0 ? mappedTones : tones);
        } else {
          setAvailableTones(tones);
        }

        // Fetch voices
        const voicesResponse = await fetch(API_ENDPOINTS.VOICES);
        if (voicesResponse.ok) {
          const voicesData = await voicesResponse.json();
          const mappedVoices = voicesData.voices?.map(voice => mapVoiceFromBackend(voice)) || [];
          setAvailableVoices(mappedVoices.length > 0 ? mappedVoices : voices);
        } else {
          setAvailableVoices(voices);
        }
      } catch (error) {
        console.error('Error loading tones and voices:', error);
        // Use fallback data if API fails
        setAvailableTones(tones);
        setAvailableVoices(voices);
      }
    };

    loadTonesAndVoices();
  }, []);

  // Map backend tone data to frontend format
  const mapToneFromBackend = (backendTone) => {
    const toneIconMap = {
      'neutral': Shield,
      'suspenseful': Zap,
      'inspiring': Sparkles,
      'cheerful': Heart,
      'sad': Eye,
      'angry': Zap,
      'playful': Headphones,
      'calm': Download,
      'confident': Settings
    };

    const toneGradientMap = {
      'neutral': 'from-blue-400 to-cyan-500',
      'suspenseful': 'from-purple-500 to-pink-600',
      'inspiring': 'from-yellow-400 to-orange-500',
      'cheerful': 'from-green-400 to-blue-500',
      'sad': 'from-blue-500 to-purple-600',
      'angry': 'from-red-500 to-pink-600',
      'playful': 'from-pink-400 to-purple-400',
      'calm': 'from-green-300 to-blue-300',
      'confident': 'from-indigo-500 to-blue-700'
    };

    return {
      id: backendTone.id,           // Backend already transforms tone_id to id
      name: backendTone.name,       // Backend already transforms tone_name to name
      icon: toneIconMap[backendTone.id] || Shield,
      gradient: toneGradientMap[backendTone.id] || 'from-gray-400 to-gray-600',
      description: backendTone.description
    };
  };

  // Map backend voice data to frontend format
  const mapVoiceFromBackend = (backendVoice) => {
    return {
      id: backendVoice.id,          // Backend already transforms voice_id to id
      name: backendVoice.name,      // Backend already transforms voice_name to name
      description: backendVoice.description
    };
  };

  const tones = [
    {
      id: 'neutral',
      name: 'Neutral',
      icon: Shield,
      gradient: 'from-blue-400 to-cyan-500',
      description: 'Clear and balanced narration',
    },
    {
      id: 'suspenseful',
      name: 'Suspenseful',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-600',
      description: 'Dramatic and engaging delivery',
    },
    {
      id: 'inspiring',
      name: 'Inspiring',
      icon: Heart,
      gradient: 'from-orange-400 to-red-500',
      description: 'Uplifting and motivational tone',
    },
    {
      id: 'cheerful',
      name: 'Cheerful',
      icon: Sparkles,
      gradient: 'from-yellow-400 to-orange-400',
      description: 'Bright, happy, and energetic',
    },
    {
      id: 'sad',
      name: 'Sad',
      icon: FileText,
      gradient: 'from-blue-300 to-gray-400',
      description: 'Soft, somber, and emotional',
    },
    {
      id: 'angry',
      name: 'Angry',
      icon: Volume2,
      gradient: 'from-red-600 to-orange-700',
      description: 'Intense and passionate delivery',
    },
    {
      id: 'playful',
      name: 'Playful',
      icon: Headphones,
      gradient: 'from-pink-400 to-purple-400',
      description: 'Fun, lively, and whimsical',
    },
    {
      id: 'calm',
      name: 'Calm',
      icon: Download,
      gradient: 'from-green-300 to-blue-300',
      description: 'Relaxed and soothing narration',
    },
    {
      id: 'confident',
      name: 'Confident',
      icon: Eye,
      gradient: 'from-indigo-500 to-blue-700',
      description: 'Assured and persuasive',
    },
  ];

  const voices = [
    { id: 'david', name: 'David', description: 'Confident and clear male voice' },
    { id: 'zira', name: 'Zira', description: 'Professional and warm female voice' },
    { id: 'heera', name: 'Heera', description: 'Expressive and engaging female voice' },
    { id: 'mark', name: 'Mark', description: 'Strong and authoritative male voice' },
    { id: 'ravi', name: 'Ravi', description: 'Smooth and articulate male voice' }
  ];

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      let content = '';
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        // Handle text files
        const reader = new FileReader();
        reader.onload = (e) => {
          content = e.target.result;
          setInputText(content);
          setOriginalText(content);
          setIsProcessing(false);
        };
        reader.readAsText(file);
      } 
      else if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
        // Handle CSV files
        Papa.parse(file, {
          complete: (results) => {
            // Convert CSV data to readable text
            let csvText = '';
            results.data.forEach((row, index) => {
              if (Array.isArray(row) && row.length > 0) {
                // Skip empty rows
                const filteredRow = row.filter(cell => cell && cell.trim() !== '');
                if (filteredRow.length > 0) {
                  csvText += filteredRow.join(', ') + '\n';
                }
              }
            });
            content = csvText.trim();
            setInputText(content);
            setOriginalText(content);
            setIsProcessing(false);
          },
          error: (error) => {
            console.error('CSV parsing error:', error);
            alert('Error reading CSV file. Please try again.');
            setIsProcessing(false);
          }
        });
      }
      else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        // Handle PDF files
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let pdfText = '';
          
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            pdfText += pageText + '\n';
          }
          
          content = pdfText.trim();
          setInputText(content);
          setOriginalText(content);
          setIsProcessing(false);
        } catch (error) {
          console.error('PDF parsing error:', error);
          alert('Error reading PDF file. Please try again.');
          setIsProcessing(false);
        }
      }
      else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               fileType === 'application/msword' || 
               fileName.endsWith('.docx') || 
               fileName.endsWith('.doc')) {
        // Handle Word documents
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          content = result.value.trim();
          setInputText(content);
          setOriginalText(content);
          setIsProcessing(false);
        } catch (error) {
          console.error('Word document parsing error:', error);
          alert('Error reading Word document. Please try again.');
          setIsProcessing(false);
        }
      }
      else {
        alert('Unsupported file type. Please upload a TXT, PDF, Word (DOC/DOCX), or CSV file.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Error processing file. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = async () => {
    if (inputText.trim()) {
      setOriginalText(inputText);
      setIsProcessing(true);
      
      try {
        // Call backend API to rewrite text
        const response = await fetch(API_ENDPOINTS.REWRITE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: inputText,
            tone: selectedTone
          })
        });

        if (response.ok) {
          const data = await response.json();
          setRewrittenText(data.rewritten_text);
          
          // Save to history
          saveToHistory(inputText, data.rewritten_text, selectedTone, selectedVoice, false);
        } else {
          console.error('Failed to rewrite text');
          // Fallback to mock implementation
          const mockRewritten = `[${selectedTone.toUpperCase()} TONE] ${inputText}`;
          setRewrittenText(mockRewritten);
          saveToHistory(inputText, mockRewritten, selectedTone, selectedVoice, false);
        }
      } catch (error) {
        console.error('Error calling rewrite API:', error);
        // Fallback to mock implementation
        const mockRewritten = `[${selectedTone.toUpperCase()} TONE] ${inputText}`;
        setRewrittenText(mockRewritten);
        saveToHistory(inputText, mockRewritten, selectedTone, selectedVoice, false);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Story Narration with Multiple Voices and Tones
  const handleStoryNarration = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessingStory(true);
    setStorySegments([]);
    
    try {
      // Call backend API to analyze story and create segments
      const response = await fetch(API_ENDPOINTS.STORY_NARRATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          user_id: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setStorySegments(data.segments);
        setIsStoryMode(true);
        
        // Save to history as story narration
        saveToHistory(inputText, 'Story Narration Mode', 'story', 'multiple', true);
      } else {
        // Fallback to client-side analysis
        const segments = analyzeStoryClientSide(inputText);
        setStorySegments(segments);
        setIsStoryMode(true);
        saveToHistory(inputText, 'Story Narration Mode (Client)', 'story', 'multiple', true);
      }
    } catch (error) {
      console.error('Error in story narration:', error);
      // Fallback to client-side analysis
      const segments = analyzeStoryClientSide(inputText);
      setStorySegments(segments);
      setIsStoryMode(true);
      saveToHistory(inputText, 'Story Narration Mode (Fallback)', 'story', 'multiple', true);
    } finally {
      setIsProcessingStory(false);
    }
  };

  // Client-side story analysis (fallback)
  const analyzeStoryClientSide = (text) => {
    const voices = ['david', 'sarah', 'alex', 'emma', 'michael'];
    const emotionTones = {
      'cheerful': 'cheerful',
      'playful': 'cheerful',
      'excited': 'cheerful',
      'happy': 'cheerful', 
      'sad': 'sad',
      'angry': 'angry',
      'calm': 'calm',
      'nervous': 'suspenseful',
      'suspenseful': 'suspenseful',
      'confident': 'confident',
      'inspiring': 'confident',
      'whisper': 'calm',
      'shout': 'angry',
      'laugh': 'cheerful',
      'cry': 'sad'
    };

    // Split text into lines to detect character dialogue format
    const lines = text.split('\n').filter(line => line.trim());
    const segments = [];
    const characterVoices = {};
    let currentVoiceIndex = 1; // Start from index 1, 0 is narrator
    
    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) return;
      
      let tone = 'neutral';
      let voice = voices[0]; // Default narrator voice
      let character = 'Narrator';
      let textToSpeak = line;
      
      // Check for character dialogue format: "CharacterName (emotion): dialogue"
      const characterMatch = line.match(/(\w+)\s*\(([^)]+)\):\s*["\']?([^"\']*)["\']?/);
      if (characterMatch) {
        const characterName = characterMatch[1];
        const emotionHint = characterMatch[2].toLowerCase().trim();
        const dialogueText = characterMatch[3].trim();
        
        // Assign voice to character
        if (!characterVoices[characterName]) {
          characterVoices[characterName] = voices[currentVoiceIndex % voices.length];
          currentVoiceIndex++;
        }
        
        voice = characterVoices[characterName];
        character = characterName;
        tone = emotionTones[emotionHint] || 'neutral';
        textToSpeak = dialogueText;
      } else {
        // Check for regular dialogue with quotes
        if (line.includes('"') || line.includes("'")) {
          // Generic character assignment
          const characterNum = Object.keys(characterVoices).filter(c => c.startsWith('Character')).length + 1;
          character = `Character ${characterNum}`;
          
          if (!characterVoices[character]) {
            characterVoices[character] = voices[currentVoiceIndex % voices.length];
            currentVoiceIndex++;
          }
          voice = characterVoices[character];
        }
      }
      
      // Detect emotion in text if not already set
      if (tone === 'neutral') {
        const lowerLine = textToSpeak.toLowerCase();
        for (const [emotion, emotionTone] of Object.entries(emotionTones)) {
          if (lowerLine.includes(emotion)) {
            tone = emotionTone;
            break;
          }
        }
      }
      
      // Clean up text
      if (!textToSpeak.endsWith('.') && !textToSpeak.endsWith('!') && !textToSpeak.endsWith('?')) {
        textToSpeak += '.';
      }
      
      segments.push({
        text: textToSpeak,
        voice: voice,
        tone: tone,
        character: character,
        emotion: tone !== 'neutral' ? tone : 'neutral'
      });
    });
    
    return segments;
  };

  // Generate audio for story segments
  const generateStoryAudio = async () => {
    if (storySegments.length === 0) return;
    
    setIsProcessing(true);
    const audioUrls = [];
    
    try {
      for (let i = 0; i < storySegments.length; i++) {
        const segment = storySegments[i];
        
        const response = await fetch(API_ENDPOINTS.STORY_NARRATION_AUDIO, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: segment.text,
            voice: segment.voice,
            tone: segment.tone,
            user_id: user.id,
            segment_id: i
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            audioUrls.push({
              ...segment,
              audioUrl: getAudioUrl(data.audio_url),
              filename: data.filename,
              fileSize: data.file_size
            });
          }
        } else {
          console.error('Failed to generate audio for segment:', segment.text);
        }
      }
      
      // Update the story segments with audio URLs
      setStorySegments(audioUrls);
      
      // Set the first audio URL for immediate playback
      if (audioUrls.length > 0) {
        setAudioUrl(audioUrls[0].audioUrl);
      }
      
    } catch (error) {
      console.error('Error generating story audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate merged audio for all story segments
  const generateMergedStoryAudio = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch(API_ENDPOINTS.STORY_NARRATION_MERGED, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          user_id: user.id
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Set the merged audio URL for playback
          setAudioUrl(getAudioUrl(data.audio_url));
          
          // Save to history as merged story narration
          saveToHistory(inputText, `Story Narration (Merged - ${data.segments_count} segments)`, 'multiple', 'multiple', true);
          
          console.log(`Merged audio generated successfully with ${data.segments_count} segments`);
        } else {
          console.error('Failed to generate merged audio:', data.error);
        }
      } else {
        console.error('Failed to generate merged audio');
      }
    } catch (error) {
      console.error('Error generating merged story audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAudio = async () => {
    if (rewrittenText) {
      setIsProcessing(true);
      
      try {
        // Save to history first to get history_id
        const historyId = await saveToHistory(originalText, rewrittenText, selectedTone, selectedVoice, false);
        
        // Call backend API to generate audio
        const response = await fetch(API_ENDPOINTS.SYNTHESIZE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: rewrittenText,
            voice: selectedVoice,
            tone: selectedTone,
            user_id: user.id,
            history_id: historyId
          })
        });

        if (response.ok) {
          // Get the audio blob from response
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          
          console.log('Audio generated successfully and history updated');
        } else {
          console.error('Failed to generate audio');
        }
      } catch (error) {
        console.error('Error calling synthesize API:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const saveToHistory = async (original, rewritten, tone, voice, audioGenerated = false) => {
    try {
      // Save to database
      const response = await fetch(API_ENDPOINTS.HISTORY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          original_text: original,
          rewritten_text: rewritten,
          tone: tone,
          voice: voice
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('History saved to database:', data);
        return data.history_id;
      } else {
        console.error('Failed to save history to database');
        // Fallback to localStorage
        return saveToLocalStorage(original, rewritten, tone, voice, audioGenerated);
      }
    } catch (error) {
      console.error('Error saving history to database:', error);
      // Fallback to localStorage
      return saveToLocalStorage(original, rewritten, tone, voice, audioGenerated);
    }
  };

  const saveToLocalStorage = (original, rewritten, tone, voice, audioGenerated) => {
    const historyId = Date.now();
    const historyItem = {
      id: historyId,
      originalText: original,
      rewrittenText: rewritten,
      tone: tone,
      voice: voice,
      timestamp: new Date().toISOString(),
      audioGenerated: audioGenerated
    };

    const existingHistory = localStorage.getItem('echoverse_history');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    history.unshift(historyItem); // Add to beginning
    localStorage.setItem('echoverse_history', JSON.stringify(history));
    
    return historyId; // Return the ID for backend reference
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    // Set appropriate category when navigating
    if (page === 'home') {
      setCurrentCategory('general');
    } else if (page === 'student-materials') {
      setCurrentCategory('students');
    } else if (page === 'elders') {
      setCurrentCategory('elders');
    }
  };

  const recordDownload = async ({ original, rewritten, tone, voice, blob }) => {
    try {
      const size = blob ? blob.size : null;
      const response = await fetch(API_ENDPOINTS.DOWNLOADS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          original_text: original,
            rewritten_text: rewritten,
            tone,
            voice,
            filename: 'echoverse-audiobook.wav',
            file_size: size,
            source: 'generator'
        })
      });
      if (!response.ok) {
        console.warn('Download record failed');
      } else {
        console.log('Download recorded');
      }
    } catch (e) {
      console.error('Error recording download', e);
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'echoverse-audiobook.wav';
      document.body.appendChild(link);
      link.click();
      link.remove();
      try {
        fetch(audioUrl)
          .then(r => r.blob())
          .then(blob => recordDownload({ original: originalText, rewritten: rewrittenText, tone: selectedTone, voice: selectedVoice, blob }))
          .catch(()=> recordDownload({ original: originalText, rewritten: rewrittenText, tone: selectedTone, voice: selectedVoice }));
      } catch {
        recordDownload({ original: originalText, rewritten: rewrittenText, tone: selectedTone, voice: selectedVoice });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation Bar */}
      <Navbar 
        user={user}
        onLogout={onLogout}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Conditional Page Rendering */}
      {currentPage === 'history' ? (
        <HistoryPage onNavigate={handleNavigation} user={user} />
      ) : currentPage === 'downloads' ? (
        <DownloadsPage onNavigate={handleNavigation} user={user} />
      ) : currentPage === 'student-materials' ? (
        <StudentMaterialsPage user={user} />
      ) : currentPage === 'elders' ? (
        <EldersPage user={user} />
      ) : currentPage === 'voice-info' ? (
        <VoiceInfo />
      ) : currentPage === 'profile' ? (
        <ProfilePage onNavigate={handleNavigation} user={user} />
      ) : currentPage === 'about' ? (
        <AboutPage />
      ) : currentPage === 'contact' ? (
        <ContactPage />
      ) : currentPage === 'settings' ? (
        <SettingsPage user={user} />
      ) : currentPage === 'home' ? (
        <>
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

        {/* Category Selection Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-xl border border-gray-200">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setCurrentCategory('general');
                  setCurrentPage('home');
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentCategory === 'general' && currentPage === 'home'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>General</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentCategory('students');
                  setCurrentPage('student-materials');
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentCategory === 'students' && currentPage === 'student-materials'
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Students</span>
              </button>
              
              <button
                onClick={() => {
                  setCurrentCategory('elders');
                  setCurrentPage('elders');
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  currentCategory === 'elders' && currentPage === 'elders'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-5 h-5" />
                <span>Elders</span>
              </button>
            </div>
          </div>
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
                  placeholder="Paste your text here or upload a file (TXT, PDF, Word, CSV)..."
                  className="w-full h-48 bg-gray-100 border border-gray-300 rounded-xl p-4 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File</span>
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
                
                {/* Story Narration Button */}
                <div className="mt-4">
                  <button
                    onClick={handleStoryNarration}
                    disabled={!inputText.trim() || isProcessingStory}
                    className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-600 hover:via-pink-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    {isProcessingStory ? <RotateCcw className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                    <span>{isProcessingStory ? 'Analyzing Story...' : '🎭 Story Narration'}</span>
                    <Users className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Automatically detects characters and emotions for multi-voice narration
                  </p>
                </div>
                
                {/* Study Materials Button */}
                <div className="mt-4">
                  <button
                    onClick={() => setCurrentPage('student-materials')}
                    className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>📚 Study Materials</span>
                    <Users className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Upload PDFs/Word docs and generate audiobooks for each chapter & topic
                  </p>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,.csv"
                className="hidden"
              />
            </div>

            {/* Tone Selection */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Choose Tone</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(availableTones.length > 0 ? availableTones : tones).map((tone) => {
                  const IconComponent = tone.icon || Shield; // Fallback to Shield if no icon
                  return (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={`relative group p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                        selectedTone === tone.id
                          ? `bg-gradient-to-r ${tone.gradient || 'from-purple-500 to-pink-500'} border-transparent shadow-xl text-white scale-105`
                          : 'bg-white/80 border-gray-300 text-gray-700 hover:border-purple-400 hover:bg-white/90'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="inline-block mb-2">
                          <IconComponent className={`w-8 h-8 ${selectedTone === tone.id ? 'drop-shadow-lg' : 'opacity-80'}`} />
                        </span>
                        <span className="text-base font-bold tracking-wide mb-1">
                          {tone.name}
                        </span>
                        <span className="text-xs opacity-80 text-center leading-tight">
                          {tone.description}
                        </span>
                      </div>
                      {selectedTone === tone.id && (
                        <span className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border-2 border-white shadow-lg"></span>
                      )}
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
                {(availableVoices.length > 0 ? availableVoices : voices).map((voice) => (
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
                  <AudioPlayer
                    audioUrl={audioUrl}
                    onDownload={downloadAudio}
                    title="Your Audiobook"
                  />
                )}
                
                {/* Story Segments Display */}
                {isStoryMode && storySegments.length > 0 && (
                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                        Story Segments
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={generateStoryAudio}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Generate All Audio</span>
                        </button>
                        <button
                          onClick={generateMergedStoryAudio}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
                        >
                          <Mic className="w-4 h-4" />
                          <span>Generate Merged Audio</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {storySegments.map((segment, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {segment.character}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {segment.voice}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {segment.tone}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {segment.emotion && (
                                <span className="text-xs text-gray-500">
                                  😊 {segment.emotion}
                                </span>
                              )}
                              {segment.audioUrl && (
                                <button
                                  onClick={() => setAudioUrl(segment.audioUrl)}
                                  className="bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1"
                                  title="Play this segment"
                                >
                                  <PlayCircle className="w-3 h-3" />
                                  <span>Play</span>
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {segment.text}
                          </p>
                          {segment.audioUrl && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <audio 
                                controls 
                                className="w-full h-8"
                                style={{height: '32px'}}
                                preload="metadata"
                              >
                                <source src={segment.audioUrl} type="audio/wav" />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Story Analysis:</strong> Detected {storySegments.length} segments with{' '}
                        {new Set(storySegments.map(s => s.voice)).size} different voices and{' '}
                        {new Set(storySegments.map(s => s.tone)).size} emotional tones.
                      </p>
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
      </>
      ) : (
        <div className="relative z-10 container mx-auto px-6 py-8 pt-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {currentPage === 'about' ? 'About EchoVerse' : 'Page Not Found'}
            </h1>
            <p className="text-gray-600">
              {currentPage === 'about' 
                ? 'EchoVerse is an AI-powered audiobook creation tool that transforms your text into expressive, natural-sounding narrations. Built with cutting-edge AI technology for students, professionals, and accessibility.'
                : 'This page is coming soon!'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EchoVerse;
