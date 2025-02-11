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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadType === 'addpasses' && !file) {
      setError('Please select a file.');
      return;
    }
    try {
      let response;
      if (uploadType === 'addpasses') {
        response = await addPasses(file!);
      } else if (uploadType === 'resetpasses') {
        response = await resetPasses();
      } else if (uploadType === 'resetstations') {
        response = await resetStations();
      }
      
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
    <div className="container">
      <h1 className="page-header">Συλλογή και Αποθήκευση Δεδομένων Διελεύσεων</h1>
      <div className="card">
        <p>
          <strong>Βήμα 1:</strong> Το σύστημα του λειτουργού αποστέλλει τα δεδομένα διελεύσεων μέσω REST API.
        </p>
        <p>
          <strong>Βήμα 2:</strong> Το σύστημα επαληθεύει την εγκυρότητα των δεδομένων.
        </p>
        <p>
          <strong>Βήμα 3:</strong> Τα δεδομένα αποθηκεύονται στη βάση δεδομένων.
        </p>
        <p>
          <strong>Βήμα 4:</strong> Επιστρέφεται επιβεβαίωση στον λειτουργό.
        </p>
        <form onSubmit={handleSubmit}>
          <label>
            Επιλέξτε Ενέργεια:
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as UploadType)}
            >
              <option value="addpasses">Προσθήκη Δεδομένων (addpasses)</option>
              <option value="resetpasses">Επαναφορά Δεδομένων διελεύσεων (resetpasses)</option>
              <option value="resetstations">Επαναφορά Σταθμών (resetstations)</option>
            </select>
          </label>
          <br />
          {uploadType === 'addpasses' && (
            <label>
              Επιλέξτε αρχείο CSV:
              <input type="file" accept=".csv" onChange={handleFileChange} required={uploadType === 'addpasses'} />
            </label>
          )}
          <br />
          <button type="submit">
            {uploadType === 'addpasses' ? 'Αποστολή' : 'Επαναφορά'}
          </button>
        </form>
        {error && <p className="error-message">Error: {error}</p>}
      </div>
      {result && (
        <div className="card">
          <h3>Απάντηση από το σύστημα:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};

export default Admin;