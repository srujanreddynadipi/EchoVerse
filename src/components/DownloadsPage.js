import React, { useState, useEffect } from 'react';
import { Download, ArrowLeft } from 'lucide-react';

const DownloadsPage = ({ onNavigate, user }) => {
  const [downloads, setDownloads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDownloads = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/downloads/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setDownloads(data.downloads || []);
        }
      } catch (error) {
        console.error('Error fetching downloads:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloads();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading downloads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="container mx-auto px-6 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-white hover:text-purple-200 transition-colors duration-200 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>
        
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl mr-4">
            <Download className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Downloads</h1>
            <p className="text-purple-100">Your saved audiobooks for offline listening</p>
          </div>
        </div>

        {(downloads || []).length === 0 ? (
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-white/20 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Downloads Yet</h3>
            <p className="text-gray-600">Generate and download your first audiobook to see it here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(downloads || []).map((download) => (
              <div key={download.id} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{download.filename || download.original_filename || 'Audiobook'}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Downloaded: {new Date(download.created_at).toLocaleDateString()}</span>
                          {download.file_size && <span>Size: {Math.round(download.file_size / 1024)} KB</span>}
                          <span className="capitalize">{download.source || 'generator'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Original Text</h4>
                        <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-800 max-h-24 overflow-y-auto">
                          {download.original_text || 'No original text available'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Rewritten Text</h4>
                        <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-800 max-h-24 overflow-y-auto">
                          {download.rewritten_text || 'No rewritten text available'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {download.tone && (
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs rounded-full font-medium">
                          {download.tone.charAt(0).toUpperCase() + download.tone.slice(1)}
                        </span>
                      )}
                      {download.voice && (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs rounded-full font-medium">
                          {download.voice.charAt(0).toUpperCase() + download.voice.slice(1)}
                        </span>
                      )}
                      {download.history_id && (
                        <span className="text-xs text-gray-400">ID: {download.history_id}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;
