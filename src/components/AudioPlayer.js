import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  SkipBack, 
  SkipForward,
  Settings,
  Gauge
} from 'lucide-react';

const AudioPlayer = ({ audioUrl, onDownload, title = "Your Audiobook" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const speedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setIsLoaded(true);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleLoadStart = () => setIsLoaded(false);
    const handleCanPlay = () => setIsLoaded(true);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleAudioEnd);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleAudioEnd);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (!audioUrl) return null;

  return (
    <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl p-6 border border-purple-500/30">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">
              {isLoaded ? `${formatTime(duration)} total` : 'Loading...'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onDownload}
          className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div 
          ref={progressRef}
          className="w-full bg-gray-300 rounded-full h-3 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-200 relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-purple-500"></div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => skipTime(-10)}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
            disabled={!isLoaded}
          >
            <SkipBack className="w-4 h-4 text-gray-700" />
          </button>
          
          <button
            onClick={togglePlayPause}
            disabled={!isLoaded}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoaded ? (
              isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />
            ) : (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
          
          <button
            onClick={() => skipTime(10)}
            className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
            disabled={!isLoaded}
          >
            <SkipForward className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Center - Speed Control */}
        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg transition-colors duration-200"
          >
            <Gauge className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">{playbackSpeed}x</span>
          </button>
          
          {showSpeedMenu && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 border-b border-gray-100">
                Speed
              </div>
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors duration-150 ${
                    speed === playbackSpeed ? 'text-purple-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls - Volume */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMute}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Speed Indicator */}
      {playbackSpeed !== 1 && (
        <div className="mt-3 text-center">
          <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
            Playing at {playbackSpeed}x speed
          </span>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
