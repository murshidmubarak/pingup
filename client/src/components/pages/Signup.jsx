// // Signup.jsx
// import React, { useState } from 'react';
// import './Signup.css';
// import api from '../../api/axios';
// import { useNavigate } from 'react-router-dom'; // Add this import
// import { useDispatch } from 'react-redux';
// import { setAuth } from '../../features/auth/authSlice';
// import { setAuthData } from '../../utils/auth';


// const Signup = () => {
//     const navigate = useNavigate(); // Add this line
//       const dispatch = useDispatch();


//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });


//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // -------- Validation Functions --------
//   const validateUsername = (username) => {
//     if (!username) return 'Username is required';
//     if (username.length < 3) return 'Username must be at least 3 characters';
//     if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
//     return '';
//   };

//   const validateEmail = (email) => {
//     if (!email) return 'Email is required';
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
//     return '';
//   };

//   const validatePassword = (password) => {
//     if (!password) return 'Password is required';
//     // if (password.length < 8) return 'Password must be at least 8 characters';
//     // if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
//     // if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
//     // if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
//     return '';
//   };

//   const validateConfirmPassword = (confirmPassword) => {
//     if (!confirmPassword) return 'Please confirm your password';
//     if (confirmPassword !== formData.password) return 'Passwords do not match';
//     return '';
//   };

//   // -------- Event Handlers --------
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     if (touched[name]) {
//       let error = '';
//       switch (name) {
//         case 'username': error = validateUsername(value); break;
//         case 'email': error = validateEmail(value); break;
//         case 'password': error = validatePassword(value); break;
//         case 'confirmPassword': error = validateConfirmPassword(value); break;
//         default: break;
//       }
//       setErrors(prev => ({ ...prev, [name]: error }));
//     }
//   };

//   const handleBlur = (e) => {
//     const { name, value } = e.target;
//     setTouched(prev => ({ ...prev, [name]: true }));

//     let error = '';
//     switch (name) {
//       case 'username': error = validateUsername(value); break;
//       case 'email': error = validateEmail(value); break;
//       case 'password': error = validatePassword(value); break;
//       case 'confirmPassword': error = validateConfirmPassword(value); break;
//       default: break;
//     }
//     setErrors(prev => ({ ...prev, [name]: error }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate all fields
//     const newErrors = {
//       username: validateUsername(formData.username),
//       email: validateEmail(formData.email),
//       password: validatePassword(formData.password),
//       confirmPassword: validateConfirmPassword(formData.confirmPassword)
//     };
//     setErrors(newErrors);
//     setTouched({ username: true, email: true, password: true, confirmPassword: true });

//     const hasErrors = Object.values(newErrors).some(err => err !== '');
//     if (hasErrors) return;

//     try {
//       setIsSubmitting(true);
//       const res = await api.post('/signup', {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       });

//       // Store JWT token if backend returns it
//       if (res.data.token) {
//         // Update localStorage
//         setAuthData(res.data.token, res.data.user);
        
//         // Update Redux state
//         dispatch(setAuth({ 
//           isAuthenticated: true,
//           user: res.data.user 
//         }));
//       }

//       alert(res.data.message || 'Registration successful!');
//             navigate('/beginning'); // Redirect to home page

      
//       // Reset form
//       setFormData({ username: '', email: '', password: '', confirmPassword: '' });
//       setErrors({});
//       setTouched({});
//     } catch (err) {
//       console.error(err.response?.data);
//       alert(err.response?.data?.message || 'Signup failed');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="signup-card">
//         <div className="logo-section">
//           <h1 className="logo">Pingup</h1>
//           <p className="tagline">Join our amazing community!</p>
//         </div>

//         <form onSubmit={handleSubmit} className="signup-form">
//           {/* Username */}
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.username && touched.username ? 'error' : ''}
//               placeholder="Enter your username"
//             />
//             {errors.username && touched.username && (
//               <span className="error-message">{errors.username}</span>
//             )}
//           </div>

//           {/* Email */}
//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.email && touched.email ? 'error' : ''}
//               placeholder="Enter your email"
//             />
//             {errors.email && touched.email && (
//               <span className="error-message">{errors.email}</span>
//             )}
//           </div>

//           {/* Password */}
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.password && touched.password ? 'error' : ''}
//               placeholder="Create a password"
//             />
//             {errors.password && touched.password && (
//               <span className="error-message">{errors.password}</span>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
//               placeholder="Confirm your password"
//             />
//             {errors.confirmPassword && touched.confirmPassword && (
//               <span className="error-message">{errors.confirmPassword}</span>
//             )}
//           </div>

//           <button type="submit" disabled={isSubmitting} className="signup-button">
//             {isSubmitting ? 'Signing Up...' : 'Sign Up'}
//           </button>

//           <p className="login-link">
//             Already have an account? <a href="/login">Log in</a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;



// Signup.jsx
import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../features/auth/authSlice';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux states
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  // Local states for form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // -------- Validation Functions --------
  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  // -------- Event Handlers --------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      let error = '';
      switch (name) {
        case 'username':
          error = validateUsername(value);
          break;
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value);
          break;
        default:
          break;
      }
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    let error = '';
    switch (name) {
      case 'username':
        error = validateUsername(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // -------- Handle Submit --------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };

    setErrors(newErrors);
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) return;

    // Dispatch the async thunk
    dispatch(
      signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
    );
  };

  // -------- Redirect on successful signup --------
  useEffect(() => {

      console.log('🔐 AUTH STATUS:', { 
    isAuthenticated, 
    isLoading,
    error 
  });

    if (isAuthenticated) {
      alert('Signup successful!');
      navigate('/beginning');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="logo-section">
          <h1 className="logo">Pingup</h1>
          <p className="tagline">Join our amazing community!</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.username && touched.username ? 'error' : ''}
              placeholder="Enter your username"
            />
            {errors.username && touched.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email && touched.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && touched.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password && touched.password ? 'error' : ''}
              placeholder="Create a password"
            />
            {errors.password && touched.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.confirmPassword && touched.confirmPassword ? 'error' : ''
              }
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="signup-button"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {error && <p className="error-message" style={{ marginTop: '10px' }}>{error}</p>}

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;

