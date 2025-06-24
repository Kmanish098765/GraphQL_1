import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Users from './components/Users';
import Publications from './components/Publications';
import Orders from './components/Orders';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <nav className="nav">
          <h1>GraphQL MSSQL App</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/users" className="nav-link">Users</Link>
            <Link to="/publications" className="nav-link">Publications</Link>
            <Link to="/orders" className="nav-link">Orders</Link>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 