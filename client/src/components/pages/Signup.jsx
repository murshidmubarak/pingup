
import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../features/auth/authSlice';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  // Local states for form
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // -------- Validation Functions --------
  const validateFullName = (full_name) => {
    if (!full_name) return 'Full name is required';
    if (full_name.length < 3) return 'Full name must be at least 3 characters';
    if (!/^[a-zA-Z\s]+$/.test(full_name))
      return 'Full name can only contain letters and spaces';
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
        case 'full_name':
          error = validateFullName(value);
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
      case 'full_name':
        error = validateFullName(value);
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
      full_name: validateFullName(formData.full_name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword)
    };

    setErrors(newErrors);
    setTouched({
      full_name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    const hasErrors = Object.values(newErrors).some((err) => err !== '');
    if (hasErrors) return;

    // Dispatch async thunk
    dispatch(
      signupUser({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      })
    );
  };

  useEffect(() => {
    console.log('🔐 AUTH STATUS:', { isAuthenticated, isLoading, error });
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
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.full_name && touched.full_name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.full_name && touched.full_name && (
              <span className="error-message">{errors.full_name}</span>
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

          <button type="submit" disabled={isLoading} className="signup-button">
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>

          {error && <p className="error-message">{error}</p>}

          <p className="login-link">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;


