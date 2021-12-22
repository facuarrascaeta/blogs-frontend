import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'


describe('<Blog />', () => {
  let component

  beforeEach(() => {
    const blog = {
      title: 'Title of the blog',
      author: 'Author',
      url: 'URL of the blog',
      likes: 10,
      user: {
        name: 'Test'
      }
    }

    component = render(
      <Blog blog= {blog} />
    )
  })

  test('<Blog /> renders with title and author', () => {
    expect(component.container.querySelector('.blog')).toHaveTextContent(
      'Title of the blog Author'
    )
  })

  test('<Blog /> renders with hidden likes and url', () => {
    const div = component.container.querySelector('.blogDetails')
    expect(div).toHaveStyle('display: none')
  })

  test('url and likes are rendered when view button is clicked', () => {
    const div = component.container.querySelector('.blogDetails')
    const viewButton = component.getByText('view')
    fireEvent.click(viewButton)
    expect(div).not.toHaveStyle('display: none')
  })
})