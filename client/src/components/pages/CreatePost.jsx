// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import './CreatePost.css';
// import { X } from 'lucide-react'; // ✅ only import X — "Images" is your state, not an icon

// const CreatePost = () => {
//   const [content, setContent] = useState('');
//   const [posts, setPosts] = useState([]);
//   const [images, setImages] = useState([]); // ✅ define images state
//   const [loading, setLoading] = useState(false);
//   const dispatch = useDispatch();

//   const currentUser = useSelector((state) => state.user.value);
//   const [user, setUser] = useState('');

//   useEffect(() => {
//     const initializeProfile = async () => {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       if (token && !currentUser) {
//         const fetchedUser = await dispatch(fetchUser(token)).unwrap();
//         setUser(fetchedUser);
//       } else if (currentUser) {
//         setUser(currentUser);
//       }
//       setLoading(false);
//     };
//     initializeProfile();
//   }, [currentUser, dispatch]);

//   return (
//     <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white'>
//       <div className='max-w-6xl mx-auto p-6'>
//         {/* title */}
//         <div className='mb-8'>
//           <h1 className='text-2xl font-semibold'>Create Post</h1>
//           <p className='text-slate-600'>Write a description</p>
//         </div>

//         {/* form */}
//         <div className='max-w-xl bg-white p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4'>
//           {/* header */}
//           <div className='flex items-center gap-3'>
//             <img
//               src={user?.profile_picture}
//               className='w-12 h-12 rounded-full shadow'
//               alt=''
//             />
//             <div>
//               <h2 className='font-semibold'>{user?.full_name}</h2>
//               <p className='text-sm text-gray-500'>@{user?.username}</p>
//             </div>
//           </div>

//           {/* text area */}
//           <textarea
//             className='w-full resize-none max-h-20 mt-4 text-sm outline-none placeholder-gray-400'
//             placeholder='Write your description'
//             onChange={(e) => setContent(e.target.value)}
//             value={content}
//           />

//           {/* files */}
//           {images.length > 0 && (
//             <div className='flex flex-wrap gap-3 mt-4'>
//               {images.map((image, i) => (
//                 <div key={i} className='relative group'>
//                   <img
//                     src={URL.createObjectURL(image)}
//                     className='h-20 w-20 rounded-md object-cover'
//                     alt=''
//                   />
//                   <div
//                     onClick={() =>
//                       setImages(images.filter((_, index) => index !== i))
//                     }
//                     className='absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 cursor-pointer'
//                   >
//                     <X className='w-4 h-4 text-white' />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       {/*bottom bar*/}

//       <div className='flex items-center justify-betwween pt-3 border-t border-gray-300'>

//         <label htmlFor="images" className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition cursor pointer'>
//           <Image className='size-6'/>
//         </label>
//         <input type="file" id='images' accept='image/*' hidden multiple onChange={(e)=>setImages([...images,...e.target.files])}/>
//         <button className='text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer'>
//           post
//         </button>

//       </div>
        
//       </div>
//     </div>
//   );
// };

// export default CreatePost;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CreatePost.css';
import { X, Image as ImageIcon } from 'lucide-react'; // ✅ Import Image icon properly
import { fetchUser } from '../../features/user/userSlice'; // ✅ ensure your fetchUser is imported

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.value);
  const [user, setUser] = useState('');

  useEffect(() => {
    const initializeProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token && !currentUser) {
        const fetchedUser = await dispatch(fetchUser(token)).unwrap();
        setUser(fetchedUser);
      } else if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    initializeProfile();
  }, [currentUser, dispatch]);

  return (
    <div className="createpost-page">
      <div className="createpost-container">
        {/* Title */}
        <div className="createpost-header">
          <h1>Create Post</h1>
          <p>Write a description</p>
        </div>

        {/* Form */}
        <div className="createpost-form">
          {/* Header */}
          <div className="createpost-user">
            <img
              src={user?.profile_picture || 'https://via.placeholder.com/100'}
              className="user-avatar"
              alt="User Avatar"
            />
            <div>
              <h2>{user?.full_name || 'Loading...'}</h2>
              <p>@{user?.username || 'username'}</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            className="post-textarea"
            placeholder="Write your description..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />

          {/* Images Preview */}
          {images.length > 0 && (
            <div className="images-preview">
              {Array.from(images).map((image, i) => (
                <div key={i} className="image-item">
                  <img src={URL.createObjectURL(image)} alt="preview" />
                  <div
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="remove-image"
                  >
                    <X className="remove-icon" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Bar */}
          <div className="createpost-footer">
            <label htmlFor="images" className="upload-label">
              <ImageIcon className="icon" />
              <span>Add Images</span>
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              hidden
              onChange={(e) =>
                setImages([...images, ...Array.from(e.target.files)])
              }
            />
            <button className="post-button">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

