// src/pages/Admin.tsx
import React, { useState } from 'react';
import { addPasses, resetPasses, resetStations } from '../services/api';

type UploadType = 'addpasses' | 'resetpasses' | 'resetstations';

const Admin: React.FC = () => {
  const [uploadType, setUploadType] = useState<UploadType>('addpasses');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file.');
      return;
    }
    try {
      let response;
      if (uploadType === 'addpasses') {
        response = await addPasses(file);
      } else if (uploadType === 'resetpasses') {
        response = await resetPasses(file);
      } else if (uploadType === 'resetstations') {
        response = await resetStations(file);
      }
      
      // Check if response is defined before using it
      if (!response) {
        setError('No response received from the server.');
        return;
      }

      setResult(JSON.stringify(response.data, null, 2));
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin - CSV Upload</h1>
      <form onSubmit={handleUpload}>
        <label>
          Select Action:
          <select
            value={uploadType}
            onChange={(e) => setUploadType(e.target.value as UploadType)}
          >
            <option value="addpasses">Add Passes</option>
            <option value="resetpasses">Reset Passes</option>
            <option value="resetstations">Reset Stations</option>
          </select>
        </label>
        <br />
        <label>
          Select CSV File:
          <input type="file" accept=".csv" onChange={handleFileChange} required />
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {result && (
        <div>
          <h3>Response:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default Admin;
