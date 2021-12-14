import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: ''})
  const [message, setMessage] = useState(null)

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
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error(exception)
      const message = {
        text: 'wrong username or password',
        color: 'red'
      }
      setMessage(message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }
  
  const handleCreateBlog = async (e) => {
    e.preventDefault()
    try {
      const returnedBlog = await blogService.createBlog(newBlog)
      setBlogs([...blogs, returnedBlog])
      const message = {
        text: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        color: 'green'
      }
      setMessage(message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      console.log(error)
      const message = {
        text: error.message,
        color: 'red'
      }
      setMessage(message)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {message && <Notification message={message}/>}
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
      {message && <Notification message={message}/>}
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