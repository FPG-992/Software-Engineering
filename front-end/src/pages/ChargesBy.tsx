// src/pages/ChargesBy.tsx
import React, { useState } from 'react';
import { getChargesBy } from '../services/api';

interface Charge {
  // Adjust these fields based on the API response.
  operatorId: string;
  charge: number;
}

interface ChargesByResponse {
  tollOpID: string;
  requestTimestamp: string;
  periodFrom: string;
  periodTo: string;
  vOpList: Charge[];
}

const ChargesBy: React.FC = () => {
  const [opid, setOpid] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<ChargesByResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getChargesBy(opid, from, to)
      .then((response) => {
        setResult(response.data);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
        setResult(null);
      });
  };

  return (
    <div>
      <h1>Charges By Operator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Operator ID (opid)"
          value={opid}
          onChange={(e) => setOpid(e.target.value)}
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
        <button type="submit">Get Charges</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {result && (
        <div>
          <h3>Charges Result</h3>
          <p>
            <strong>Operator ID:</strong> {result.tollOpID}
          </p>
          <p>
            <strong>Request Time:</strong> {result.requestTimestamp}
          </p>
          <p>
            <strong>Period:</strong> {result.periodFrom} to {result.periodTo}
          </p>
          {result.vOpList && result.vOpList.length > 0 ? (
            <table border={1}>
              <thead>
                <tr>
                  <th>Operator</th>
                  <th>Charge</th>
                </tr>
              </thead>
              <tbody>
                {result.vOpList.map((charge, index) => (
                  <tr key={index}>
                    <td>{charge.operatorId}</td>
                    <td>{charge.charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No charge data found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChargesBy;
