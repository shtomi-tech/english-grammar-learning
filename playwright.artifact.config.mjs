import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "artifact-smoke.spec.mjs",
  use: {
    baseURL: "http://127.0.0.1:5913",
    viewport: { width: 1280, height: 900 }
  },
  webServer: {
    command: "python -m http.server 5913 --bind 127.0.0.1 --directory _site",
    url: "http://127.0.0.1:5913",
    reuseExistingServer: true
  }
});
