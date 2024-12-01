import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Homepage from './pages/home/home';
import Nav from './components/nav';
import Admin from './pages/admin/admin';
import Dashboard from './pages/admin/dashboard';

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
        <Route path='/admin' element={
          <>
            <Nav />
            <Admin />
          </>
          }/>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;