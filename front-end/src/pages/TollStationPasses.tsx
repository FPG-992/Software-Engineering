// src/pages/TollStationPasses.tsx
import React, { useState } from 'react';
import { getTollStationPasses } from '../services/api';

interface Pass {
  id: number;
  vehicle: string;
  timestamp: string;
  charge: number;
}

const TollStationPasses: React.FC = () => {
  const [station, setStation] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passes, setPasses] = useState<Pass[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getTollStationPasses(station, from, to)
      .then((response) => {
        setPasses(response.data.passList || []);
        setError('');
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container">
      <h1 className="page-header">Toll Station Passes</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Station ID"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="From (YYYYMMDD)"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="To (YYYYMMDD)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
          <button type="submit">Get Passes</button>
        </form>
        {error && <p className="error-message">Error: {error}</p>}
      </div>
      {passes.length > 0 && (
        <div className="card">
          <h2>Passes List</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehicle</th>
                <th>Timestamp</th>
                <th>Charge</th>
              </tr>
            </thead>
            <tbody>
              {passes.map((pass) => (
                <tr key={pass.id}>
                  <td>{pass.id}</td>
                  <td>{pass.vehicle}</td>
                  <td>{pass.timestamp}</td>
                  <td>{pass.charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TollStationPasses;
