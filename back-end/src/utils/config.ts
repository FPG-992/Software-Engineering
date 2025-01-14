import dotenv from "dotenv";
import { returnIfSetElseThrow } from ".";

const config = dotenv.config();

if (config.error) {
  throw config.error;
}

export default {
  BACKEND_PORT: Number.parseInt(
    returnIfSetElseThrow(process.env, "BACKEND_PORT")
  ),
  DATABASE_URL: returnIfSetElseThrow(process.env, "DATABASE_URL"),
};
