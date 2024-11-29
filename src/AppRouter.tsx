import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Homepage from './pages/home/home';
import Nav from './components/nav';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/homepage" 
        element={
          <>
            <Nav />
            <Homepage />
          </>
          } />
      </Routes>
    </Router>
  );
}

export default AppRouter;