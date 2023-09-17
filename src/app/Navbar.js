import React from 'react'
import { Link } from 'react-router-dom'
//------
import AuthService from "../api/auth"
//------
export const Navbar = () => {
 
  const user = JSON.parse(localStorage.getItem("user"))
  
  const logOut = () => {
    AuthService.logout()
  }

  return (
    <nav className="navbar navbar-expand">

      <div className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to={"/home"} className="nav-link">
            Home
          </Link>
        </li>

        {user && (
          <>
            <li className="nav-item">
              <Link to={"/lsd"} className="nav-link">
                LSD
              </Link>
            </li>
          </>
        )}

        <li className="nav-item">
          <Link to={"/class_list"} className="nav-link">
            Class List
          </Link>{/* */}
        </li>
        
      </div>
      
      {user && (
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <a href="/login" className="nav-link" onClick={logOut}>
              Log Out
            </a>
          </li>
        </div>
      )}
    </nav>//
  )
}
