import { app } from "@src/app";
import supertest from "supertest";


const api = supertest(app);

export default api;