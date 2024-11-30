import React from 'react'
import logo from '../logo1.png'
import { Link } from 'react-router-dom'
import './nav.css'

const nav = () => {
  return (
    <div className='navbar'>
      <img className='navbar_logo' src={logo} alt='Mahirs Astronomy Logo'/>
      <div className='navbar_links'>
        <Link className='navbar_home_link' to="/homepage">Home</Link>
        <Link className='navbar_admin_link' to="/admin">Admin Panel</Link>
      </div>
    </div>
  )
}

export default nav