// import React, { useEffect, useState, useCallback, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchFeedPosts } from '../../features/posts/postSlice'
// import StoriesBar from '../StoriesBar'
// import PostCard from '../PostCard'
// import './Feed.css'

// const Feed = () => {
//   const dispatch = useDispatch();
//   const { posts, loading, hasMore } = useSelector((state) => state.posts);

//   const [page, setPage] = useState(1);
//   const scrollContainerRef = useRef(null);

//   // ✅ Fetch posts whenever page changes
//   useEffect(() => {
//     dispatch(fetchFeedPosts(page));
//   }, [dispatch, page]);



//   const handleScroll = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const { scrollTop, scrollHeight, clientHeight } = container;
//     const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;

//     // When user reaches 85% of scroll, fetch next page
//     if (scrollPercentage >= 80 && hasMore && !loading) {
//       console.log('📩 Reached 80% — loading next page...');
//       setPage((prev) => prev + 1);
//     }
//   }, [hasMore, loading]);
  

//   // ✅ Attach scroll listener
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     container.addEventListener('scroll', handleScroll);
//     return () => {
//       container.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll]);



//   return (
//     <div ref={scrollContainerRef}  className="feed-scroll-container" id="feed-scroll-container">
//       <StoriesBar />
//       {posts.map((post) => (
//         <PostCard key={post._id} post={post} />
//       ))}

//       {/* Loader when fetching next batch */}
//       {loading && hasMore && (
//         <div className="loader-dots">Loading more posts...</div>
//       )}

//       {/* Extra space to make scrolling smoother */}
//       <div style={{ height:50 }} />
//     </div>
//   );
// };

// export default Feed;




import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeedPosts } from '../../features/posts/postSlice'
import { fetchUserStories } from '../../features/story/storySlice';
import StoriesBar from '../StoriesBar'
import PostCard from '../PostCard'
import './Feed.css'

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector((state) => state.posts);
  const stories = useSelector((state) => state.story.stories);
  console.log("🚀 ~ file: Feed.jsx:18 ~ Feed ~ stories:", stories);


  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef(null);

  // ✅ Fetch posts whenever page changes
  useEffect(() => {
    dispatch(fetchFeedPosts(page));
  }, [dispatch, page]);

  useEffect(() => {
  dispatch(fetchUserStories());
}, [dispatch]);




  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;

    // When user reaches 85% of scroll, fetch next page
    if (scrollPercentage >= 80 && hasMore && !loading) {
      console.log('📩 Reached 80% — loading next page...');
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);
  

  // ✅ Attach scroll listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);



  return (
    <div ref={scrollContainerRef}  className="feed-scroll-container" id="feed-scroll-container">
<StoriesBar stories={stories} />
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {/* Loader when fetching next batch */}
      {loading && hasMore && (
        <div className="loader-dots">Loading more posts...</div>
      )}

      {/* Extra space to make scrolling smoother */}
      <div style={{ height:50 }} />
    </div>
  );
};

export default Feed;
