// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.tsx';
import HealthCheck from './pages/HealthCheck';
import TollStationPasses from './pages/TollStationPasses';
import PassAnalysis from './pages/PassAnalysis';
import PassCost from './pages/PassCost';
import ChargesBy from './pages/ChargesBy.tsx';
import Admin from './pages/Admin';

const App: React.FC = () => {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HealthCheck />} />
          <Route path="/tollstationpasses" element={<TollStationPasses />} />
          <Route path="/passanalysis" element={<PassAnalysis />} />
          <Route path="/passescost" element={<PassCost />} />
          <Route path="/chargesby" element={<ChargesBy />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
