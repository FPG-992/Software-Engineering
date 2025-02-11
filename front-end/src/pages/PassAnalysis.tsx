import React, { useState } from 'react';
import { getPassAnalysis } from '../services/api';

interface Pass {
  passIndex: number;
  passID: string;
  stationID: string;
  timestamp: string;
  tagID: string;
  passCharge: string;
}

interface AnalysisResponse {
  stationOpID: string;
  tagOpID: string;
  requestTimestamp: string;
  periodFrom: string;
  periodTo: string;
  nPasses: number;
  passList: Pass[];
}

const PassAnalysis: React.FC = () => {
  const [stationOp, setStationOp] = useState('');
  const [tagOp, setTagOp] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getPassAnalysis(stationOp, tagOp, from, to)
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
      <h1 className="page-header">Pass Analysis</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Station Operator (stationop)"
            value={stationOp}
            onChange={(e) => setStationOp(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Tag Operator (tagop)"
            value={tagOp}
            onChange={(e) => setTagOp(e.target.value)}
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
          <button type="submit">Get Analysis</button>
        </form>
        {error && <p className="error-message">Error: {error}</p>}
      </div>
      {result && (
        <div className="card">
          <h2>Analysis Result</h2>
          <p><strong>Station Operator:</strong> {result.stationOpID}</p>
          <p><strong>Tag Operator:</strong> {result.tagOpID}</p>
          <p><strong>Request Time:</strong> {result.requestTimestamp}</p>
          <p><strong>Period:</strong> {result.periodFrom} to {result.periodTo}</p>
          <p><strong>Number of Passes:</strong> {result.nPasses}</p>
          {result.passList && result.passList.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pass ID</th>
                  <th>Station ID</th>
                  <th>Tag ID</th>
                  <th>Timestamp</th>
                  <th>Charge (€)</th>
                </tr>
              </thead>
              <tbody>
                {result.passList.map((pass) => (
                  <tr key={pass.passID}>
                    <td>{pass.passID}</td>
                    <td>{pass.stationID}</td>
                    <td>{pass.tagID}</td>
                    <td>{pass.timestamp}</td>
                    <td>€{parseFloat(pass.passCharge).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No passes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PassAnalysis;