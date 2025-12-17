import "dotenv/config";
import express from 'express';
const app = express();
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import qcRoutes from './routes/qc.js';
import caseRoutes from './routes/cases.js';
import cors from 'cors';
import { createDefaultAdmin } from "./DefaultUser/DefaultUser.js";

app.use(cors("*"))

// Connect to database
connectDB();

const PORT = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());

createDefaultAdmin()
// Routes
app.use('/api/accounts', authRoutes);
app.use('/api/qc', qcRoutes);
app.use('/api/cases', caseRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
