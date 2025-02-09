// src/components/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav>
      <Link to="/">HealthCheck</Link> |{' '}
      <Link to="/tollstationpasses">Toll Station Passes</Link> |{' '}
      <Link to="/passanalysis">Pass Analysis</Link> |{' '}
      <Link to="/passescost">Pass Cost</Link> |{' '}
      <Link to="/chargesby">Charges By</Link> |{' '}
      <Link to="/admin">Admin</Link>
    </nav>
  );
};

export default NavBar;
