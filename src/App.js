import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useContext } from 'react';

import ActionBar from './components/ActionBar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import Explore from './explore/Explore';
import Messages from './messages/Messages';
import Reels from './reels/Reels';
import CreatePost from './createPost/CreatePost';

import { AuthContext } from './context/AuthContext';

import './App.css';
import Profile from './profile/Profile';

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to={'/login'} />;
  };
  const AuthExists = ({ children }) => {
    return currentUser ? <Navigate to={'/'} /> : children;
  };
  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthExists>
              <Login />
            </AuthExists>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthExists>
              <SignIn />
            </AuthExists>
          }
        />
        <Route
          index
          path="/explore"
          element={
            <RequireAuth>
              <ActionBar>
                <Explore />
              </ActionBar>
            </RequireAuth>
          }
        />
        <Route
          index
          path="/"
          element={
            <RequireAuth>
              <ActionBar>
                <Home />
              </ActionBar>
            </RequireAuth>
          }
        />
        <Route
          index
          path="/direct"
          element={
            <RequireAuth>
              <ActionBar>
                <Messages />
              </ActionBar>
            </RequireAuth>
          }
        />
        <Route
          path="/reels"
          element={
            <RequireAuth>
              <ActionBar>
                <Reels />
              </ActionBar>
            </RequireAuth>
          }
        />
        <Route
          path="/create"
          element={
            <RequireAuth>
              <ActionBar>
                <CreatePost />
              </ActionBar>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ActionBar>
                <Profile id={currentUser?.uid} />
              </ActionBar>
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
