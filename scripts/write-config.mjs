import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const configPath = resolve("config.json");
const config = {
  appBaseUrl: process.env.APP_BASE_URL || "",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ""
};

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`Wrote ${configPath}`);
