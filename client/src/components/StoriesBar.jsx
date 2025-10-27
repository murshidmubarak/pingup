// import React, { useEffect, useState } from 'react'
// import { dummyStoriesData } from '../assets/assets'
// import moment from 'moment'

// const StoriesBar = () => {
//     const{stories,setStories}=useState([])

//     const fetchUserStories=async()=>{

//         setStories(dummyStoriesData)

//     }

//     useEffect(()=>{

//         fetchUserStories();

//     },[])

//   return (
//     <div>
//     {stories.map((story, index) => (
//       <div key={index}>
//         <img src={story.user.profile_picture} alt="" />
//         <p>{story.content}</p>
//         <p>{story.user.username}</p>
//         <p>{moment(story.createdAt).fromNow()}</p>

//         {story.media_type !== 'text' && (
//           <div>
//            {
//             story.media_type==='image'?
//             <img src={story.media_url} alt=''/>
//             :
//             <video src={story.media_url}/>
//            }
//           </div>
//         )}


//       </div>
//     ))}
//   </div>
//   )
// }

// export default StoriesBar



// import React, { useEffect, useState } from 'react'
// import { dummyStoriesData } from '../assets/assets'
// import { Plus } from 'lucide-react'
// import './StoriesBar.css'

// const StoriesBar = () => {
//   const [stories, setStories] = useState([])
//   const [selectedStory, setSelectedStory] = useState(null)

//   const fetchUserStories = async () => {
//     setStories(dummyStoriesData)
//   }

//   useEffect(() => {
//     fetchUserStories()
//   }, [])

//   const handleStoryClick = (story) => {
//     setSelectedStory(story)
//     // Mark story as viewed
//     setStories(prev => 
//       prev.map(s => s.id === story.id ? { ...s, viewed: true } : s)
//     )
//   }

//   const handleCreateStory = () => {
//     alert('Create your story!')
//   }

//   const closeStoryModal = () => {
//     setSelectedStory(null)
//   }

//   const getTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000)
//     if (seconds < 60) return `${seconds}s`
//     if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
//     if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
//     return `${Math.floor(seconds / 86400)}d`
//   }

//   return (
//     <>
//       <div className="stories-container">
//         <div className="stories-scroll">
//           {/* Create Story Button */}
//           <div className="story-item" onClick={handleCreateStory}>
//             <div className="story-ring create-story">
//               <div className="story-avatar">
//                 <div className="create-icon">
//                   <Plus size={24} strokeWidth={3} />
//                 </div>
//               </div>
//             </div>
//             <span className="story-username">Your Story</span>
//           </div>

//           {/* User Stories */}
//           {stories.map((story) => (
//             <div 
//               key={story.id} 
//               className="story-item"
//               onClick={() => handleStoryClick(story)}
//             >
//               <div className={`story-ring ${story.viewed ? 'viewed' : 'unviewed'}`}>
//                 <div className="story-avatar">
//                   <img 
//                     src={story.user.profile_picture} 
//                     alt={story.user.username}
//                   />
//                 </div>
//               </div>
//               <span className="story-username">{story.user.username}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Story Modal */}
//       {selectedStory && (
//         <div className="story-modal" onClick={closeStoryModal}>
//           <div className="story-modal-content" onClick={(e) => e.stopPropagation()}>
//             <button className="close-btn" onClick={closeStoryModal}>×</button>
            
//             <div className="story-header">
//               <img 
//                 src={selectedStory.user.profile_picture} 
//                 alt={selectedStory.user.username}
//                 className="story-header-avatar"
//               />
//               <div className="story-header-info">
//                 <span className="story-header-username">{selectedStory.user.username}</span>
//                 <span className="story-header-time">{getTimeAgo(selectedStory.createdAt)}</span>
//               </div>
//             </div>

//             <div className="story-content">
//               {selectedStory.media_type === 'image' ? (
//                 <img src={selectedStory.media_url} alt="Story" />
//               ) : selectedStory.media_type === 'video' ? (
//                 <video src={selectedStory.media_url} controls autoPlay />
//               ) : (
//                 <div className="story-text-content">
//                   <p>{selectedStory.content}</p>
//                 </div>
//               )}
//             </div>

//             {selectedStory.content && selectedStory.media_type !== 'text' && (
//               <div className="story-caption">
//                 <p>{selectedStory.content}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default StoriesBar




// import React, { useEffect, useState } from 'react'
// import { dummyStoriesData } from '../assets/assets'
// import moment from 'moment'
// import { Plus } from 'lucide-react'
// import './StoriesBar.css'

// const StoriesBar = () => {
//   const [stories, setStories] = useState([])
//   const [selectedStory, setSelectedStory] = useState(null)

//   const fetchUserStories = async () => {
//     setStories(dummyStoriesData)
//   }

//   useEffect(() => {
//     fetchUserStories()
//   }, [])


//   return (
//     <>
//       {/* ===== Stories Bar ===== */}
//       <div className="stories-container">
//         <div className="stories-scroll">

//           {/* ✅ Create Your Story Button */}
//           <div className="story-item">
//             <div className="story-ring create-story">
//               <div className="story-avatar">
//                 <div className="create-icon">
//                   <Plus size={24} strokeWidth={3} />
//                 </div>
//               </div>
//             </div>
//             <span className="story-username">Your Story</span>
//           </div>

