// src/pages/TollStationPasses.tsx
import React, { useState } from 'react';
import { getTollStationPasses } from '../services/api';

interface Pass {
  // Adjust these fields based on your API response
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
      .then((response) => setPasses(response.data.passList || []))
      .catch((err) => setError(err.message));
  };

  return (
    <div>
      <h1>Toll Station Passes</h1>
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
      {error && <p>Error: {error}</p>}
      {passes.length > 0 && (
        <table border={1}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>Timestamp</th>
              <th>Charge</th>
            </tr>
          </thead>
          <tbody>
            {passes.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.vehicle}</td>
                <td>{p.timestamp}</td>
                <td>{p.charge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TollStationPasses;
