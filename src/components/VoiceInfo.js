import React, { useState, useEffect } from 'react';
import { Info, Download, Settings, RefreshCw, Speaker, CheckCircle, AlertCircle } from 'lucide-react';

const VoiceInfo = () => {
  const [voiceInfo, setVoiceInfo] = useState(null);
  const [systemVoices, setSystemVoices] = useState([]);
  const [voiceTest, setVoiceTest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVoiceInfo();
  }, []);

  const fetchVoiceInfo = async () => {
    setIsLoading(true);
    try {
      // Fetch voice installation info
      const infoResponse = await fetch('http://localhost:5000/debug/voice-installation-info');
      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        setVoiceInfo(infoData);
      }

      // Fetch system voices
      const voicesResponse = await fetch('http://localhost:5000/debug/system-voices');
      if (voicesResponse.ok) {
        const voicesData = await voicesResponse.json();
        setSystemVoices(voicesData.system_voices || []);
      }

      // Fetch voice test results
      const testResponse = await fetch('http://localhost:5000/debug/test-all-voices');
      if (testResponse.ok) {
        const testData = await testResponse.json();
        setVoiceTest(testData);
      }
    } catch (error) {
      console.error('Error fetching voice info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
        <span className="ml-2 text-gray-600">Loading voice information...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Speaker className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800">Voice Information & Settings</h2>
      </div>

      {/* Available Voices Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
          EchoVerse Voice Options (5 Available)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'David', gender: 'Male', description: 'Confident and clear' },
            { name: 'Zira', gender: 'Female', description: 'Professional and warm' },
            { name: 'Heera', gender: 'Female', description: 'Expressive and engaging' },
            { name: 'Mark', gender: 'Male', description: 'Strong and authoritative' },
            { name: 'Ravi', gender: 'Male', description: 'Smooth and articulate' }
          ].map((voice, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{voice.name}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  voice.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                }`}>
                  {voice.gender}
                </span>
              </div>
              <p className="text-sm text-gray-600">{voice.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Detection Results */}
      {voiceTest && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            System Voice Detection ({voiceTest.total_voices} detected)
          </h3>
          {voiceTest.test_results && voiceTest.test_results.length > 0 ? (
            <div className="space-y-3">
              {voiceTest.test_results.map((voice, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{voice.name}</h4>
                      <p className="text-sm text-gray-600">
                        Gender: {voice.gender} | Status: {voice.status}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {voice.status === 'Available' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded ml-2">
                        Index {voice.index}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No system voices detected through pyttsx3.</p>
          )}
          
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> EchoVerse can use all 5 voices even if only {voiceTest.total_voices} are detected by the system. 
              The voices work through multiple pathways for maximum compatibility.
            </p>
          </div>
        </div>
      )}

      {/* Voice Installation Instructions */}
      {voiceInfo && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Download className="w-5 h-5 mr-2 text-green-500" />
            Voice Setup & Troubleshooting
          </h3>
          
          <div className="mb-4">
            <p className="text-gray-700 mb-3">{voiceInfo.message}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Setup Steps:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {voiceInfo.steps && voiceInfo.steps.map((step, index) => (
                <li key={index} className="text-gray-700 text-sm">{step}</li>
              ))}
            </ol>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Expected Voices in Windows:</h4>
            <ul className="list-disc list-inside space-y-1">
              {voiceInfo.available_voices && voiceInfo.available_voices.map((voice, index) => (
                <li key={index} className="text-gray-700 text-sm">{voice}</li>
              ))}
            </ul>
          </div>

          {voiceInfo.troubleshooting && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Troubleshooting:</h4>
              <ul className="list-disc list-inside space-y-1">
                {voiceInfo.troubleshooting.map((tip, index) => (
                  <li key={index} className="text-gray-700 text-sm">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={fetchVoiceInfo}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Voice Info</span>
            </button>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Settings className="w-4 h-4" />
              <span>All 5 voices should work in EchoVerse</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInfo;
