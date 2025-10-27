import React from 'react'
import './Loading.css'

const Loading = ({ height = '100vh' }) => {
  return (
    <div style={{ height }} className='loading-container'>
      <div className='loading-spinner'>
        
      </div>
    </div>
  )
}

export default Loading
