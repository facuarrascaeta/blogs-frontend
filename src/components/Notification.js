import React from 'react'

const Notification = ({ message }) => {
  return (
    <div style={{
      background: '#aaa',
      border: `1px solid ${message.color}`,
      color: message.color,
      padding: 10,
      marginBottom: 10
    }}>
      {message.text}
    </div>
  )
}

export default Notification
