import React from 'react'
import { Spinner } from 'react-bootstrap'
import AuthService from "./api/auth"

const LogOut = () => {
  // logout user from local browser
  AuthService.logout()
  // redirect to login page
  window.location.href = '/login'
  window.location.reload()
}

const Loading = () => (
  <Spinner animation="border" role="status">
    <span className="visually-hidden"></span>
  </Spinner>
)

export { LogOut, Loading }
