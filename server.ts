import express from "express";
import path from "path";
import marineConditionsRouter from "./server/marine-conditions.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Dedicated ads.txt endpoint for Google AdSense crawler
  app.get("/ads.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send("google.com, pub-9043483767704653, DIRECT, f08c47fec0942fa0\n");
  });

  // Marine conditions and NOAA/NWS API routes
  app.use("/api", marineConditionsRouter);

  // Vite middleware in dev, static files in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
