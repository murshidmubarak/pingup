// import React, { useState } from 'react';

// const Beginning = () => {
//   const [username, setUsername] = useState('');
//   const [bio, setBio] = useState('');
//   const [errors, setErrors] = useState({});

//   const handleSubmit = () => {
//     // Validate username
//     if (!username.trim()) {
//       setErrors({ username: 'Username is required' });
//       return;
//     }
    
//     setErrors({});
    
//     // Handle form submission
//     console.log('Form submitted:', { username, bio });
//     alert(`Profile saved!\nUsername: ${username}\nBio: ${bio || 'No bio provided'}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your Profile</h2>
        
//         <div className="space-y-5">
//           <div>
//             <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//               Username <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
//                 errors.username ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Enter your username"
//             />
//             {errors.username && (
//               <p className="text-red-500 text-sm mt-1">{errors.username}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
//               Bio <span className="text-gray-400 text-xs">(optional)</span>
//             </label>
//             <textarea
//               id="bio"
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               rows="4"
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
//               placeholder="Tell us about yourself..."
//             />
//             <p className="text-gray-500 text-xs mt-1">{bio.length} characters</p>
//           </div>

//           <button
//             onClick={handleSubmit}
//             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
//           >
//             Save Profile
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Beginning;





// components/pages/beginning.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { completeUserProfile } from '../../features/auth/authSlice';

const Beginning = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Pre-fill form with existing user data
    if (user) {
      setUsername(user.username || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    
    try {
      await dispatch(completeUserProfile({
        username: username.trim(),
        bio: bio.trim()
      })).unwrap();
      
      // Success - automatic redirect will happen via route protection
      // You can add a toast notification here if needed
      
    } catch (error) {
      // Error is already handled in the slice
      console.error('Profile completion failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600 mb-6">Please complete your profile to continue using the app.</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                formErrors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
              placeholder="Tell us about yourself..."
              disabled={isLoading}
            />
            <p className="text-gray-500 text-xs mt-1">{bio.length} characters</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Completing Profile...
              </div>
            ) : (
              'Complete Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Beginning;


