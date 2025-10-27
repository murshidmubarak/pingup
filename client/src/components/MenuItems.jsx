import React from 'react';
import { NavLink } from 'react-router-dom';
import { menuItemsData } from '../assets/assets';
import './Sidebar.css';

const MenuItems = ({ isMobile }) => {
  if (isMobile) {
    return (
      <div className="menu-items mobile-menu-items">
        {menuItemsData.map(({ to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `menu-link mobile-menu-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="menu-icon" />
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <div className="menu-items desktop-menu-items">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `menu-link ${isActive ? 'active' : ''}`
          }
        >
          <Icon className="menu-icon" />
          <span className="menu-label">{label}</span>
        </NavLink>
      ))}
      
      
    </div>
    
  );
};

export default MenuItems;



// import React from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { menuItemsData } from '../assets/assets';
// import { LogOut } from 'lucide-react';
// import './Sidebar.css';

// const MenuItems = ({ isMobile }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Remove JWT token from localStorage
//     localStorage.removeItem('jwtToken');
//     localStorage.removeItem('authToken'); // Remove other possible token names
//     localStorage.removeItem('token');
    
//     // Remove any user data
//     localStorage.removeItem('userData');
//     localStorage.removeItem('currentUser');
    
//     // Clear session storage as well if used
//     sessionStorage.clear();
    
//     // Navigate to login page
//     navigate('/sign');
    
//     // Optional: Reload the page to reset application state
//     window.location.reload();
//   };

//   if (isMobile) {
//     return (
//       <div className="menu-items mobile-menu-items">
//         {menuItemsData.map(({ to, Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             end={to === '/'}
//             className={({ isActive }) =>
//               `menu-link mobile-menu-link ${isActive ? 'active' : ''}`
//             }
//           >
//             <Icon className="menu-icon" />
//           </NavLink>
//         ))}
//         {/* Logout button for mobile */}
//         <button
//           onClick={handleLogout}
//           className="menu-link mobile-menu-link logout-button"
//         >
//           <LogOut className="menu-icon" />
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="menu-items desktop-menu-items">
//       {menuItemsData.map(({ to, label, Icon }) => (
//         <NavLink
//           key={to}
//           to={to}
//           end={to === '/'}
//           className={({ isActive }) =>
//             `menu-link ${isActive ? 'active' : ''}`
//           }
//         >
//           <Icon className="menu-icon" />
//           <span className="menu-label">{label}</span>
//         </NavLink>
//       ))}
      
//       {/* Logout button for desktop */}
//       <button
//         onClick={handleLogout}
//         className="menu-link logout-button"
//       >
//         <LogOut className="menu-icon" />
//         <span className="menu-label">Logout</span>
//       </button>
//     </div>
//   );
// };

// export default MenuItems;
