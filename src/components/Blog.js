import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({blog, handleDelete, currentUser}) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 6,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = async () => {
    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likes + 1
    }

    await blogService.update(updatedBlog)
    setLikes(likes + 1)
  }

  const deleteButton = () => (
    <button onClick={() => handleDelete(blog.id)}>delete</button>
  )
  

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{visible ? 'hide' : 'view'}</button>
      <div style={{ display: visible ? '' : 'none'}}>
        <div>{blog.url}</div>
        <div>likes: {likes}<button onClick={addLike}>like</button></div>
        <div>{blog.user.name}</div>
        {blog.user.username === currentUser && deleteButton()}
      </div>
    </div>  
  )
}

export default Blog
