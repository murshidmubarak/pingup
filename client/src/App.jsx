// import React, { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { fetchUser } from "./features/user/userSlice.js";
// import Login from "./components/pages/Login";
// import Layout from "./components/pages/Layout";
// import Feed from "./components/pages/Feed";
// import Messages from "./components/pages/Messages";
// import ChatBox from "./components/pages/ChatBox";
// import Connection from "./components/pages/Connection";
// import Discover from "./components/pages/Discover";
// import Profile from "./components/pages/Profile";
// import CreatePost from "./components/pages/CreatePost";
// import Signup from "./components/pages/Signup";
// import Settings from "./components/pages/Settings";
// import Beginning from "./components/pages/beginning.jsx";

// const App = () => {
//   const token = localStorage.getItem("token");
//   const isAuthenticated = !!token;
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const getUserData = async () => {
//       if (token) {
//         dispatch(fetchUser(token));
//       }
//     };
//     getUserData();
//   }, [dispatch, token]);

//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route
//         path="/login"
//         element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
//       />
//       <Route
//         path="/signup"
//         element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
//       />

//       {/* Protected routes */}
//       <Route
//         path="/"
//         element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
//       >
//         <Route index element={<Feed />} />
//         <Route path="messages" element={<Messages />} />
//         <Route path="messages/:userId" element={<ChatBox />} />
//         <Route path="connections" element={<Connection />} />
//         <Route path="discover" element={<Discover />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="profile/:profileId" element={<Profile />} />
//         <Route path="create-post" element={<CreatePost />} />
//         <Route path="settings" element={<Settings />} />
//         <Route path="beginning" element={<Beginning/>}/>
//         <Route path="*" element={<Navigate to="/" />} />
//       </Route>
//     </Routes>
//   );
// };

// export default App;






// import React, { useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux"; // Add useSelector
// import { fetchUser } from "./features/user/userSlice.js";
// import { setAuth } from "./features/auth/authSlice";
// import { isAuthenticated, getToken, getUserFromToken } from "./utils/auth";
// import Login from "./components/pages/Login";
// import Layout from "./components/pages/Layout";
// import Feed from "./components/pages/Feed";
// import Messages from "./components/pages/Messages";
// import ChatBox from "./components/pages/ChatBox";
// import Connection from "./components/pages/Connection";
// import Discover from "./components/pages/Discover";
// import Profile from "./components/pages/Profile";
// import CreatePost from "./components/pages/CreatePost";
// import Signup from "./components/pages/Signup";
// import Settings from "./components/pages/Settings";
// import Beginning from "./components/pages/beginning.jsx";

// const App = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated: authenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = getToken();
//       const isAuth = isAuthenticated();
//       const user = getUserFromToken();

//       // Set authentication state in Redux
//       dispatch(setAuth({ 
//         isAuthenticated: isAuth,
//         user: user 
//       }));
      
//       if (isAuth && token) {
//         await dispatch(fetchUser(token));
//       }
//     };

//     checkAuth();
//   }, [dispatch]);

//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route
//         path="/login"
//         element={!authenticated ? <Login /> : <Navigate to="/" />}
//       />
//       <Route
//         path="/signup"
//         element={!authenticated ? <Signup /> : <Navigate to="/" />}
//       />

//       {/* Protected routes */}
//       <Route
//         path="/"
//         element={authenticated ? <Layout /> : <Navigate to="/login" />}
//       >
//         <Route index element={<Feed />} />
//         <Route path="messages" element={<Messages />} />
//         <Route path="messages/:userId" element={<ChatBox />} />
//         <Route path="connections" element={<Connection />} />
//         <Route path="discover" element={<Discover />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="profile/:profileId" element={<Profile />} />
//         <Route path="create-post" element={<CreatePost />} />
//         <Route path="settings" element={<Settings />} />
//         <Route path="beginning" element={<Beginning/>}/>
//         <Route path="*" element={<Navigate to="/" />} />
//       </Route>
//     </Routes>
//   );
// };

// export default App;





import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // Add useSelector
import { fetchUser } from "./features/user/userSlice.js";
import { checkAuthStatus } from "./features/auth/authSlice.js";
import { isAuthenticated, getToken, getUserFromToken } from "./utils/auth";
import Login from "./components/pages/Login";
import Layout from "./components/pages/Layout";
import Feed from "./components/pages/Feed";
import Messages from "./components/pages/Messages";
import ChatBox from "./components/pages/ChatBox";
import Connection from "./components/pages/Connection";
import Discover from "./components/pages/Discover";
import Profile from "./components/pages/Profile";
import CreatePost from "./components/pages/CreatePost";
import Signup from "./components/pages/Signup";
import Settings from "./components/pages/Settings";
import Beginning from "./components/pages/beginning.jsx";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isProfileComplete, isLoading,user } = useSelector((state) => state.auth);

  useEffect(() => {
    // const checkAuth = async () => {
    //   // const token = getToken();
    //   // const isAuth = isAuthenticated();
    //   // const user = getUserFromToken();

    //   // Set authentication state in Redux
    //   // dispatch(setAuth({ 
    //   //   isAuthenticated: isAuth,
    //   //   user: user 
    //   // }));
      
    //   // if (isAuth && token) {
    //   //   await dispatch(fetchUser(token));
    //   // }


    // };
    

    // checkAuth();
    dispatch(checkAuthStatus());
     
     
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
       {/* Public routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
      />

       {/* Profile completion route */}
      <Route
        path="/beginning"
        element={
          isAuthenticated && !isProfileComplete ? 
            <Beginning /> : 
            <Navigate to="/" />
        }
      />

      {/* Protected routes */}
         <Route
        path="/"
        element={
          isAuthenticated ? (
            isProfileComplete ? (
              <Layout />
            ) : (
              <Navigate to="/beginning" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<Feed />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<ChatBox />} />
        <Route path="connections" element={<Connection />} />
        <Route path="discover" element={<Discover />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:profileId" element={<Profile />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="settings" element={<Settings />} />
        <Route path="beginning" element={<Beginning/>}/>
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;


