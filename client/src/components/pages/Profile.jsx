import React, { useEffect, useState } from 'react'
import './Profile.css'
import { useParams, useNavigate } from 'react-router-dom'
import { dummyConnectionsData, dummyPostsData, dummyUserData } from '../../assets/assets'
import { Settings, Camera, Grid, Bookmark, UserSquare2, MessageCircle } from 'lucide-react'
import Loading from '../Loading'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { profileId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEditModal, setShowEditModal] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const userData = useSelector((state) => state.user.value)

  const fetchUser = async () => {
    // If no profileId, show logged-in user's profile
    if (!profileId || profileId === userData._id) {
      setUser(userData)
      setIsOwnProfile(true)
    } else {
      // Find user from connections
      const foundUser = dummyConnectionsData.find(u => u._id === profileId)
      setUser(foundUser )
      setIsOwnProfile(false)
      setIsFollowing(userData.following?.includes(profileId))
    }
    setPosts(dummyPostsData)
  }

  useEffect(() => {
    fetchUser()
  }, [profileId])

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
  }

  const handleMessage = () => {
    navigate('/messages')
  }


  return user? (
    <div className='profile-container'>
      <div className="profile-wrapper">
        {/* Header with Settings */}
        <div className="profile-header">
          <h1 className="profile-username">{user.username}</h1>
          {isOwnProfile && (
            <button 
              onClick={() => navigate('/settings')}
              className="settings-btn"
            >
              <Settings size={24} />
            </button>
          )}
        </div>

        {/* Profile Info Section */}
        <div className="profile-info-section">
          {/* Profile Picture */}
          <div className="profile-picture-wrapper">
            <div className="profile-picture">
              <img 
                src={user.profile_picture || 'https://via.placeholder.com/150'} 
                alt={user.full_name}
              />
            </div>
            {isOwnProfile && (
              <button 
                className="change-photo-btn"
                onClick={() => setShowEditModal(true)}
              >
                <Camera size={16} />
              </button>
            )}
          </div>

          {/* Stats and Actions */}
          <div className="profile-details">
            {/* Stats Row */}
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

            {/* Action Buttons */}
            <div className="profile-actions">
              {isOwnProfile ? (
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="action-btn edit-profile-btn"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    onClick={handleFollowToggle}
                    className={`action-btn ${isFollowing ? 'following-btn' : 'follow-btn'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button 
                    onClick={handleMessage}
                    className="action-btn message-btn"
                  >
                    <MessageCircle size={18} />
                    Message
                  </button>
                </>
              )}
            </div>

            {/* Bio */}
            <div className="profile-bio">
              <div className="bio-name">{user.full_name}</div>
              {user.bio && (
                <div className="bio-text">{user.bio}</div>
              )}
              {user.location && (
                <div className="bio-location">📍 {user.location}</div>
              )}
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

        {/* Posts Grid */}
        <div className="profile-content">
          {activeTab === 'posts' && (
            <div className="posts-grid">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div 
                    key={post._id}
                    className="post-item"
                  >
                    {post.image_urls && post.image_urls.length > 0 ? (
                      <img 
                        src={post.image_urls[0]} 
                        alt="Post"
                      />
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

          {activeTab === 'saved' && (
            <div className="empty-state">No saved posts</div>
          )}

          {activeTab === 'tagged' && (
            <div className="empty-state">No tagged posts</div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-avatar">
                <div className="avatar-preview">
                  <img 
                    src={user.profile_picture || 'https://via.placeholder.com/150'} 
                    alt={user.full_name}
                  />
                </div>
                <button className="change-avatar-btn">
                  Change Profile Photo
                </button>
              </div>
              <div className="modal-form">
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.full_name}
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    defaultValue={user.username}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    defaultValue={user.bio}
                    rows="3"
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="save-btn"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ):<Loading/>
}

export default Profile