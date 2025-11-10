import React, { useState,useEffect } from 'react';
import { Search, UserPlus, Users } from 'lucide-react';
import './Discover.css';
import api from '../../api/axios';



const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
    const [users, setUsers] = useState([]);



  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users when debounced query changes
useEffect(() => {
  const fetchUsers = async () => {
    if (!debouncedQuery.trim()) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.get(`/search`, {
        params: { q: debouncedQuery },
          headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

      });

      setUsers(response.data || []);

      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setIsLoading(false);
    }
  };

  fetchUsers();
}, [debouncedQuery]);



  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1><Users size={22}/> Discover People</h1>

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="users-list">
    {users.length === 0 && !isLoading ? (
    <div className="no-users">
      <Users size={48} />
      <p>No users found</p>
    </div>
  ) : (
    users.map((user) => (
      <div key={user._id} className="user-card">
        <div className="user-info">
          <img src={user.profile_picture} className="avatar" alt="profile" />

          <div>
            <p className="name">{user.full_name}</p>
            <p className="username">@{user.username}</p>
            <p className="followers">{user.followers.length} followers</p>
          </div>
        </div>

        {/* 
        <button
          onClick={() => handleFollow(user._id)}
          className={user.isFollowing ? 'following-btn' : 'follow-btn'}
        >
          {user.isFollowing ? 'Following' : <><UserPlus size={14}/> Follow</>}
        </button> 
        */}
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default Discover;
