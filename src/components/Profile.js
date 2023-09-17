import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../api/auth";

const Profile = () => {

    const [redirect, setRedirect] = useState(null);
    const [userReady, setUserReady] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        const _currentUser = AuthService.getCurrentUser();

        if (!_currentUser) {
            setRedirect("/home");
        } else {
            setCurrentUser(_currentUser);
            setUserReady(true);
        }
        
    }, []);
    
    if (redirect) {
        return <Redirect to={redirect} />
    } else {
        return (
          <div className="container">
          
            {(userReady) ?
            
                <div>
                    <header className="jumbotron">
                      <h3>
                        <strong>{currentUser.username}</strong> Profile
                      </h3>
                    </header>
                    <p>
                      <strong>Token:</strong>{" "}
                      {currentUser.accessToken.substring(0, 20)} ...{" "}
                      {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}
                    </p>
                    <p>
                      <strong>Id:</strong>{" "}
                      {currentUser.id}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {currentUser.email}
                    </p>
                    <strong>Authorities:</strong>
                    <ul>
                      {currentUser.roles &&
                        currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                    </ul>
              </div>
          :
          null
          }
          </div>
        );
    }

};

export default Profile;
