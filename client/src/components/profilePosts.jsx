// import React from "react";
// import "./profilePosts.css";
// import { fetchUserPosts } from "../features/posts/postSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect, useState } from "react";

// const ProfilePosts = ({ activeTab,  user }) => {
     
//     const dispatch = useDispatch();
//     const [userPosts, setUserPosts] = useState([]);
    

//     useEffect(() => {
//       const loadPosts = async () => {
//         if (user?.id) {
//           const fetchedPosts = await dispatch(fetchUserPosts(user.id)).unwrap();
//           setUserPosts(fetchedPosts);
//         }
//       };
//       loadPosts();
//     }, [user]);

//   return (
//     <div className="profile-content">

//       {/* Posts */}
//       {activeTab === "posts" && (
//         <div className="posts-grid">
//           {userPosts?.length > 0 ? (
//             userPosts.map((post) => (
//               <div key={post._id} className="post-item">
//                 {post.image_urls?.length ? (
//                   <img src={post.image_urls[0]} alt="Post" />
//                 ) : (
//                   <div className="post-text-preview">
//                     {post.content.substring(0, 100)}...
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <div className="empty-state">No posts yet</div>
//           )}
//         </div>
//       )}

//       {/* Saved */}
//       {activeTab === "saved" && (
//         <div className="empty-state">No saved posts</div>
//       )}

//       {/* Tagged */}
//       {activeTab === "tagged" && (
//         <div className="empty-state">No tagged posts</div>
//       )}
//     </div>
//   );
// };

// export default ProfilePosts;


// import React, { useEffect } from "react";
// import "./profilePosts.css";
// import { fetchUserPosts } from "../features/posts/postSlice";
// import { useDispatch, useSelector } from "react-redux";

// const ProfilePosts = ({ activeTab, user }) => {

//   const dispatch = useDispatch();
//   const { userPosts, loading } = useSelector((state) => state.posts);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchUserPosts(user.id));
//     }
//   }, [user?.id, dispatch]);

//   return (
//     <div className="profile-content">

//       {/* Posts */}
//       {activeTab === "posts" && (
//         userPosts?.length > 0 ? (
//           <div className="posts-grid">
//             {userPosts.map((post) => (
//               <div key={post._id} className="post-item">
//                 {console.log(post)}
//                 {post.image_urls?.length > 0 && (
//                   <img src={post.image_urls[0]} alt="Post" />
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="empty-state">No posts yet</div>
//         )
//       )}

//       {/* Saved */}
//       {activeTab === "saved" && (
//         <div className="empty-state">No saved posts</div>
//       )}

//       {/* Tagged */}
//       {activeTab === "tagged" && (
//         <div className="empty-state">No tagged posts</div>
//       )}
//     </div>
//   );
// };

// export default ProfilePosts;



import React, { useEffect } from "react";
import "./profilePosts.css";
import { fetchUserPosts } from "../features/posts/postSlice";
import { useDispatch, useSelector } from "react-redux";

const ProfilePosts = ({ activeTab, user }) => {
  const dispatch = useDispatch();
  const { userPosts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserPosts(user.id));
    }
  }, [user?.id, dispatch]);

  return (
    <div className="profile-content">

      {/* Posts */}
      {activeTab === "posts" && (
        loading ? (
          <div className="empty-state">Loading...</div>
        ) : userPosts?.length > 0 ? (
          <div className="posts-grid">
            {/* {userPosts
              .filter((post) => post.media?.length > 0) 
              .map((post) => (
                <div key={post._id} className="post-item">
                  <img src={post.media[0].url} alt="Post" />
                </div>
              ))} */}

              {userPosts
  .filter((post) => post.media?.length > 0)
  .map((post) => {
    const firstMedia = post.media[0];

    const isVideo = firstMedia.type === "video"; // or startsWith("video")

    return (
      <div key={post._id} className="post-item">
        {isVideo ? (
          <video
            src={firstMedia.url}
            className="post-video"
            // controls
          />
        ) : (
          <img
            src={firstMedia.url}
            alt="Post"
            className="post-image"
          />
        )}
      </div>
    );
  })}

          </div>
        ) : (
          <div className="empty-state">No posts yet</div>
        )
      )}

      {/* Saved */}
      {activeTab === "saved" && (
        <div className="empty-state">No saved posts</div>
      )}

      {/* Tagged */}
      {activeTab === "tagged" && (
        <div className="empty-state">No tagged posts</div>
      )}
    </div>
  );
};

export default ProfilePosts;
