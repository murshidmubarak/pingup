// import React, { useEffect, useState } from 'react'
// import Loading from '../Loading'
// import StoriesBar from '../StoriesBar'
// import PostCard from '../PostCard'
// import { fetchFeedPosts } from '../../features/posts/postSlice'
// import { useDispatch,useSelector } from 'react-redux'

// const Feed = () => {
//   const dispatch=useDispatch();
//   const [userData, setUserData] = useState([])   // ✅ fixed destructuring + name
//   const {posts,loading}= useSelector((state)=>state.posts)




//   useEffect(() => {

//     dispatch(fetchFeedPosts())

//   },[dispatch])

//   return !loading ? (   // ✅ check the state, not the component
//     <div>
//       <StoriesBar />
//     {posts.map((post) => (
//       <PostCard key={post._id} post={post} />
//     ))}
//     </div>
//   ) : (
//     <Loading />
//   )
// }

// export default Feed





// import React, { useEffect, useState, useCallback, useRef } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchFeedPosts } from '../../features/posts/postSlice'
// import StoriesBar from '../StoriesBar'
// import PostCard from '../PostCard'
// import Loading from '../Loading'
// import './Feed.css'

// const Feed = () => {
//   const dispatch = useDispatch();
//   const { posts, loading, hasMore } = useSelector((state) => state.posts);
//   const [page, setPage] = useState(1);

//   // Set up a ref for the scroll container
//   const scrollContainerRef = useRef(null);

//   // Fetch posts when page changes
//   useEffect(() => {
//     console.log('Dispatching page:', page);
//     dispatch(fetchFeedPosts(page));
//   }, [dispatch, page]);

//   // Scroll handler attached to scrollContainerRef
//   const handleScroll = useCallback(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const { scrollTop, scrollHeight, clientHeight } = container;
//     console.log('[SCROLL DEBUG]', { scrollTop, scrollHeight, clientHeight, loading, hasMore, page }); // For debug

//     if (!hasMore || loading) return;
//     // Buffer of 100px to bottom
//     if (scrollTop + clientHeight >= scrollHeight - 100) {
//       setPage(prev => prev + 1);
//     }
//   }, [hasMore, loading, page]);

//   // Attach handler to scroll container element
//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (!container) return;
//     container.addEventListener('scroll', handleScroll);
//     return () => {
//       container.removeEventListener('scroll', handleScroll);
//     };
//   }, [handleScroll]);

//   // Style for our scrollable container: 80vh, scrolls vertically
//   const scrollContainerStyle = {
//     height: '80vh',
//     overflowY: 'auto',
//     border: '1px solid #e2e2e2',
//     background: '#fafbfd',
//     padding: '0 16px'
//   };

//   return (
//     <div
//       ref={scrollContainerRef}
//       style={scrollContainerStyle}
//       id="feed-scroll-container"
//     >
//       <StoriesBar />
//       {posts.map(post => (
//         <PostCard key={post._id} post={post} />
//       ))}
//       {loading && hasMore && <div className="loader-dots">Loading more...</div>}
//       {/* Optional: Prevents "not enough content to scroll" */}
//       <div style={{ height: 200 }} />
//     </div>
//   );
// };

// export default Feed;


import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFeedPosts } from '../../features/posts/postSlice'
import StoriesBar from '../StoriesBar'
import PostCard from '../PostCard'
import './Feed.css'

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading, hasMore } = useSelector((state) => state.posts);

  const [page, setPage] = useState(1);
  const scrollContainerRef = useRef(null);

  // ✅ Fetch posts whenever page changes
  useEffect(() => {
    dispatch(fetchFeedPosts(page));
  }, [dispatch, page]);



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
      <StoriesBar />
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
