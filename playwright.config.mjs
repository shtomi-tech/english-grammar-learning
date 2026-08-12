import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testIgnore: "artifact-smoke.spec.mjs",
  use: {
    baseURL: "http://127.0.0.1:5912",
    viewport: { width: 1280, height: 900 }
  },
  webServer: {
    command: "python -m http.server 5912 --bind 127.0.0.1",
    url: "http://127.0.0.1:5912",
    reuseExistingServer: true
  }
});
