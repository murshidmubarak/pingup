import React, { useState } from 'react'
import moment from 'moment'
import './PostCard.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toggleLike } from "../features/posts/postSlice";


const PostCard = ({ post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  // const [isLiked, setIsLiked] = useState(false)
  // const [likeCount, setLikeCount] = useState(post.likes_count || 0)
  // const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
const [likeCount, setLikeCount] = useState(post.likeCount || 0);


  const navigate = useNavigate()
  const dispatch = useDispatch()
const defaultProfilePic =
  `https://ui-avatars.com/api/?background=cccccc&color=ffffff&name=${post.user?.full_name?.[0] || 'U'}`;

  const images = post.media || []
  const hasMultipleImages = images.length > 1

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    dispatch(toggleLike(post._id))

  }

  return (
    <div className="post-card">
      {/* Header */}
      <div onClick={() => navigate('/profile/' + post.user?._id)} className="post-header">
        <img
          src={post.user?.profile_picture || defaultProfilePic}
          alt={post.user?.full_name}
          className="post-profile-pic"
          onError={(e) => (e.target.src = defaultProfilePic)}
        />
        <div className="post-user-info">
          <h4 className="post-username">{post.user?.full_name || 'Anonymous'}</h4>
          <span className="post-time">{moment(post.createdAt).fromNow()}</span>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="post-more-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>
      </div>

      {/* Content */}
      {post.description && (
        <div className="post-content">
          <p>{post.description}</p>
        </div>
      )}

      {/* Image Section */}
      {/* {images.length > 0 && (
        <div className="post-image-container">
          <img
            src={images[currentImageIndex]}
            alt={`Post ${currentImageIndex + 1}`}
            className="post-image"
          /> */}

          {images.length > 0 && (
  <div className="post-image-container">
    {images[currentImageIndex].type === "image" ? (
      <img
        src={images[currentImageIndex].url}
        alt="Post"
        className="post-image"
      />
    ) : (
      <video
        src={images[currentImageIndex].url}
        controls
        className="post-image"
      />
    )}


          {/* Navigation Buttons */}
          {hasMultipleImages && (
            <>
              <button className="post-nav-btn post-nav-prev" onClick={handlePrevImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button className="post-nav-btn post-nav-next" onClick={handleNextImage}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="post-dots-indicator">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`post-dot ${index === currentImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <div className="post-actions-left">
          <button className={`post-action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isLiked ? '#ed4956' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
          <button className="post-action-btn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <button className="post-action-btn">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <button className="post-action-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>

      {/* Like Count */}
      <div className="post-likes">
        <strong>{likeCount.toLocaleString()} likes</strong>
      </div>
    </div>
  )
}

export default PostCard