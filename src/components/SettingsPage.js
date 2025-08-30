import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Volume2, 
  Download, 
  Globe,
  Moon,
  Sun,
  Save,
  CheckCircle
} from 'lucide-react';

const SettingsPage = ({ user }) => {
  const [settings, setSettings] = useState({
    // Profile Settings
    name: user?.name || '',
    email: user?.email || '',
    
    // Audio Settings
    defaultVoice: 'david',
    defaultTone: 'neutral',
    audioQuality: 'high',
    playbackSpeed: '1.0',
    
    // Notification Settings
    emailNotifications: true,
    downloadNotifications: true,
    systemUpdates: false,
    
    // Privacy Settings
    dataCollection: true,
    analytics: false,
    
    // Appearance Settings
    theme: 'light',
    language: 'en',
    
    // Download Settings
    autoDownload: false,
    downloadFormat: 'mp3',
    downloadQuality: 'high'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Settings saved:', settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          checked ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-xl mb-4">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Customize your EchoVerse experience</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Profile Settings */}
          <SettingSection title="Profile Settings" icon={User}>
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                value={settings.name}
                onChange={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
              />
              <InputField
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
              />
            </div>
          </SettingSection>

          {/* Audio Settings */}
          <SettingSection title="Audio Settings" icon={Volume2}>
            <div className="grid md:grid-cols-2 gap-4">
              <SelectField
                label="Default Voice"
                value={settings.defaultVoice}
                onChange={(value) => handleInputChange('defaultVoice', value)}
                options={[
                  { value: 'david', label: 'David (Male)' },
                  { value: 'sarah', label: 'Sarah (Female)' },
                  { value: 'alex', label: 'Alex (Neutral)' },
                  { value: 'emma', label: 'Emma (Female)' }
                ]}
              />
              <SelectField
                label="Default Tone"
                value={settings.defaultTone}
                onChange={(value) => handleInputChange('defaultTone', value)}
                options={[
                  { value: 'neutral', label: 'Neutral' },
                  { value: 'friendly', label: 'Friendly' },
                  { value: 'professional', label: 'Professional' },
                  { value: 'casual', label: 'Casual' }
                ]}
              />
              <SelectField
                label="Audio Quality"
                value={settings.audioQuality}
                onChange={(value) => handleInputChange('audioQuality', value)}
                options={[
                  { value: 'high', label: 'High Quality' },
                  { value: 'medium', label: 'Medium Quality' },
                  { value: 'low', label: 'Low Quality' }
                ]}
              />
              <SelectField
                label="Playback Speed"
                value={settings.playbackSpeed}
                onChange={(value) => handleInputChange('playbackSpeed', value)}
                options={[
                  { value: '0.5', label: '0.5x' },
                  { value: '0.75', label: '0.75x' },
                  { value: '1.0', label: '1.0x (Normal)' },
                  { value: '1.25', label: '1.25x' },
                  { value: '1.5', label: '1.5x' },
                  { value: '2.0', label: '2.0x' }
                ]}
              />
            </div>
          </SettingSection>

          {/* Notification Settings */}
          <SettingSection title="Notifications" icon={Bell}>
            <ToggleSwitch
              label="Email Notifications"
              description="Receive updates and announcements via email"
              checked={settings.emailNotifications}
              onChange={(value) => handleInputChange('emailNotifications', value)}
            />
            <ToggleSwitch
              label="Download Notifications"
              description="Get notified when your audio files are ready"
              checked={settings.downloadNotifications}
              onChange={(value) => handleInputChange('downloadNotifications', value)}
            />
            <ToggleSwitch
              label="System Updates"
              description="Receive notifications about new features and updates"
              checked={settings.systemUpdates}
              onChange={(value) => handleInputChange('systemUpdates', value)}
            />
          </SettingSection>

          {/* Privacy Settings */}
          <SettingSection title="Privacy & Security" icon={Shield}>
            <ToggleSwitch
              label="Data Collection"
              description="Allow EchoVerse to collect usage data to improve the service"
              checked={settings.dataCollection}
              onChange={(value) => handleInputChange('dataCollection', value)}
            />
            <ToggleSwitch
              label="Analytics"
              description="Help us improve by sharing anonymous usage analytics"
              checked={settings.analytics}
              onChange={(value) => handleInputChange('analytics', value)}
            />
          </SettingSection>

          {/* Appearance Settings */}
          <SettingSection title="Appearance" icon={Palette}>
            <div className="grid md:grid-cols-2 gap-4">
              <SelectField
                label="Theme"
                value={settings.theme}
                onChange={(value) => handleInputChange('theme', value)}
                options={[
                  { value: 'light', label: 'Light Theme' },
                  { value: 'dark', label: 'Dark Theme' },
                  { value: 'auto', label: 'Auto (System)' }
                ]}
              />
              <SelectField
                label="Language"
                value={settings.language}
                onChange={(value) => handleInputChange('language', value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                  { value: 'de', label: 'Deutsch' }
                ]}
              />
            </div>
          </SettingSection>

          {/* Download Settings */}
          <SettingSection title="Download Settings" icon={Download}>
            <ToggleSwitch
              label="Auto Download"
              description="Automatically download converted audio files"
              checked={settings.autoDownload}
              onChange={(value) => handleInputChange('autoDownload', value)}
            />
            <div className="grid md:grid-cols-2 gap-4">
              <SelectField
                label="Download Format"
                value={settings.downloadFormat}
                onChange={(value) => handleInputChange('downloadFormat', value)}
                options={[
                  { value: 'mp3', label: 'MP3' },
                  { value: 'wav', label: 'WAV' },
                  { value: 'm4a', label: 'M4A' }
                ]}
              />
              <SelectField
                label="Download Quality"
                value={settings.downloadQuality}
                onChange={(value) => handleInputChange('downloadQuality', value)}
                options={[
                  { value: 'high', label: 'High Quality (320kbps)' },
                  { value: 'medium', label: 'Medium Quality (192kbps)' },
                  { value: 'low', label: 'Low Quality (128kbps)' }
                ]}
              />
            </div>
          </SettingSection>
        </div>

        {/* Save Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 mx-auto"
          >
            {isSaved ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5" />}
            <span>{isSaved ? 'Settings Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
