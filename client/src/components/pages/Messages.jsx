import React, { useState } from 'react'
import './Messages.css'
import { dummyRecentMessagesData } from '../../assets/assets'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const navigate= useNavigate()

  // Filter messages based on search query
  const filteredMessages = dummyRecentMessagesData.filter(message => {
    const userName = message.from_user_id.full_name.toLowerCase()
    const username = message.from_user_id.username.toLowerCase()
    return userName.includes(searchQuery.toLowerCase()) || 
           username.includes(searchQuery.toLowerCase())
  })

  // Format time ago
  const getTimeAgo = (date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInSeconds = Math.floor((now - messageDate) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return `${Math.floor(diffInSeconds / 604800)}w`
  }

  // Truncate message text
  const truncateText = (text, maxLength = 25) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className='messages-container'>
      <div className='messages-header'>
        <h1 className='messages-heading'>Messages</h1>
      </div>

      {/* Search Bar */}
      <div className='messages-search-container'>
        <Search className='search-icon' size={16} />
        <input
          type='text'
          placeholder='Search messages...'
          className='messages-search-input'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Messages List */}
      <div className='messages-list'>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message) => (
            <div onClick={() => navigate(`/messages/${message.from_user_id._id}`)} key={message._id} className='message-item'>
              <div className='message-avatar-container'>
                <img
                  src={message.from_user_id.profile_picture}
                  alt={message.from_user_id.full_name}
                  className='message-avatar'
                />
                {!message.seen && <div className='unseen-badge'></div>}
              </div>

              <div className='message-content'>
                <div className='message-header-row'>
                  <span className='message-username'>
                    {message.from_user_id.full_name}
                  </span>
                  <span className='message-time'>
                    {getTimeAgo(message.createdAt)}
                  </span>
                </div>
                <div className='message-text-row'>
                  <span className={`message-preview ${!message.seen ? 'unseen-text' : ''}`}>
                    {message.message_type === 'image' ? '📷 Photo' : truncateText(message.text)}
                  </span>
                  {!message.seen && <div className='unseen-dot'></div>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='no-messages'>
            <p>No messages found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages