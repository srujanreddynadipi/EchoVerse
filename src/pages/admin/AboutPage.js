import React from 'react';
import { Info, Users, Target, Award, Sparkles, Heart, Globe, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl shadow-2xl mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            About EchoVerse
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transforming the way you experience written content through the power of AI-driven audio conversion
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              EchoVerse is dedicated to making written content accessible to everyone through cutting-edge AI technology. 
              We believe that everyone should be able to enjoy books, articles, and documents in their preferred format, 
              whether that's reading or listening.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To create a world where information flows seamlessly between text and audio, enabling people to consume 
              content in the way that works best for them, whether they're commuting, exercising, or simply prefer 
              listening over reading.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Makes EchoVerse Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Multiple Languages</h3>
              <p className="text-gray-600">Support for various languages and accents to serve a global audience.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Natural Voices</h3>
              <p className="text-gray-600">High-quality, natural-sounding AI voices that make listening enjoyable.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Premium Quality</h3>
              <p className="text-gray-600">Professional-grade audio output suitable for any listening environment.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center bg-white rounded-3xl shadow-xl p-12 border border-purple-100">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Built with Passion</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            EchoVerse is crafted by a team of passionate developers, AI researchers, and accessibility advocates 
            who believe in the power of technology to make information more accessible and enjoyable for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
