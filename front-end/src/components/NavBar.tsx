// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav>
      <div className="nav-title">SOFTENG01-2024</div>
      <div className="nav-links">
        <Link to="/">HealthCheck</Link>
        <Link to="/tollstationpasses">Toll Station Passes</Link>
        <Link to="/passanalysis">Pass Analysis</Link>
        <Link to="/passescost">Pass Cost</Link>
        <Link to="/chargesby">Settlements</Link>
        <Link to="/admin">Data Upload</Link>
      </div>
    </nav>
  );
};

export default NavBar;
