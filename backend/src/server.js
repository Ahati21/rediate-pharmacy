import { app } from "./app.js";
import { connectToDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { ensureDefaultAdmin } from "./utils/admin.js";

async function startServer() {
  try {
    await connectToDatabase();

    await ensureDefaultAdmin();

    // Start server
    app.listen(env.port, () => {
      console.log(`Backend server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);

    process.exit(1);
  }
}

startServer();
