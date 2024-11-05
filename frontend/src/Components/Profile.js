import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, Minus, BookOpen, Heart, MessageCircle, Book, Users, UserPlus } from 'lucide-react';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeGoal, setChallengeGoal] = useState(0);
  const [lastYearBooksList, setLastYearBooksList] = useState([]);
  const [showLastYearBooks, setShowLastYearBooks] = useState(false);
  const [friendsToAdd, setFriendsToAdd] = useState([]);
  


  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);

  useEffect(() => {
    // Fetch wishlist and purchased books from the API
    const fetchBooks = async () => {
      try {
        const wishlistResponse = await apiService.getWishlist(user.id);
        setWishlistBooks(wishlistResponse);
        // const purchasedResponse = await apiService.getPurchasedBooks(user.id);
        // setPurchasedBooks(purchasedResponse);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message || 'Failed to fetch books');
      }
    };
    fetchBooks();
  }, [user.id]);


  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await apiService.removeFromWishlist(bookId);
      setWishlistBooks(wishlistBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error removing book from wishlist:', error);
      setError(error.message || 'Failed to remove book from wishlist');
    }
  };

  // // 3. Add friends section
  // const [friends, setFriends] = useState([]);

  // useEffect(() => {
  //   // Fetch friends from the API
  //   const fetchFriends = async () => {
  //     try {
  //       const friendsResponse = await apiService.getFriends(user.id);
  //       setFriends(friendsResponse);
  //     } catch (error) {
  //       console.error('Error fetching friends:', error);
  //       setError(error.message || 'Failed to fetch friends');
  //     }
  //   };
  //   fetchFriends();
  // }, [user.id]);


  // 5. Add reviews section
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from the API
    const fetchReviews = async () => {
      try {
        const reviewsResponse = await apiService.getAllReviews();
        setReviews(reviewsResponse);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.message || 'Failed to fetch reviews');
      }
    };
    fetchReviews();
  }, []);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated || !user || !user.id) return;

    try {
      const response = await apiService.getUserProfile(user.id);
      setUserData({
        ...response,
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
        lastYearBooks: response.lastYearBooks || [],
        genres: calculateGenres(response.booksRead || [])
      });
      setLastYearBooksList(response.lastYearBooks || []);
      setChallengeGoal(response.readingChallenge?.goal || 0);
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

  const handleChallengeUpdate = async (newGoal) => {
    try {
      await apiService.updateProfile(user.id, {
        readingChallenge: {
          goal: newGoal,
          current: userData.readingChallenge.current
        }
      });
      await fetchUserData();
      setShowChallengeModal(false);
    } catch (error) {
      console.error('Error updating reading challenge:', error);
      setError(error.message || 'Failed to update reading challenge');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
          onClick={() => {/* Handle edit profile */}}
          className="absolute top-4 right-4 bg-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm hover:bg-gray-50"
        >
          Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="pt-12 sm:pt-16 px-4 sm:px-8">
        <h1 className="text-xl sm:text-2xl font-bold">{userData.username}</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          {userData.bio || 'No bio added yet'}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-8 mt-6">
        <div className="text-center">
          <div className="font-bold text-xl">{userData.booksReadCount}</div>
          <div className="text-sm text-gray-600">Books Read</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-xl">{userData.followingCount}</div>
          <div className="text-sm text-gray-600">Following</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-xl">{userData.friendsCount}</div>
          <div className="text-sm text-gray-600">Friends</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b mt-6">
        <div className="flex px-4 sm:px-8 space-x-4 overflow-x-auto">
          {['PROFILE', 'BOOKS', 'FOLLOWING', 'FRIENDS',  'REVIEWS'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-emerald-600 text-emerald-600'
                  : 'text-gray-600'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-4">
        {activeTab === 'PROFILE' && (
          <div className="space-y-6">
            {/* Reading Challenge Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Target className="text-emerald-600 mr-2 h-5 w-5" />
                  <h2 className="text-lg font-semibold">Reading Challenge</h2>
                </div>
                <button
                  onClick={() => setShowChallengeModal(true)}
                  className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Set Goal
                </button>
              </div>
              <p className="mb-4">
                {userData.readingChallenge.current} / {userData.readingChallenge.goal} books read this year
              </p>
              <button
                onClick={() => setShowLastYearBooks(!showLastYearBooks)}
                className="text-emerald-600 hover:text-emerald-700"
              >
                {lastYearBooksList.length} books read last year
              </button>
              {showLastYearBooks && (
                <div className="mt-4 max-h-48 overflow-y-auto">
                  {lastYearBooksList.map((book, index) => (
                    <div key={index} className="flex items-center space-x-2 py-1">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <span>{book.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Genres Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Top Genres</h2>
              {userData.genres.length > 0 ? (
                userData.genres.map((genre) => (
                  <p key={genre.name} className="py-1">
                    {genre.name}: {genre.count} / {userData.booksReadCount} books
                  </p>
                ))
              ) : (
                <p>No genres available</p>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Reading Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Set Reading Challenge Goal</h3>
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => setChallengeGoal(Math.max(0, challengeGoal - 1))}
                className="p-2 rounded-md border hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                value={challengeGoal}
                onChange={(e) => setChallengeGoal(parseInt(e.target.value) || 0)}
                className="w-20 text-center border rounded-md p-2"
              />
              <button
                onClick={() => setChallengeGoal(challengeGoal + 1)}
                className="p-2 rounded-md border hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowChallengeModal(false)}
                className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleChallengeUpdate(challengeGoal)}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    {/* 2. Books section in the navigation bar
    <div className="border-b mt-6">
      <div className="flex px-4 sm:px-8 space-x-4 overflow-x-auto">
        {['PROFILE', 'BOOKS', 'WISHLIST', 'PURCHASED', 'FOLLOWING', 'FRIENDS', 'REVIEWS'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-emerald-600 text-emerald-600'
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div> */}

    {/* Books, Wishlist, and Purchased sections */}
    {activeTab === 'BOOKS' && (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Books</h2>
          {/* Add your books section content here */}
        </div>
      </div>
    )}
    {activeTab === 'WISHLIST' && (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Wishlist</h2>
          {wishlistBooks.length > 0 ? (
            wishlistBooks.map((book) => (
              <div key={book._id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4 text-gray-500" />
                  <span>{book.title}</span>
                </div>
                <button
                  onClick={() => handleRemoveFromWishlist(book._id)}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      </div>
    )}
    {activeTab === 'PURCHASED' && (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Purchased</h2>
          {purchasedBooks.length > 0 ? (
            purchasedBooks.map((book) => (
              <div key={book._id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4 text-gray-500" />
                  <span>{book.title}</span>
                </div>
                <button className="text-emerald-600 hover:text-emerald-700">
                  Review
                </button>
              </div>
            ))
          ) : (
            <p>No purchased books yet.</p>
          )}
        </div>
      </div>
    )}

    {/* 3. Friends section
    {activeTab === 'FRIENDS' && (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Friends</h2>
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-4 py-2">
                <img
                  src={friend.profilePicture}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{friend.username}</h3>
                  <p className="text-gray-600 text-sm">{friend.bio || 'No bio'}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No friends yet</p>
          )}
        </div>
      </div>
    )} */}


    {/* 5. Reviews section */}
    {activeTab === 'REVIEWS' && (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="flex items-start space-x-4 py-4 border-b">
                <img
                  src={review.user.profilePicture}
                  alt={review.user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{review.user.username}</h3>
                  <p className="text-gray-600">{review.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>{review.likes} likes</span>
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span>{review.comments.length} comments</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>
      </div>
    )}
    </div>
  );
};


export default ProfilePage;