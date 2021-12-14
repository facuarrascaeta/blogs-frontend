import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: ''})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async e => {
    e.preventDefault()
    try {
      const credentials = {
        username, password
      }
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }
  
  const handleCreateBlog = async (e) => {
    e.preventDefault()
    const returnedBlog = await blogService.createBlog(newBlog)
    setBlogs([...blogs, returnedBlog])
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in
      <button
        onClick={handleLogout}
      >logout</button></p>

      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlog.title}
            onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={newBlog.author}
            onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={newBlog.url}
            onChange={(e) => setNewBlog({...newBlog, url: e.target.value})}
          />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App