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

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1>Health Check</h1>
      <table>
        <tbody>
          <tr>
            <td>Status:</td>
            <td>{data.status}</td>
          </tr>
          <tr>
            <td>DB Connection:</td>
            <td>{data.dbconnection}</td>
          </tr>
          <tr>
            <td># Stations:</td>
            <td>{data.n_stations}</td>
          </tr>
          <tr>
            <td># Tags:</td>
            <td>{data.n_tags}</td>
          </tr>
          <tr>
            <td># Passes:</td>
            <td>{data.n_passes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HealthCheck;
