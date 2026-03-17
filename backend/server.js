import "dotenv/config";
import http from "http";
import express from "express";
const app = express();
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import qcRoutes from "./routes/qc.js";
import caseRoutes from "./routes/cases.js";
import uploadRoutes from "./routes/uploads.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import paymentRoutes from "./routes/payments.js";
import { handleStripeWebhook } from "./controllers/payments.js";
import cors from "cors";
import { createDefaultAdmin, createDefaultDentist } from "./DefaultUser/DefaultUser.js";
import { setupSocketIO } from "./socket.js";

app.use(cors("*"));

// Stripe webhook needs raw body for signature verification (must be before express.json())
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);
app.post("/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

// Connect to database
connectDB();

const PORT = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());

createDefaultAdmin();
createDefaultDentist();
// Routes (with /api for direct access; without /api for proxy that strips prefix)
app.use('/api/accounts', authRoutes);
app.use('/accounts', authRoutes);
app.use('/api/qc', qcRoutes);
app.use('/qc', qcRoutes);
app.use('/api/cases', caseRoutes);
app.use('/cases', caseRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/uploads', uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/chat", chatRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/payments", paymentRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

const server = http.createServer(app);
setupSocketIO(server);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
