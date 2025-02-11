import React, { useState } from 'react';
import { getTollStationPasses } from '../services/api';

interface Pass {
  passIndex: number;
  passID: string;
  timestamp: string;
  tagID: string;
  tagProvider: string;
  passType: string;
  passCharge: string;
}

interface StationPassesResponse {
  stationID: string;
  stationOperator: string;
  requestTimestamp: string;
  periodFrom: string;
  periodTo: string;
  nPasses: number;
  passList: Pass[];
}

const TollStationPasses: React.FC = () => {
  const [station, setStation] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [response, setResponse] = useState<StationPassesResponse | null>(null);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getTollStationPasses(station, from, to)
      .then((response) => {
        setResponse(response.data);
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
          {response && (
            <div className="station-info">
              <p><strong>Station ID:</strong> {response.stationID}</p>
              <p><strong>Operator:</strong> {response.stationOperator}</p>
              <p><strong>Period:</strong> {response.periodFrom} to {response.periodTo}</p>
              <p><strong>Total Passes:</strong> {response.nPasses}</p>
            </div>
          )}
          <table className="data-table">
            <thead>
              <tr>
                <th>Pass ID</th>
                <th>Tag ID</th>
                <th>Provider</th>
                <th>Type</th>
                <th>Timestamp</th>
                <th>Charge (€)</th>
              </tr>
            </thead>
            <tbody>
              {passes.map((pass) => (
                <tr key={pass.passID}>
                  <td>{pass.passID}</td>
                  <td>{pass.tagID}</td>
                  <td>{pass.tagProvider}</td>
                  <td>{pass.passType}</td>
                  <td>{pass.timestamp}</td>
                  <td>€{parseFloat(pass.passCharge).toFixed(2)}</td>
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