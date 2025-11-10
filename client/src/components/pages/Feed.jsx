// import React, { useEffect, useState } from 'react'
// import { dummyPostsData } from '../../assets/assets'
// import Loading from '../Loading'
// import StoriesBar from '../StoriesBar'
// import PostCard from '../PostCard'

// const Feed = () => {
//   const [userData, setUserData] = useState([])   // ✅ fixed destructuring + name
//   const [loading, setLoading] = useState(true)   // ✅ loading state

//   const fetchUserData = async () => {
//     setUserData(dummyPostsData)
//     setLoading(false)  // ✅ make loading false after setting data
//   }

//   useEffect(() => {
//     fetchUserData()
//   }, [])

//   return !loading ? (   // ✅ check the state, not the component
//     <div>
//       <StoriesBar />
//       {userData.map((post)=>(
//           <PostCard key={post._id} post={post}/>
//       ))}
//     </div>
//   ) : (
//     <Loading />
//   )
// }

// export default Feed



import React, { useEffect, useState } from 'react'
import Loading from '../Loading'
import StoriesBar from '../StoriesBar'
import PostCard from '../PostCard'
import { fetchFeedPosts } from '../../features/posts/postSlice'
import { useDispatch,useSelector } from 'react-redux'

const Feed = () => {
  const dispatch=useDispatch();
  const [userData, setUserData] = useState([])   // ✅ fixed destructuring + name
  const {posts,loading}= useSelector((state)=>state.posts)




  useEffect(() => {

    dispatch(fetchFeedPosts())

  },[dispatch])

  return !loading ? (   // ✅ check the state, not the component
    <div>
      <StoriesBar />
    {posts.map((post) => (
      <PostCard key={post._id} post={post} />
    ))}
    </div>
  ) : (
    <Loading />
  )
}

export default Feed