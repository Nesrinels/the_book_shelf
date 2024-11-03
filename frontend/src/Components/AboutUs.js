import React from 'react';
import { 
  BookOpen, 
  Users, 
  Star, 
  BookMarked,
  Heart,
  MessagesSquare,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import Footer from './Footer';

const AboutUs = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
      title: "Vast Book Collection",
      description: "Discover thousands of books across all genres, from timeless classics to contemporary bestsellers."
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      title: "Reader Community",
      description: "Connect with fellow book lovers, join reading groups, and share your literary journey."
    },
    {
      icon: <Star className="w-8 h-8 text-emerald-600" />,
      title: "Reviews & Ratings",
      description: "Share your thoughts and read authentic reviews from our community of readers."
    },
    {
      icon: <BookMarked className="w-8 h-8 text-emerald-600" />,
      title: "Personal Collections",
      description: "Create and organize your personal library with custom shelves and reading lists."
    }
  ];

  const socialFeatures = [
    {
      icon: <Heart className="w-6 h-6 text-emerald-600" />,
      text: "Follow your favorite readers"
    },
    {
      icon: <MessagesSquare className="w-6 h-6 text-emerald-600" />,
      text: "Participate in book discussions"
    },
    {
      icon: <Share2 className="w-6 h-6 text-emerald-600" />,
      text: "Share your reading progress"
    },
    {
      icon: <BookmarkPlus className="w-6 h-6 text-emerald-600" />,
      text: "Create reading challenges"
    }
  ];

  return (
    <div className='home-page mt-16'>
    <div className="w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to The Book Shelf
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your destination for discovering great books and connecting with a community of passionate readers.
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="bg-emerald-50 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-bold text-center mb-4">Our Mission</h2>
        <p className="text-gray-700 text-center max-w-3xl mx-auto">
          We're dedicated to creating a space where book lovers can discover, discuss, and share their passion for reading. 
          Our platform brings together the joy of books with the power of community.
        </p>
      </div>

      {/* Social Features */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-8">Connect with Readers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              {feature.icon}
              <span className="text-gray-700">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};


export default AboutUs;