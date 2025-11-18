import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Plus } from "lucide-react";
import "./StoriesBar.css";
import { useNavigate } from "react-router-dom";

const StoriesBar = ({ stories }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Swipe refs
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const selectedStory =
    selectedGroup ? selectedGroup.stories[currentIndex] : null;

  // ============================================================
  // FORCE VIDEO INSTANT PLAY 
  // ============================================================
  useEffect(() => {
    if (!selectedStory) return;

    const hasVideo = selectedStory.media.some((m) => m.type === "video");

    if (hasVideo && videoRef.current) {
      const v = videoRef.current;

      v.preload = "auto";

      const tryToPlay = async () => {
        try {
          await v.play();
        } catch {}
      };

      tryToPlay();

      const onMeta = () => tryToPlay();
      const onCan = () => tryToPlay();

      v.addEventListener("loadedmetadata", onMeta);
      v.addEventListener("canplay", onCan);

      return () => {
        v.removeEventListener("loadedmetadata", onMeta);
        v.removeEventListener("canplay", onCan);
      };
    }
  }, [selectedStory]);

  // ============================================================
  // PROGRESS TIMER
  // ============================================================
  useEffect(() => {
    if (!selectedStory || isPaused) return;

    let interval;
    let duration = 5000;

    const hasVideo = selectedStory.media.some((m) => m.type === "video");

    if (hasVideo && videoRef.current?.duration) {
      duration = videoRef.current.duration * 1000;
    }

    const elapsed = (progress / 100) * duration;
    const startTime = Date.now() - elapsed;

    interval = setInterval(() => {
      if (isPaused) return;

      const now = Date.now();
      const pct = Math.min(((now - startTime) / duration) * 100, 100);

      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        goNext();
      }
    }, 60);

    return () => clearInterval(interval);
  }, [selectedStory, isPaused]);

  // ============================================================
  // NEXT
  // ============================================================
  const goNext = () => {
    if (!selectedGroup) return;

    const groups = stories;
    const groupIndex = groups.findIndex(
      (g) => g.user._id === selectedGroup.user._id
    );

    if (currentIndex + 1 < selectedGroup.stories.length) {
      setCurrentIndex((c) => c + 1);
      setProgress(0);
      return;
    }

    if (groupIndex + 1 < groups.length) {
      setSelectedGroup(groups[groupIndex + 1]);
      setCurrentIndex(0);
      setProgress(0);
      return;
    }

    closeModal();
  };

  // ============================================================
  // PREV
  // ============================================================
  const goPrev = () => {
    if (!selectedGroup) return;

    const groups = stories;
    const groupIndex = groups.findIndex(
      (g) => g.user._id === selectedGroup.user._id
    );

    if (currentIndex > 0) {
      setCurrentIndex((c) => c - 1);
      setProgress(0);
      return;
    }

    if (groupIndex > 0) {
      const prev = groups[groupIndex - 1];
      setSelectedGroup(prev);
      setCurrentIndex(prev.stories.length - 1);
      setProgress(0);
      return;
    }

    closeModal();
  };

  // ============================================================
  // CLOSE
  // ============================================================
  const closeModal = () => {
    setSelectedGroup(null);
    setCurrentIndex(0);
    setIsPaused(false);
    setProgress(0);
  };

  // ============================================================
  // HOLD TO PAUSE
  // ============================================================
  const handleHoldStart = () => {
    setIsPaused(true);
    videoRef.current?.pause();
  };
  const handleHoldEnd = () => {
    setIsPaused(false);
    videoRef.current?.play();
  };

  // ============================================================
  // SWIPE
  // ============================================================
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;

    if (Math.abs(distance) < 50) return;

    if (distance > 50) goNext();
    else goPrev();
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <>
      {/* STORY STRIP */}
      <div className="stories-container">
        <div className="stories-scroll">
          {/* Own Story */}
          <div className="story-item">
            <div className="story-ring your-story-ring">
              <div className="story-avatar your-story-avatar">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Your Story"
                />
                <button
                  className="your-story-plus-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/storyModal");
                  }}
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
            <span className="story-username">Your Story</span>
          </div>

          {/* Users */}
          {stories.map((group, i) => (
            <div
              key={i}
              className="story-item"
              onClick={() => {
                setSelectedGroup(group);
                setCurrentIndex(0);
                setProgress(0);
              }}
            >
              <div className="story-ring">
                <div className="story-avatar">
                  <img src={group.user.profile_picture} alt="" />
                </div>
              </div>
              <span className="story-username">{group.user.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedStory && (
        <div className="story-modal" onClick={closeModal}>
          <div
            className="story-modal-content"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onMouseLeave={handleHoldEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={(e) => {
              handleHoldEnd();
              handleTouchEnd(e);
            }}
          >
            {/* Close */}
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>

            {/* NAV */}
            <button className="nav-btn left" onClick={goPrev}>
              ‹
            </button>
            <button className="nav-btn right" onClick={goNext}>
              ›
            </button>

            {/* Progress */}
            <div className="progress-wrapper">
              {selectedGroup.stories.map((s, i) => (
                <div key={i} className="progress-segment">
                  <div
                    className="progress-fill"
                    style={{
                      width:
                        i < currentIndex
                          ? "100%"
                          : i === currentIndex
                          ? progress + "%"
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="story-header">
              <img
                src={selectedGroup.user.profile_picture}
                alt=""
                className="story-header-avatar"
              />
              <div className="story-header-info">
                <span className="story-header-username">
                  {selectedGroup.user.username}
                </span>
                <span className="story-header-time">
                  {moment(selectedStory.createdAt).fromNow()}
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="story-content">
              {selectedStory.media.map((m, i) =>
                m.type === "image" ? (
                  <img key={i} src={m.url} alt="" />
                ) : (
                  <video
                    key={i}
                    ref={videoRef}
                    src={m.url}
                    preload="auto"
                    autoPlay
                    playsInline
                  />
                )
              )}
            </div>

            {/* CAPTION */}
            {selectedStory.content && (
              <div className="story-caption">
                <p>{selectedStory.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesBar;
