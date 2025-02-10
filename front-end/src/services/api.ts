// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'https://localhost:9115/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// GET /admin/healthcheck
export const getHealthCheck = () => api.get('/admin/healthcheck');

// GET /tollStationPasses/{tollStationID}/{date_from}/{date_to}
export const getTollStationPasses = (station: string, from: string, to: string) =>
  api.get(`/tollStationPasses/${station}/${from}/${to}`);

// GET /passAnalysis/{stationOpID}/{tagOpID}/{date_from}/{date_to}
export const getPassAnalysis = (stationOp: string, tagOp: string, from: string, to: string) =>
  api.get(`/passAnalysis/${stationOp}/${tagOp}/${from}/${to}`);

// GET /passesCost/{tollOpID}/{tagOpID}/{date_from}/{date_to}
export const getPassesCost = (stationOp: string, tagOp: string, from: string, to: string) =>
  api.get(`/passesCost/${stationOp}/${tagOp}/${from}/${to}`);

// GET /chargesBy/{tollOpID}/{date_from}/{date_to}
export const getChargesBy = (opid: string, from: string, to: string) =>
  api.get(`/chargesBy/${opid}/${from}/${to}`);

// POST endpoints for CSV file uploads:
export const postCsvFile = (endpoint: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Convenience functions for each CSV endpoint:
export const resetPasses = (file: File) => postCsvFile('/admin/resetpasses', file);
export const resetStations = (file: File) => postCsvFile('/admin/resetstations', file);
export const addPasses = (file: File) => postCsvFile('/admin/addpasses', file);

export default api;
