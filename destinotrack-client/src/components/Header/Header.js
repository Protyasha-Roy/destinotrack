import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='spacedDiv w-3 m-auto'>
        <h2 className='appName'>UniTrack</h2>
        <Link to='/'>Go Back</Link>
    </div>
  )
}
