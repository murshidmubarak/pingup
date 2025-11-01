// import React, { useEffect, useState } from 'react'
// import './Profile.css'
// import { useParams, useNavigate } from 'react-router-dom'
// import { dummyConnectionsData, dummyPostsData, dummyUserData } from '../../assets/assets'
// import { Settings, Camera, Grid, Bookmark, UserSquare2, MessageCircle } from 'lucide-react'
// import Loading from '../Loading'
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUser } from '../../features/user/userSlice'

// const Profile = () => {
//   const dispatch = useDispatch();
//   const { profileId } = useParams()
//   const navigate = useNavigate()
//   const [posts, setPosts] = useState([])
//   const [activeTab, setActiveTab] = useState('posts')
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [isOwnProfile, setIsOwnProfile] = useState(false)
//   const [isFollowing, setIsFollowing] = useState(false)



//   const currentUser = useSelector((state) => state.user.value)
//   const [loading, setLoading] = useState(true)
//   const [user, setUser] = useState(null)



//       useEffect(() => {

//       const initializeProfile = async () => {

//       setLoading(true);

//     const token = localStorage.getItem('token');
//      if (token && !currentUser) {
//        const fetchedUser = await dispatch(fetchUser(token)).unwrap();
//        setupProfileData(fetchedUser);
//        } else if (currentUser) {
//          setupProfileData(currentUser);
//         }


//     setLoading(false);
//   };
//   initializeProfile();
//   }, [dispatch, currentUser, profileId]);




//     const setupProfileData = (userData) => {
//     // If no profileId or profileId matches current user's ID, show current user's profile
//     if (!profileId || profileId === userData.id) {
//       setUser(userData)
//       setIsOwnProfile(true)
//     } else {
//       // For other users' profiles
//       const foundUser = dummyConnectionsData.find(u => u._id === profileId)
//       if (foundUser) {
//         setUser(foundUser)
//         setIsOwnProfile(false)
//         setIsFollowing(userData.following?.includes(profileId))
//       } else {
//         setUser(null)
//       }
//     }
//   }



//   const handleFollowToggle = () => {
//     setIsFollowing(!isFollowing)
//   }

//   const handleMessage = () => {
//     navigate('/messages')
//   }


//   return user? (
//     <div className='profile-container'>
//       <div className="profile-wrapper">
//         {/* Header with Settings */}
//         <div className="profile-header">
//           <h1 className="profile-username">{user.username}</h1>
//           {isOwnProfile && (
//             <button 
//               onClick={() => navigate('/settings')}
//               className="settings-btn"
//             >
//               <Settings size={24} />
//             </button>
//           )}
//         </div>

//         {/* Profile Info Section */}
//         <div className="profile-info-section">
//           {/* Profile Picture */}
//           <div className="profile-picture-wrapper">
//             <div className="profile-picture">
//               <img 
//                 src={user.profile_picture || 'https://via.placeholder.com/150'} 
//                 alt={user.full_name}
//               />
//             </div>
//             {/* {isOwnProfile && (
//               <button 
//                 className="change-photo-btn"
//                 onClick={() => setShowEditModal(true)}
//               >
//                 <Camera size={16} />
//               </button>
//             )} */}
//           </div>

//           {/* Stats and Actions */}
//           <div className="profile-details">
//             {/* Stats Row */}
//             <div className="profile-stats">
//               <div className="stat-item">
//                 <div className="stat-number">{posts.length}</div>
//                 <div className="stat-label">Posts</div>
//               </div>
//               <div className="stat-item clickable">
//                 <div className="stat-number">{user.followers?.length || 0}</div>
//                 <div className="stat-label">Followers</div>
//               </div>
//               <div className="stat-item clickable">
//                 <div className="stat-number">{user.following?.length || 0}</div>
//                 <div className="stat-label">Following</div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="profile-actions">
//               {isOwnProfile ? (
//                 <button 
//                   onClick={() => setShowEditModal(true)}
//                   className="action-btn edit-profile-btn"
//                 >
//                   Edit Profile
//                 </button>
//               ) : (
//                 <>
//                   <button 
//                     onClick={handleFollowToggle}
//                     className={`action-btn ${isFollowing ? 'following-btn' : 'follow-btn'}`}
//                   >
//                     {isFollowing ? 'Following' : 'Follow'}
//                   </button>
//                   <button 
//                     onClick={handleMessage}
//                     className="action-btn message-btn"
//                   >
//                     <MessageCircle size={18} />
//                     Message
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Bio */}
//             <div className="profile-bio">
//               <div className="bio-name">{user.full_name}</div>
//               {user.bio && (
//                 <div className="bio-text">{user.bio}</div>
//               )}
//               {user.location && (
//                 <div className="bio-location">📍 {user.location}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="profile-tabs">
//           <div className="tabs-wrapper">
//             <button
//               onClick={() => setActiveTab('posts')}
//               className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
//             >
//               <Grid size={20} />
//               <span className="tab-label">Posts</span>
//             </button>
//             {isOwnProfile && (
//               <button
//                 onClick={() => setActiveTab('saved')}
//                 className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
//               >
//                 <Bookmark size={20} />
//                 <span className="tab-label">Saved</span>
//               </button>
//             )}
//             <button
//               onClick={() => setActiveTab('tagged')}
//               className={`tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
//             >
//               <UserSquare2 size={20} />
//               <span className="tab-label">Tagged</span>
//             </button>
//           </div>
//         </div>

