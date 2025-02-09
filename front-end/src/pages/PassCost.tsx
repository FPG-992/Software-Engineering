// src/pages/PassCost.tsx
import React, { useState } from 'react';
import { getPassesCost } from '../services/api';

interface PassCostResponse {
  tollOpID: string;
  tagOpID: string;
  requestTimestamp: string;
  periodFrom: string;
  periodTo: string;
  nPasses: number;
  passesCost: number;
}

const PassCost: React.FC = () => {
  const [tollOpID, setTollOpID] = useState('');
  const [tagOpID, setTagOpID] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<PassCostResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getPassesCost(tollOpID, tagOpID, from, to)
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
      <h1 className="page-header">Pass Cost Calculation</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Toll Operator (tollOpID)"
            value={tollOpID}
            onChange={(e) => setTollOpID(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tag Operator (tagOpID)"
            value={tagOpID}
            onChange={(e) => setTagOpID(e.target.value)}
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
          <button type="submit">Calculate Cost</button>
        </form>
        {error && <p className="error-message">Error: {error}</p>}
      </div>
      {result && (
        <div className="card">
          <h2>Pass Cost Result</h2>
          <p><strong>Toll Operator:</strong> {result.tollOpID}</p>
          <p><strong>Tag Operator:</strong> {result.tagOpID}</p>
          <p><strong>Request Time:</strong> {result.requestTimestamp}</p>
          <p><strong>Period:</strong> {result.periodFrom} to {result.periodTo}</p>
          <p><strong>Number of Passes:</strong> {result.nPasses}</p>
          <p><strong>Total Cost:</strong> {result.passesCost}</p>
        </div>
      )}
    </div>
  );
};

export default PassCost;
