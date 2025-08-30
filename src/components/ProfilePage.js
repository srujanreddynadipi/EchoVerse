import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Settings, 
  Edit3, 
  Save, 
  X,
  ArrowLeft,
  Camera,
  School,
  Badge,
  Target,
  Star
} from 'lucide-react';

const ProfilePage = ({ onNavigate, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    dateOfBirth: user?.date_of_birth || '',
    university: user?.university || '',
    course: user?.course || '',
    year: user?.year || '',
    rollNumber: user?.roll_number || '',
    gpa: user?.gpa || '',
    bio: user?.bio || '',
    interests: ['AI/ML', 'Web Development', 'Mobile Apps', 'Data Science'],
    skills: ['React', 'Python', 'JavaScript', 'Node.js', 'MongoDB'],
    achievements: [
      'Winner - University Hackathon 2024',
      'Dean\'s List - Fall 2023',
      'Best Project Award - Web Development',
      'Completed 50+ Coding Challenges'
    ],
    projects: [
      { name: 'EchoVerse', description: 'AI-powered audiobook creation tool', tech: 'React, Python, IBM Watson' },
      { name: 'TaskMaster', description: 'Smart task management application', tech: 'React Native, Firebase' },
      { name: 'WeatherBot', description: 'Intelligent weather chatbot', tech: 'Python, NLP, API Integration' }
    ]
  });

  const [tempData, setTempData] = useState(profileData);

  useEffect(() => {
    // Load profile data from localStorage if available
    const savedProfile = localStorage.getItem('echoverse_profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfileData(parsed);
      setTempData(parsed);
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = () => {
    setProfileData(tempData);
    localStorage.setItem('echoverse_profile', JSON.stringify(tempData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setTempData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setTempData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const data = isEditing ? tempData : profileData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="mr-4 p-2 rounded-xl bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Student Profile
              </h1>
              <p className="text-gray-600 mt-2">Manage your academic and personal information</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    {data.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300">
                    <Camera className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold text-gray-800 mb-2 w-full text-center bg-gray-100 rounded-lg p-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{data.name}</h2>
                )}
                
                <div className="flex items-center justify-center text-purple-600 mb-4">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span className="font-medium">{data.course}</span>
                </div>
                
                {isEditing ? (
                  <textarea
                    value={data.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="text-gray-600 text-center bg-gray-100 rounded-lg p-2 w-full h-20 resize-none"
                    placeholder="Write your bio..."
                  />
                ) : (
                  <p className="text-gray-600 text-center">{data.bio}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-purple-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Academic Year</span>
                  <span className="font-semibold text-purple-600">{data.year}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">GPA</span>
                  <span className="font-semibold text-green-600">{data.gpa}/10.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-semibold text-blue-600">{data.projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-semibold text-orange-600">{data.achievements.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Contact Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{data.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{data.phone}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{data.location}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  {isEditing ? (
                    <input
                      type="date"
                      value={data.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="flex-1 bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{new Date(data.dateOfBirth).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <School className="w-5 h-5 mr-2 text-purple-600" />
                Academic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">University</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={data.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-gray-800">{data.university}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Roll Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={data.rollNumber}
                      onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                      className="w-full bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-gray-800">{data.rollNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Course</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={data.course}
                      onChange={(e) => handleInputChange('course', e.target.value)}
                      className="w-full bg-gray-100 rounded-lg p-2"
                    />
                  ) : (
                    <p className="text-gray-800">{data.course}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Current Year</label>
                  {isEditing ? (
                    <select
                      value={data.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full bg-gray-100 rounded-lg p-2"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  ) : (
                    <p className="text-gray-800">{data.year}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills & Interests */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  Skills
                </h3>
                <div className="space-y-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      {isEditing ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                            className="flex-1 bg-gray-100 rounded-lg p-2"
                          />
                          <button
                            onClick={() => removeArrayItem('skills', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {skill}
                        </span>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addArrayItem('skills')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-purple-600" />
                  Interests
                </h3>
                <div className="space-y-2">
                  {data.interests.map((interest, index) => (
                    <div key={index} className="flex items-center">
                      {isEditing ? (
                        <div className="flex-1 flex items-center space-x-2">
                          <input
                            type="text"
                            value={interest}
                            onChange={(e) => handleArrayChange('interests', index, e.target.value)}
                            className="flex-1 bg-gray-100 rounded-lg p-2"
                          />
                          <button
                            onClick={() => removeArrayItem('interests', index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {interest}
                        </span>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => addArrayItem('interests')}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      + Add Interest
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Achievements
              </h3>
              <div className="space-y-3">
                {data.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start">
                    {isEditing ? (
                      <div className="flex-1 flex items-center space-x-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => handleArrayChange('achievements', index, e.target.value)}
                          className="flex-1 bg-gray-100 rounded-lg p-2"
                        />
                        <button
                          onClick={() => removeArrayItem('achievements', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Badge className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{achievement}</span>
                      </>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('achievements')}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center"
                  >
                    + Add Achievement
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
