import app from "./app";
import { config } from "./src/config/environment";
import { connectDatabase } from "./src/config/database";

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase(config.mongoUri);

    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  const { disconnectDatabase } = await import("./src/config/database");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  const { disconnectDatabase } = await import("./src/config/database");
  await disconnectDatabase();
  process.exit(0);
});

startServer();