//           {/* ✅ Other User Stories */}
//           {stories.map((story, index) => (
//             <div
//               key={index}
//               className="story-item"
//               onClick={() => setSelectedStory(story)}
//             >
//               <div className="story-ring">
//                 <div className="story-avatar">
//                   <img
//                     src={story.user.profile_picture}
//                     alt={story.user.username}
//                   />
//                 </div>
//               </div>
//               <span className="story-username">{story.user.username}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ===== Story Modal ===== */}
//       {selectedStory && (
//         <div className="story-modal" onClick={() => setSelectedStory(null)}>
//           <div
//             className="story-modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               className="close-btn"
//               onClick={() => setSelectedStory(null)}
//             >
//               ×
//             </button>

//             <div className="story-header">
//               <img
//                 src={selectedStory.user.profile_picture}
//                 alt={selectedStory.user.username}
//                 className="story-header-avatar"
//               />
//               <div className="story-header-info">
//                 <span className="story-header-username">
//                   {selectedStory.user.username}
//                 </span>
//                 <span className="story-header-time">
//                   {moment(selectedStory.createdAt).fromNow()}
//                 </span>
//               </div>
//             </div>

//             <div className="story-content">
//               {selectedStory.media_type === 'image' ? (
//                 <img src={selectedStory.media_url} alt="Story" />
//               ) : selectedStory.media_type === 'video' ? (
//                 <video src={selectedStory.media_url} controls autoPlay />
//               ) : (
//                 <div className="story-text-content">
//                   <p>{selectedStory.content}</p>
//                 </div>
//               )}
//             </div>

//             {selectedStory.content &&
//               selectedStory.media_type !== 'text' && (
//                 <div className="story-caption">
//                   <p>{selectedStory.content}</p>
//                 </div>
//               )}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default StoriesBar

import React, { useEffect, useState, useRef } from 'react'
import { dummyStoriesData } from '../assets/assets'
import moment from 'moment'
import { Plus } from 'lucide-react'
import './StoriesBar.css'

const StoriesBar = () => {
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)

  const videoRef = useRef(null)
  const timerRef = useRef(null)

  // Fetch stories
  const fetchUserStories = async () => {
    setStories(dummyStoriesData)
  }

  useEffect(() => {
    fetchUserStories()
  }, [])


// 🟢 Progress Bar Logic
useEffect(() => {
  if (!selectedStory || isPaused) return

  let interval
  let duration = 5000 // default 5 seconds for image/text

  if (selectedStory.media_type === 'video' && videoRef.current) {
    const vid = videoRef.current
    duration = vid.duration ? vid.duration * 1000 : 5000
  }

  // Calculate how much time has already elapsed based on current progress
  const alreadyElapsed = (progress / 100) * duration
  const startTime = Date.now() - alreadyElapsed

  interval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const percent = Math.min((elapsed / duration) * 100, 100)
    setProgress(percent)

    if (percent >= 100) {
      clearInterval(interval)
      closeModal()
    }
  }, 100)

  return () => clearInterval(interval)
}, [selectedStory, isPaused])






  // Handle content click (pause/resume)
  const handleContentClick = (e) => {
    e.stopPropagation()

    if (selectedStory.media_type === 'video' && videoRef.current) {
      if (isPaused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }

    setIsPaused(!isPaused)
  }

  // Close story and reset states
  const closeModal = () => {
    setSelectedStory(null)
    setIsPaused(false)
    setProgress(0)
  }

  return (
    <>
      {/* ===== Stories Bar ===== */}
      <div className="stories-container">
        <div className="stories-scroll">
          {/* ✅ Create Your Story */}
          <div className="story-item">
            <div className="story-ring create-story">
              <div className="story-avatar">
                <div className="create-icon">
                  <Plus size={24} strokeWidth={3} />
                </div>
              </div>
            </div>
            <span className="story-username">Your Story</span>
          </div>

          {/* ✅ User Stories */}
          {stories.map((story, index) => (
            <div
              key={index}
              className="story-item"
              onClick={() => {
                setSelectedStory(story)
                setIsPaused(false)
                setProgress(0)
              }}
            >
              <div className="story-ring">
                <div className="story-avatar">
                  <img
                    src={story.user.profile_picture}
                    alt={story.user.username}
                  />
                </div>
              </div>
              <span className="story-username">{story.user.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Story Modal ===== */}
      {selectedStory && (
        <div className="story-modal" onClick={closeModal}>
          <div className="story-modal-content" onClick={handleContentClick}>
            {/* ✖ Close Button */}
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation()
                closeModal()
              }}
            >
              ×
            </button>

            {/* 🔵 Progress Bar */}
            <div className="story-progress-bar">
              <div
                className="story-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* 🧩 Header */}
            <div className="story-header">
              <img
                src={selectedStory.user.profile_picture}
                alt={selectedStory.user.username}
                className="story-header-avatar"
              />
              <div className="story-header-info">
                <span className="story-header-username">
                  {selectedStory.user.username}
                </span>
                <span className="story-header-time">
                  {moment(selectedStory.createdAt).fromNow()}
                </span>
              </div>
            </div>

            {/* Story Content */}
            <div className="story-content">
              {selectedStory.media_type === 'image' ? (
                <img src={selectedStory.media_url} alt="Story" />
              ) : selectedStory.media_type === 'video' ? (
                <video ref={videoRef} src={selectedStory.media_url} controls autoPlay />
              ) : (
                <div className="story-text-content">
                  <p>{selectedStory.content}</p>
                </div>
              )}
            </div>

            {/* 📝 Caption */}
            {selectedStory.content && selectedStory.media_type !== 'text' && (
              <div className="story-caption">
                <p>{selectedStory.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default StoriesBar
