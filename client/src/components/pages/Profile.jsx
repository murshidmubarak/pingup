import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings, Grid, Bookmark, UserSquare2, MessageCircle } from 'lucide-react';
import Loading from '../Loading';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser,updateUser,fetchUserById } from '../../features/user/userSlice';
import ProfileAdd from '../ProfileAdd';
import EditProfileModal from '../EditProfileModal';

const Profile = () => {
  const dispatch = useDispatch();
  const { profileId } = useParams();
  const navigate = useNavigate();

  

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false); 

  const currentUser = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  


    useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token && !currentUser) {
        const fetchedUser = await dispatch(fetchUser(token)).unwrap();
        setupProfileData(fetchedUser);
      } else if (currentUser) {
        setupProfileData(currentUser);
      }
      setLoading(false);
    };
    initializeProfile();
  }, [dispatch, currentUser, profileId]);

  const setupProfileData = async (userData) => {
    if (!profileId || profileId === userData.id) {
      setUser(userData);
      setIsOwnProfile(true);
    } else {
      const otherUser = await dispatch(fetchUserById(profileId)).unwrap();

      if (otherUser) {
        setUser(otherUser);
        setIsOwnProfile(false);
        setIsFollowing(userData.following?.includes(profileId));
      } else {
        setUser(null);
      }
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    navigate('/messages');
  };

  if (!user) return <Loading />;

  const defaultProfilePic = `https://ui-avatars.com/api/?background=cccccc&color=ffffff&name=${encodeURIComponent(
  user?.full_name ? user.full_name[0].toUpperCase() : 'U'
)}`;


  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-username">{user.username}</h1>
          {isOwnProfile && (
            <button onClick={() => navigate('/settings')} className="settings-btn">
              <Settings size={24} />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="profile-info-section">
          <div className="profile-picture-wrapper">
            <div className="profile-picture">
              <img
                src={user.profile_picture || defaultProfilePic}
                alt={user.full_name}
              />
            </div>
          </div>

          <div className="profile-details">
            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <div className="stat-number">{posts.length}</div>
                <div className="stat-label">Posts</div>
              </div>
              <div className="stat-item clickable">
                <div className="stat-number">{user.followers?.length || 0}</div>
                <div className="stat-label">Followers</div>
              </div>
              <div className="stat-item clickable">
                <div className="stat-number">{user.following?.length || 0}</div>
                <div className="stat-label">Following</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="profile-actions">
              {/* {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="action-btn edit-profile-btn"
                >
                  Edit Profile
                </button>
              ) : */}
              
              {isOwnProfile ? (
                 <button
                 onClick={() => setShowEditModal(true)}
                 className="action-btn edit-profile-btn"
                 >
                Edit Profile
              </button>
               ) :(
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`action-btn ${isFollowing ? 'following-btn' : 'follow-btn'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button onClick={handleMessage} className="action-btn message-btn">
                    {/* <MessageCircle size={18} /> */}
                    Message
                  </button>
                </>
              )}
            </div>

            {/* Bio */}
            <div className="profile-bio">
              <div className="bio-name">{user.full_name}</div>
              {user.bio && <div className="bio-text">{user.bio}</div>}
              {user.location && <div className="bio-location">📍 {user.location}</div>}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <div className="tabs-wrapper">
            <button
              onClick={() => setActiveTab('posts')}
              className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            >
              <Grid size={20} />
              <span className="tab-label">Posts</span>
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('saved')}
                className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              >
                <Bookmark size={20} />
                <span className="tab-label">Saved</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('tagged')}
              className={`tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
            >
              <UserSquare2 size={20} />
              <span className="tab-label">Tagged</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="profile-content">
          {activeTab === 'posts' && (
            <div className="posts-grid">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="post-item">
                    {post.image_urls?.length ? (
                      <img src={post.image_urls[0]} alt="Post" />
                    ) : (
                      <div className="post-text-preview">
                        {post.content.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="empty-state">No posts yet</div>
              )}
            </div>
          )}

          {activeTab === 'saved' && <div className="empty-state">No saved posts</div>}
          {activeTab === 'tagged' && <div className="empty-state">No tagged posts</div>}
        </div>
      </div>



      <ProfileAdd
      isOpen={showCropModal}
      onClose={() => setShowCropModal(false)}
      onSave={async (croppedImg) => {
      const token = localStorage.getItem("token");
       if (!token) return;
      await dispatch(updateUser({ token, userData: { profile_picture: croppedImg } }));
      setUser((prev) => ({ ...prev, profile_picture: croppedImg }));
       }}
      />


       <EditProfileModal
        user={user}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onOpenCrop={() => setShowCropModal(true)} // for profile crop
      />
    </div>
  );
};

export default Profile;