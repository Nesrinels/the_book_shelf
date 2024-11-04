import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Book, Users, BookOpen, Target } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PROFILE');

  console.log("AuthContext - isAuthenticated:", isAuthenticated, "user:", user, "isLoading:", isLoading); // Check values

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user || !user.id) {
      console.log("fetchUserData skipped - missing user or isAuthenticated");
      return; // Ensure user and user.id are available
    }

    console.log("fetchUserData executing"); // Log fetch initiation

    try {
      const response = await apiService.getUserProfile(user.id);
      setUserData({
        username: response.username,
        bio: response.bio,
        profilePicture: response.profilePicture || 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
        booksRead: response.booksRead || [],
        booksReadCount: response.booksRead?.length || 0,
        following: response.following || [],
        followingCount: response.following?.length || 0,
        friends: response.friends || [],
        friendsCount: response.friends?.length || 0,
        readingChallenge: {
          goal: response.readingChallenge?.goal || 0,
          current: response.readingChallenge?.current || 0
        },
        lastYearBooks: response.lastYearBooks || 0,
        groups: response.groups || [],
        genres: calculateGenres(response.booksRead || [])
      });
      setLoading(false);
    } catch (error) {
      console.error("fetchUserData error:", error);
      setError(error.message || 'Failed to fetch user data');
      if (error.response?.status === 401) {
        apiService.logout();
      }
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isLoading) {
      fetchUserData();
    }
  }, [fetchUserData, isLoading]);

  const calculateGenres = (booksRead) => {
    const genreCounts = {};
    booksRead.forEach(book => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }
    });

    return Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);
  };

  const handleEditProfile = async (updatedData) => {
    try {
      await apiService.updateProfile(user.id, updatedData); // Use user.id as per the backend
      await fetchUserData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
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
          className="absolute top-4 right-4 bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm"
        >
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
            { name: 'BOOKS', count: userData.booksReadCount },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <ReadingChallengeCard stats={userData.readingChallenge} lastYear={userData.lastYearBooks} />
              <GenresCard genres={userData.genres} totalBooks={userData.booksReadCount} />
            </div>
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
    <p>
      {stats.current} / {stats.goal} books read this year.
    </p>
    <p>{lastYear} books read last year.</p>
  </div>
);

const GenresCard = ({ genres, totalBooks }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <h2 className="text-lg font-semibold mb-4">Top Genres</h2>
    {genres.length > 0 ? (
      genres.map((genre) => (
        <p key={genre.name}>
          {genre.name}: {genre.count} / {totalBooks} books
        </p>
      ))
    ) : (
      <p>No genres available</p>
    )}
  </div>
);

const GroupsSection = ({ groups }) => (
  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
    <h2 className="text-lg font-semibold mb-4">Groups</h2>
    {groups.length > 0 ? (
      groups.map((group) => <p key={group.name}>{group.name}</p>)
    ) : (
      <p>No groups joined</p>
    )}
  </div>
);

export default ProfilePage;
