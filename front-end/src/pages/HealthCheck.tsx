// src/pages/HealthCheck.tsx
import React, { useEffect, useState } from 'react';
import { getHealthCheck } from '../services/api';

interface HealthData {
  status: string;
  dbconnection: string;
  n_stations: number;
  n_tags: number;
  n_passes: number;
}

const HealthCheck: React.FC = () => {
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getHealthCheck()
      .then((response) => setData(response.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="container">
      <h1 className="page-header">System Health Check</h1>
      {error && <p className="error-message">{error}</p>}
      {data ? (
        <div className="card">
          <table>
            <tbody>
              <tr>
                <th>Status</th>
                <td>{data.status}</td>
              </tr>
              <tr>
                <th>DB Connection</th>
                <td>{data.dbconnection}</td>
              </tr>
              <tr>
                <th># Stations</th>
                <td>{data.n_stations}</td>
              </tr>
              <tr>
                <th># Tags</th>
                <td>{data.n_tags}</td>
              </tr>
              <tr>
                <th># Passes</th>
                <td>{data.n_passes}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HealthCheck;
