import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )  
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      console.log(user)
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
  
  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      console.log(returnedBlog)
      setBlogs([...blogs, returnedBlog])
      blogFormRef.current.toggleVisibility()
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

  const deleteBlog = async (id) => {
    const newBlogs = blogs.filter(blog => blog.id !== id)
    setBlogs(newBlogs)
    await blogService.deleteBlog(id)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {message && <Notification message={message}/>}
        <LoginForm
          handleSubmit={handleLogin}
          username={username}
          password={password}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleUsernameChange={({ target }) => setUsername(target.value)}
        />
      </div>
    )
  }

  const blogsOrderedByLikes = blogs.sort((a, b) => a.likes - b.likes)

  return (
    <div>
      <h2>blogs</h2>
      {message && <Notification message={message}/>}
      <p>{user.name} logged in
      <button
        onClick={handleLogout}
      >logout</button></p>

      <Togglable label="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogsOrderedByLikes.map(blog =>
        <Blog key={blog.id} blog={blog} handleDelete={deleteBlog} currentUser={user.username}/>
      )}
    </div>
  )
}

export default App