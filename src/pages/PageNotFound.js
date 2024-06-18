import React from 'react'
import { Link } from 'react-router-dom'
// import Home from '../pages/Home'
function PageNotFound() {
  return (
    <div>
      <h1>page is not found</h1> 
      <h3> ti=his the like <Link to="/">home page</Link> </h3>
    </div>
  )
}

export default PageNotFound
