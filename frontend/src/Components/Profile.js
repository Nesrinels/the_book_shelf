import React, { useState } from 'react';
import { Heart, MessageCircle, Book, Users, BookOpen, Target } from 'lucide-react';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('PROFILE');
  
  const userStats = {
    booksRead: 48,
    following: 234,
    friends: 156,
    yearlyChallenge: {
      goal: 50,
      current: 23,
    },
    lastYearBooks: 42,
    genres: [
      { name: 'Fantasy', count: 15 },
      { name: 'Science Fiction', count: 12 },
      { name: 'Mystery', count: 8 },
      { name: 'Romance', count: 5 },
    ],
    groups: [
      { name: 'Fantasy Book Club', members: 1234 },
      { name: 'Science Fiction Readers', members: 856 },
      { name: 'Mystery Lovers', members: 654 },
    ]
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header Banner */}
      <div className="relative h-32 sm:h-48 bg-gray-300">
        <div className="absolute bottom-0 left-4 sm:left-8 transform translate-y-1/2">
          <img 
            src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white"
          />
        </div>
        <button className="absolute top-4 right-4 bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm">
          Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="pt-12 sm:pt-16 px-4 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">Sean Ngu</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Book lover | Fantasy enthusiast | Always reading something new
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center space-x-4 sm:space-x-8 mt-4 sm:mt-6 px-2">
        <StatCard label="Books Read" value={userStats.booksRead} />
        <StatCard label="Following" value={userStats.following} />
        <StatCard label="Friends" value={userStats.friends} />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b mt-4 overflow-x-auto">
        <div className="flex px-4 sm:px-8 min-w-max">
          {[
            { name: 'PROFILE', count: null },
            { name: 'BOOKS', count: userStats.booksRead },
            { name: 'FOLLOWING', count: userStats.following },
            { name: 'FRIENDS', count: userStats.friends },
            { name: 'GROUPS', count: userStats.groups.length },
            { name: 'REVIEWS', count: null }
          ].map(({ name, count }) => (
            <TabButton 
              key={name}
              name={name}
              count={count}
              isActive={activeTab === name}
              onClick={() => setActiveTab(name)}
            />
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto py-4 sm:py-8 px-4">
        {activeTab === 'PROFILE' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Reading Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Reading Challenge */}
              <ReadingChallengeCard stats={userStats.yearlyChallenge} lastYear={userStats.lastYearBooks} />
              
              {/* Top Genres */}
              <GenresCard genres={userStats.genres} totalBooks={userStats.booksRead} />
            </div>

            {/* Groups Section */}
            <GroupsSection groups={userStats.groups} />
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ label, value }) => (
  <div className="text-center">
    <div className="font-bold text-lg sm:text-xl">{value}</div>
    <div className="text-xs sm:text-sm text-gray-600">{label}</div>
  </div>
);

const TabButton = ({ name, count, isActive, onClick }) => (
  <button
    className={`px-3 sm:px-4 py-2 font-medium flex items-center whitespace-nowrap ${
      isActive ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-600'
    }`}
    onClick={onClick}
  >
    {name}
    {count !== null && (
      <span className="ml-2 bg-gray-200 px-1.5 py-0.5 rounded-full text-xs sm:text-sm">
        {count}
      </span>
    )}
  </button>
);

const ReadingChallengeCard = ({ stats, lastYear }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="flex items-center mb-4">
      <Target className="text-emerald-600 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
      <h2 className="text-lg sm:text-xl font-bold">2024 Reading Challenge</h2>
    </div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
          {stats.current} / {stats.goal}
        </p>
        <p className="text-sm sm:text-base text-gray-600">books read</p>
      </div>
      <div className="text-right">
        <p className="text-sm sm:text-base text-gray-600">Last year:</p>
        <p className="font-bold">{lastYear} books</p>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
      <div 
        className="bg-emerald-600 h-2.5 rounded-full"
        style={{ width: `${(stats.current / stats.goal) * 100}%` }}
      ></div>
    </div>
  </div>
);

const GenresCard = ({ genres, totalBooks }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="flex items-center mb-4">
      <BookOpen className="text-emerald-600 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
      <h2 className="text-lg sm:text-xl font-bold">Top Genres</h2>
    </div>
    <div className="space-y-3">
      {genres.map(genre => (
        <div key={genre.name} className="flex justify-between items-center">
          <span className="text-sm sm:text-base text-gray-700">{genre.name}</span>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm text-gray-500 mr-2">
              {genre.count} books
            </span>
            <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: `${(genre.count / totalBooks) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GroupsSection = ({ groups }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Users className="text-emerald-600 mr-2 h-5 w-5 sm:h-6 sm:w-6" />
        <h2 className="text-lg sm:text-xl font-bold">Groups</h2>
      </div>
      <button className="text-sm sm:text-base text-emerald-600 hover:text-emerald-700">
        View All
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {groups.map(group => (
        <div key={group.name} className="border rounded-lg p-3 sm:p-4">
          <h3 className="font-semibold text-sm sm:text-base">{group.name}</h3>
          <p className="text-xs sm:text-sm text-gray-500">
            {group.members.toLocaleString()} members
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default ProfilePage;