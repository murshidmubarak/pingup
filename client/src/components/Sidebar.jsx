// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import MenuItems from './MenuItems';
// import { assets } from '../assets/assets';
// import './Sidebar.css';

// const Sidebar = () => {
//   const navigate = useNavigate();

//   return (
//     <div>
//       {/* Desktop Sidebar */}
//       <div className="sidebar desktop-sidebar">
//         <img
//           src={assets.logo}
//           alt="Logo"
//           className="sidebar-logo"
//           onClick={() => navigate('/')}
//         />
//         <hr className="sidebar-divider" />
//         <MenuItems isMobile={false} />
//       </div>

//       {/* Mobile Bottom Bar */}
//       <div className="sidebar mobile-bottom-bar">
//         <MenuItems isMobile={true} />
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import MenuItems from './MenuItems';
// import { assets } from '../assets/assets';
// import { logout } from '../utils/auth';
// import { LogOut } from 'lucide-react';
// import './Sidebar.css';
// import { useDispatch } from 'react-redux';
// import { logout as logoutAction, setAuth } from "./features/auth/authSlice";

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleLogout = () => {
//     // Clear localStorage
//     logout();
//     // Update Redux state
//     dispatch(logoutAction());
//     navigate('/signup')
//   };

//   return (
//     <div>
//       {/* Desktop Sidebar */}
//       <div className="sidebar desktop-sidebar">
//         <img
//           src={assets.logo}
//           alt="Logo"
//           className="sidebar-logo"
//           onClick={() => navigate('/')}
//         />
//         <hr className="sidebar-divider" />
//         <MenuItems isMobile={false} />
        
//         {/* Logout Button for Desktop */}
//         <button 
//           className="logout-btn desktop-logout-btn"
//           onClick={handleLogout}
//         >
//           <LogOut className="logout-icon" size={20} />
//           <span className="logout-text">Logout</span>
//         </button>
//       </div>

//       {/* Mobile Bottom Bar */}
//       <div className="sidebar mobile-bottom-bar">
//         <MenuItems isMobile={true} />
        
//         {/* Logout Button for Mobile */}
//         <button 
//           className="logout-btn mobile-logout-btn"
//           onClick={handleLogout}
//         >
//           <LogOut className="logout-icon" size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;



import React from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import { assets } from '../assets/assets';
import './Sidebar.css';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // ✅ correct way
    navigate('/signup');
  };

  return (
    <div>
      {/* Desktop Sidebar */}
      <div className="sidebar desktop-sidebar">
        <img
          src={assets.logo}
          alt="Logo"
          className="sidebar-logo"
          onClick={() => navigate('/')}
        />
        <hr className="sidebar-divider" />
        <MenuItems isMobile={false} />
        <button className="logout-btn desktop-logout-btn" onClick={handleLogout}>
          <LogOut className="logout-icon" size={20} />
          <span className="logout-text">Logout</span>
        </button>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="sidebar mobile-bottom-bar">
        <MenuItems isMobile={true} />
        <button className="logout-btn desktop-logout-btn" onClick={handleLogout}>
          <LogOut className="logout-icon" size={20} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
