import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load the backend .env and allow it to replace a stale process-level value.
dotenv.config({ path: ".env", override: true });

const apiKey = process.env.GROQ_API_KEY?.trim();

const groq = apiKey
  ? new Groq({ apiKey })
  : null;

export default groq;
