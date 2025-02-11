// src/pages/ChargesBy.tsx
import React, { useState } from 'react';
import { getChargesBy } from '../services/api';

interface Charge {
  visitingOpID: string;  // changed from operatorId
  nPasses: number;       // added
  passesCost: string;    // changed from charge: number
}

interface ChargesByResponse {
  tollOpID: string;
  requestTimestamp: string;
  periodFrom: string;
  periodTo: string;
  vOpList: Charge[];    // This array contains the updated Charge interface
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
    <div className="container">
      <h1 className="page-header">Υπολογισμός Οικονομικών Συμψηφισμών</h1>
      <div className="card">
        <p>
          Εισάγετε τη χρονική περίοδο και τον λειτουργό για τον οποίο θέλετε να υπολογίσετε τις οικονομικές
          οφειλές.
        </p>
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
          <button type="submit">Calculate Settlements</button>
        </form>
        {error && <p className="error-message">Error: {error}</p>}
      </div>
      {result && (
        <div className="card">
          <h2>Settlement Results</h2>
          <p><strong>Operator ID:</strong> {result.tollOpID}</p>
          <p><strong>Request Time:</strong> {result.requestTimestamp}</p>
          <p><strong>Period:</strong> {result.periodFrom} to {result.periodTo}</p>
          {result.vOpList && result.vOpList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Visiting Operator</th>
                  <th>Number of Passes</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {result.vOpList.map((charge, index) => (
                  <tr key={index}>
                    <td>{charge.visitingOpID}</td>
                    <td>{charge.nPasses}</td>
                    <td>€{parseFloat(charge.passesCost).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No settlement data found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChargesBy;
