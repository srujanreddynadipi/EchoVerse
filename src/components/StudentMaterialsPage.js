import React, { useState, useRef } from 'react';
import { API_ENDPOINTS, getAudioUrl } from '../utils/api';
import {
  Upload,
  FileText,
  BookOpen,
  Play,
  Download,
  ChevronDown,
  ChevronRight,
  Volume2,
  Loader,
  CheckCircle,
  AlertCircle,
  Layers,
  List,
  Mic
} from 'lucide-react';

const StudentMaterialsPage = ({ user }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studyMaterial, setStudyMaterial] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [audioGenerationStatus, setAudioGenerationStatus] = useState({});
  const [isGeneratingAudio, setIsGeneratingAudio] = useState({});
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (validTypes.includes(file.type)) {
        setUploadedFile(file);
        processStudyMaterial(file);
      } else {
        alert('Please upload a PDF, Word document, or text file.');
      }
    }
  };

  // Process the uploaded study material
  const processStudyMaterial = async (file) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);

      const response = await fetch(API_ENDPOINTS.PROCESS_STUDY_MATERIAL, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.success) {
          setStudyMaterial(data.material);
          // Initialize expanded state for all chapters
          const initialExpanded = {};
          data.material.chapters.forEach((_, index) => {
            initialExpanded[index] = false;
          });
          setExpandedChapters(initialExpanded);
        } else {
          alert('Failed to process study material: ' + (data.error || 'Unknown error'));
        }
      } else {
        // More detailed error message
        const errorMessage = data.error || `Server error: ${response.status} ${response.statusText}`;
        alert('Failed to upload and process file: ' + errorMessage);
        console.error('Upload error:', response.status, response.statusText, data);
      }
    } catch (error) {
      console.error('Error processing study material:', error);
      alert('Error processing study material');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle chapter expansion
  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  // Generate audio for a specific topic
  const generateTopicAudio = async (chapterIndex, topicIndex, topic) => {
    const key = `${chapterIndex}-${topicIndex}`;
    setIsGeneratingAudio(prev => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_TOPIC_AUDIO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: topic.content,
          topic_name: topic.name,
          chapter_name: studyMaterial.chapters[chapterIndex].title,
          user_id: user.id,
          voice: 'david', // Default voice for study materials
          tone: 'neutral'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAudioGenerationStatus(prev => ({
            ...prev,
            [key]: {
              status: 'completed',
              audioUrl: getAudioUrl(data.audio_url),
              filename: data.filename,
              fileSize: data.file_size
            }
          }));
        } else {
          setAudioGenerationStatus(prev => ({
            ...prev,
            [key]: { status: 'error', error: data.error }
          }));
        }
      } else {
        setAudioGenerationStatus(prev => ({
          ...prev,
          [key]: { status: 'error', error: 'Failed to generate audio' }
        }));
      }
    } catch (error) {
      console.error('Error generating topic audio:', error);
      setAudioGenerationStatus(prev => ({
        ...prev,
        [key]: { status: 'error', error: 'Network error' }
      }));
    } finally {
      setIsGeneratingAudio(prev => ({ ...prev, [key]: false }));
    }
  };

  // Generate audio for all topics in a chapter
  const generateChapterAudio = async (chapterIndex) => {
    const chapter = studyMaterial.chapters[chapterIndex];
    
    for (let topicIndex = 0; topicIndex < chapter.topics.length; topicIndex++) {
      await generateTopicAudio(chapterIndex, topicIndex, chapter.topics[topicIndex]);
      // Small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  // Download audio file
  const downloadAudio = (audioUrl, filename) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <BookOpen className="w-8 h-8 mr-3 text-blue-600" />
            Student Study Materials
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload your study materials (PDF, Word, or Text) and we'll automatically organize them into chapters and topics, 
            then generate audiobooks for each section to help you study on the go.
          </p>
        </div>

        {/* File Upload Section */}
        {!studyMaterial && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
            <div className="text-center">
              <div 
                className="border-2 border-dashed border-blue-300 rounded-xl p-12 hover:border-blue-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Upload Study Material
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your file here or click to browse
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    PDF
                  </span>
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Word
                  </span>
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    Text
                  </span>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              
              {uploadedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Uploaded: {uploadedFile.name}
                  </p>
                  <p className="text-blue-600 text-sm">
                    Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}
              
              {isProcessing && (
                <div className="mt-6 flex items-center justify-center">
                  <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <span className="text-blue-600 font-medium">
                    Processing your study material...
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Study Material Display */}
        {studyMaterial && (
          <div className="space-y-6">
            {/* Material Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Layers className="w-6 h-6 mr-2 text-blue-600" />
                  {studyMaterial.title}
                </h2>
                <button
                  onClick={() => {
                    setStudyMaterial(null);
                    setUploadedFile(null);
                    setExpandedChapters({});
                    setAudioGenerationStatus({});
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Upload New File
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800">Chapters</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {studyMaterial.chapters.length}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800">Topics</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {studyMaterial.chapters.reduce((total, chapter) => total + chapter.topics.length, 0)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800">Words</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {studyMaterial.word_count?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Chapters and Topics */}
            {studyMaterial.chapters.map((chapter, chapterIndex) => (
              <div key={chapterIndex} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Chapter Header */}
                <div 
                  className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white cursor-pointer"
                  onClick={() => toggleChapter(chapterIndex)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {expandedChapters[chapterIndex] ? (
                        <ChevronDown className="w-6 h-6 mr-3" />
                      ) : (
                        <ChevronRight className="w-6 h-6 mr-3" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          Chapter {chapterIndex + 1}: {chapter.title}
                        </h3>
                        <p className="text-blue-100 text-sm">
                          {chapter.topics.length} topics
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateChapterAudio(chapterIndex);
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Generate All Audio
                    </button>
                  </div>
                </div>

                {/* Chapter Content */}
                {expandedChapters[chapterIndex] && (
                  <div className="p-6">
                    {chapter.summary && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">Chapter Summary</h4>
                        <p className="text-gray-600">{chapter.summary}</p>
                      </div>
                    )}

                    {/* Topics */}
                    <div className="space-y-4">
                      {chapter.topics.map((topic, topicIndex) => {
                        const key = `${chapterIndex}-${topicIndex}`;
                        const audioStatus = audioGenerationStatus[key];
                        const isGenerating = isGeneratingAudio[key];

                        return (
                          <div key={topicIndex} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                <List className="w-5 h-5 mr-2 text-gray-600" />
                                {topic.name}
                              </h4>
                              
                              <div className="flex items-center space-x-2">
                                {/* Audio Status */}
                                {audioStatus?.status === 'completed' && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {audioStatus?.status === 'error' && (
                                  <AlertCircle className="w-5 h-5 text-red-500" />
                                )}
                                
                                {/* Generate Audio Button */}
                                <button
                                  onClick={() => generateTopicAudio(chapterIndex, topicIndex, topic)}
                                  disabled={isGenerating}
                                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm flex items-center"
                                >
                                  {isGenerating ? (
                                    <Loader className="w-4 h-4 animate-spin mr-1" />
                                  ) : (
                                    <Mic className="w-4 h-4 mr-1" />
                                  )}
                                  {isGenerating ? 'Generating...' : 'Generate Audio'}
                                </button>
                                
                                {/* Play Audio Button */}
                                {audioStatus?.status === 'completed' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        const audio = new Audio(audioStatus.audioUrl);
                                        audio.play();
                                      }}
                                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
                                    >
                                      <Play className="w-4 h-4 mr-1" />
                                      Play
                                    </button>
                                    
                                    {/* Download Audio Button */}
                                    <button
                                      onClick={() => downloadAudio(audioStatus.audioUrl, audioStatus.filename)}
                                      className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center"
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      Download
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Topic Content */}
                            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {topic.content}
                              </p>
                            </div>
                            
                            {/* Audio Status Messages */}
                            {audioStatus?.status === 'error' && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                                Error: {audioStatus.error}
                              </div>
                            )}
                            
                            {audioStatus?.status === 'completed' && (
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                                Audio generated successfully! File: {audioStatus.filename}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMaterialsPage;