//         {/* Posts Grid */}
//         <div className="profile-content">
//           {activeTab === 'posts' && (
//             <div className="posts-grid">
//               {posts.length > 0 ? (
//                 posts.map((post) => (
//                   <div 
//                     key={post._id}
//                     className="post-item"
//                   >
//                     {post.image_urls && post.image_urls.length > 0 ? (
//                       <img 
//                         src={post.image_urls[0]} 
//                         alt="Post"
//                       />
//                     ) : (
//                       <div className="post-text-preview">
//                         {post.content.substring(0, 100)}...
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">No posts yet</div>
//               )}
//             </div>
//           )}

//           {activeTab === 'saved' && (
//             <div className="empty-state">No saved posts</div>
//           )}

//           {activeTab === 'tagged' && (
//             <div className="empty-state">No tagged posts</div>
//           )}
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {showEditModal && (
//         <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Edit Profile</h2>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="modal-close"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="modal-avatar">
//                 <div className="avatar-preview">
//                   <img 
//                     src={user.profile_picture || 'https://via.placeholder.com/150'} 
//                     alt={user.full_name}
//                   />
//                 </div>
//                 <button className="change-avatar-btn">
//                   Change Profile Photo
//                 </button>
//               </div>
//               <div className="modal-form">
//                 <div className="form-group">
//                   <label>Name</label>
//                   <input 
//                     type="text" 
//                     defaultValue={user.full_name}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Username</label>
//                   <input 
//                     type="text" 
//                     defaultValue={user.username}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Bio</label>
//                   <textarea 
//                     defaultValue={user.bio}
//                     rows="3"
//                   />
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="save-btn"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   ):<Loading/>
// }

// export default Profile




import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyConnectionsData, dummyPostsData } from '../../assets/assets';
import { Settings, Grid, Bookmark, UserSquare2, MessageCircle } from 'lucide-react';
import Loading from '../Loading';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser,updateUser } from '../../features/user/userSlice';
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
  const [showCropModal, setShowCropModal] = useState(false); // ✅ Crop modal state

  const currentUser = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Fetch or setup user profile
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

  const setupProfileData = (userData) => {
    if (!profileId || profileId === userData.id) {
      setUser(userData);
      setIsOwnProfile(true);
    } else {
      const foundUser = dummyConnectionsData.find((u) => u._id === profileId);
      if (foundUser) {
        setUser(foundUser);
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
                src={user.profile_picture || 'https://via.placeholder.com/150'}
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
                    <MessageCircle size={18} />
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

      {/* Edit Profile Modal */}
      {/* {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="modal-close">
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
                <button
                  className="change-avatar-btn"
                  onClick={() => setShowCropModal(true)} // ✅ opens crop modal
                >
                  Change Profile Photo
                </button>
              </div>

              <div className="modal-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" defaultValue={user.full_name} />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" defaultValue={user.username} />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea defaultValue={user.bio} rows="3" />
                </div>
              </div>

              <button onClick={() => setShowEditModal(false)} className="save-btn">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )} */}



      {/* ✅ Crop Photo Modal (outside main modal) */}
      {/* <ProfileAdd
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        onSave={(croppedImg) => setUser({ ...user, profile_picture: croppedImg })}
      /> */}

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












// import React, { useEffect, useState } from 'react'
// import './Profile.css'
// import { useParams, useNavigate } from 'react-router-dom'
// import { dummyConnectionsData, dummyPostsData } from '../../assets/assets'
// import { Settings, Camera, Grid, Bookmark, UserSquare2, MessageCircle } from 'lucide-react'
// import Loading from '../Loading'
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUser } from '../../features/user/userSlice'

// const Profile = () => {
//   const dispatch = useDispatch();
//   const { profileId } = useParams()
//   const navigate = useNavigate()
//   const [posts, setPosts] = useState([])
//   const [activeTab, setActiveTab] = useState('posts')
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [isOwnProfile, setIsOwnProfile] = useState(false)
//   const [isFollowing, setIsFollowing] = useState(false)
  
//   // Get user data from Redux store
//   const currentUser = useSelector((state) => state.user.value)
//   const [profileUser, setProfileUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const initializeProfile = async () => {
//       try {
//         setLoading(true)
//         const token = localStorage.getItem('token')
        
//         console.log('Initializing profile with:', { token, profileId, currentUser })

//         // If we have a token but no current user, fetch user data
//         if (token && !currentUser) {
//           console.log('Fetching user data...')
//           await dispatch(fetchUser(token)).unwrap()
//           // Don't set profileUser here - wait for the Redux state update
//           return // Exit early and let the useEffect below handle the rest
//         }

//         // If we have currentUser, set up the profile
//         if (currentUser) {
//           setupProfileData(currentUser)
//         }

//       } catch (error) {
//         console.error('Error initializing profile:', error)
//         setLoading(false)
//       }
//     }

//     initializeProfile()
//   }, [dispatch, profileId])

//   // Separate useEffect to handle profile setup when currentUser changes
//   useEffect(() => {
//     if (currentUser) {
//       console.log('Current user updated, setting up profile:', currentUser)
//       setupProfileData(currentUser)
//       setLoading(false)
//     }
//   }, [currentUser, profileId])

//   const setupProfileData = (userData) => {
//     // If no profileId or profileId matches current user's ID, show current user's profile
//     if (!profileId || profileId === userData.id) {
//       console.log('Setting own profile:', userData)
//       setProfileUser(userData)
//       setIsOwnProfile(true)
//     } else {
//       // For other users' profiles
//       console.log('Setting other user profile for ID:', profileId)
//       const foundUser = dummyConnectionsData.find(u => u._id === profileId)
//       if (foundUser) {
//         setProfileUser(foundUser)
//         setIsOwnProfile(false)
//         setIsFollowing(userData.following?.includes(profileId))
//       } else {
//         console.log('User not found in connections')
//         setProfileUser(null)
//       }
//     }

//     // Set posts based on the profile user
//     const targetUserId = profileId || userData.id
//     const userPosts = dummyPostsData.filter(post => post.userId === targetUserId)
//     setPosts(userPosts)
//   }

//   const handleFollowToggle = () => {
//     setIsFollowing(!isFollowing)
//   }

//   const handleMessage = () => {
//     navigate('/messages')
//   }

//   // Show loading while initializing
//   if (loading) {
//     return <Loading />
//   }

//   // Show error if no user data
//   if (!profileUser) {
//     return (
//       <div className="error-state">
//         <h2>User Not Found</h2>
//         <p>The profile you're looking for doesn't exist.</p>
//         <button onClick={() => navigate('/')}>Go Home</button>
//       </div>
//     )
//   }

//   return (
//     <div className='profile-container'>
//       <div className="profile-wrapper">
//         {/* Header with Settings */}
//         <div className="profile-header">
//           <h1 className="profile-username">{profileUser.username}</h1>
//           {isOwnProfile && (
//             <button 
//               onClick={() => navigate('/settings')}
//               className="settings-btn"
//             >
//               <Settings size={24} />
//             </button>
//           )}
//         </div>

//         {/* Profile Info Section */}
//         <div className="profile-info-section">
//           {/* Profile Picture */}
//           <div className="profile-picture-wrapper">
//             <div className="profile-picture">
//               <img 
//                 src={profileUser.profile_picture || 'https://via.placeholder.com/150'} 
//                 alt={profileUser.full_name}
//               />
//             </div>
//             {isOwnProfile && (
//               <button 
//                 className="change-photo-btn"
//                 onClick={() => setShowEditModal(true)}
//               >
//                 <Camera size={16} />
//               </button>
//             )}
//           </div>

//           {/* Stats and Actions */}
//           <div className="profile-details">
//             {/* Stats Row */}
//             <div className="profile-stats">
//               <div className="stat-item">
//                 <div className="stat-number">{posts.length}</div>
//                 <div className="stat-label">Posts</div>
//               </div>
//               <div className="stat-item clickable">
//                 <div className="stat-number">{profileUser.followers?.length || 0}</div>
//                 <div className="stat-label">Followers</div>
//               </div>
//               <div className="stat-item clickable">
//                 <div className="stat-number">{profileUser.following?.length || 0}</div>
//                 <div className="stat-label">Following</div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="profile-actions">
//               {isOwnProfile ? (
//                 <button 
//                   onClick={() => setShowEditModal(true)}
//                   className="action-btn edit-profile-btn"
//                 >
//                   Edit Profile
//                 </button>
//               ) : (
//                 <>
//                   <button 
//                     onClick={handleFollowToggle}
//                     className={`action-btn ${isFollowing ? 'following-btn' : 'follow-btn'}`}
//                   >
//                     {isFollowing ? 'Following' : 'Follow'}
//                   </button>
//                   <button 
//                     onClick={handleMessage}
//                     className="action-btn message-btn"
//                   >
//                     <MessageCircle size={18} />
//                     Message
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Bio */}
//             <div className="profile-bio">
//               <div className="bio-name">{profileUser.full_name}</div>
//               {profileUser.bio && (
//                 <div className="bio-text">{profileUser.bio}</div>
//               )}
//               {profileUser.location && (
//                 <div className="bio-location">📍 {profileUser.location}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="profile-tabs">
//           <div className="tabs-wrapper">
//             <button
//               onClick={() => setActiveTab('posts')}
//               className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
//             >
//               <Grid size={20} />
//               <span className="tab-label">Posts</span>
//             </button>
//             {isOwnProfile && (
//               <button
//                 onClick={() => setActiveTab('saved')}
//                 className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
//               >
//                 <Bookmark size={20} />
//                 <span className="tab-label">Saved</span>
//               </button>
//             )}
//             <button
//               onClick={() => setActiveTab('tagged')}
//               className={`tab-btn ${activeTab === 'tagged' ? 'active' : ''}`}
//             >
//               <UserSquare2 size={20} />
//               <span className="tab-label">Tagged</span>
//             </button>
//           </div>
//         </div>

//         {/* Posts Grid */}
//         <div className="profile-content">
//           {activeTab === 'posts' && (
//             <div className="posts-grid">
//               {posts.length > 0 ? (
//                 posts.map((post) => (
//                   <div 
//                     key={post._id}
//                     className="post-item"
//                   >
//                     {post.image_urls && post.image_urls.length > 0 ? (
//                       <img 
//                         src={post.image_urls[0]} 
//                         alt="Post"
//                       />
//                     ) : (
//                       <div className="post-text-preview">
//                         {post.content.substring(0, 100)}...
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">No posts yet</div>
//               )}
//             </div>
//           )}

//           {activeTab === 'saved' && (
//             <div className="empty-state">No saved posts</div>
//           )}

//           {activeTab === 'tagged' && (
//             <div className="empty-state">No tagged posts</div>
//           )}
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {showEditModal && (
//         <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Edit Profile</h2>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="modal-close"
//               >
//                 ×
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="modal-avatar">
//                 <div className="avatar-preview">
//                   <img 
//                     src={profileUser.profile_picture } 
//                     alt={profileUser.full_name}
//                   />
//                 </div>
//                 <button className="change-avatar-btn">
//                   Change Profile Photo
//                 </button>
//               </div>
//               <div className="modal-form">
//                 <div className="form-group">
//                   <label>Full Name</label>
//                   <input 
//                     type="text" 
//                     defaultValue={profileUser.full_name}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Username</label>
//                   <input 
//                     type="text" 
//                     defaultValue={profileUser.username}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Email</label>
//                   <input 
//                     type="email" 
//                     defaultValue={profileUser.email}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Bio</label>
//                   <textarea 
//                     defaultValue={profileUser.bio}
//                     rows="3"
//                   />
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setShowEditModal(false)}
//                 className="save-btn"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Profile