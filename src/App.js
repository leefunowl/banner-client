import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { useIdleTimer } from 'react-idle-timer'

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

import Login from "./features/auth/Login"
import Main from './features/banner/main/Main'

import Home from "./components/Home"
import Register from "./components/Register"

import { Navbar } from './app/Navbar'
import { LogOut } from "./util"
import config from './config'

const App = ({ Time2LogOut }) => {

  const user = JSON.parse(localStorage.getItem("user"))
  
  const handleOnIdle = event => {
    if (user) {
      LogOut()
    }
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: Time2LogOut ? Time2LogOut : 1000 * config.Time2LogOut,
    onIdle: handleOnIdle,
  })

  return (
    <Router>
      {user ? <Navbar /> : null}
        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} >
              {user ? <Home /> : <Redirect to="/login" />}
            </Route>            
            <Route exact path="/login" >
              {user ? <Redirect to="/home" /> : <Login />}
            </Route>
            {/* Page to register new user
              <Route exact path="/register" component={Register} />
            */}
            <Route exact path="/banner" >
              {user ? <Main /> : <Redirect to="/login" />}
            </Route>
          </Switch>
        </div>
    </Router>
  )
}

export default App


// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
