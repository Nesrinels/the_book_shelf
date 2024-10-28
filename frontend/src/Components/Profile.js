import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Book, Users, BookOpen, Target } from 'lucide-react';
import apiService from '../services/api';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return; // Don't call logout, just handle it with the error state
      }
      const response = await apiService.client.get(`/users/${userId}`);

      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      const data = response.data;
      const transformedData = {
        username: data.username,
        bio: data.bio,
        profilePicture: data.profilePicture || 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
        booksRead: data.booksRead || [],
        booksReadCount: data.booksRead?.length || 0,
        following: data.following || [],
        followingCount: data.following?.length || 0,
        friends: data.friends || [],
        friendsCount: data.friends?.length || 0,
        readingChallenge: {
          goal: data.readingChallenge?.goal || 0,
          current: data.readingChallenge?.current || 0
        },
        lastYearBooks: data.lastYearBooks || 0,
        groups: data.groups || [],
        genres: calculateGenres(data.booksRead || [])
      };

      setUserData(transformedData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      // No need to call logout here
    }
  };

  const calculateGenres = (booksRead) => {
    const genreCounts = {};
    booksRead.forEach(book => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }
    });

    return Object.entries(genreCounts)
    .map(([name, count]) =>({name, count}))
    .sort((a, b) => b.count - a.count)
    .slice(0,4);
  };

  const handleEditProfile = async (updatedData) => {
    try {
      const userId = localStorage.getItem('userId');
      await apiService.client.put(`/users/${userId}`, updatedData);
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserData}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600'></div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="bg-gray-100 min-h-screen mt-16">
      {/* Header Banner */}
      <div className="relative h-32 sm:h-48 bg-gray-300">
        <div className="absolute bottom-0 left-4 sm:left-8 transform translate-y-1/2">
          <img 
            src={userData.profilePicture}
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
        <button
        onClick={() => {
          handleEditProfile({
            bio: "Updated bio"
          });
        }}
        className="absolute top-4 right-4 bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm">
          Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="pt-12 sm:pt-16 px-4 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">{userData.username}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {userData.bio || 'no bio added yet'}
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex justify-center space-x-4 sm:space-x-8 mt-4 sm:mt-6 px-2">
        <StatCard label="Books Read" value={userData.booksReadCount} />
        <StatCard label="Following" value={userData.followingCount} />
        <StatCard label="Friends" value={userData.friendsCount} />
      </div>

      {/* Navigation Tabs */}
      <div className="border-b mt-4 overflow-x-auto">
        <div className="flex px-4 sm:px-8 min-w-max">
          {[
            { name: 'PROFILE', count: null },
            { name: 'BOOKS', count: userData.booksReadCount},
            { name: 'FOLLOWING', count: userData.followingCount },
            { name: 'FRIENDS', count: userData.friendsCount },
            { name: 'GROUPS', count: userData.groups.length },
            { name: 'REVIEWS', count: userData.booksRead?.length }
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
              <ReadingChallengeCard stats={userData.yearlyChallenge} lastYear={userData.lastYearBooks} />
              
              {/* Top Genres */}
              <GenresCard genres={userData.genres} totalBooks={userData.booksReadCount} />
            </div>

            {/* Groups Section */}
            <GroupsSection groups={userData.groups} />
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
      <Target className="text-emerald-600 mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold">Reading Challenge</h2>
    </div>
    <div>
      <div className="font-bold text-xl">{stats.current} / {stats.goal}</div>
      <div className="text-gray-600">Books Read this Year</div>
      <div className="text-gray-600">Last Year: {lastYear} Books</div>
    </div>
  </div>
);

const GenresCard = ({ genres, totalBooks }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="flex items-center mb-4">
      <BookOpen className="text-emerald-600 mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold">Top Genres</h2>
    </div>
    <ul>
      {genres.map(genre => (
        <li key={genre.name} className="flex justify-between">
          <span>{genre.name}</span>
          <span>{genre.count} ({((genre.count / totalBooks) * 100).toFixed(0)}%)</span>
        </li>
      ))}
    </ul>
  </div>
);

const GroupsSection = ({ groups }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <div className="flex items-center mb-4">
      <Users className="text-emerald-600 mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold">Groups</h2>
    </div>
    <ul>
      {groups.length === 0 ? (
        <li>No groups found.</li>
      ) : (
        groups.map(group => <li key={group.id}>{group.name}</li>)
      )}
    </ul>
  </div>
);

export default ProfilePage;
