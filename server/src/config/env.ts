import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { environmentSchema, EnvironmentConfig } from "@aire/validation";

// Walk up directory tree to locate root .env file
function findRootEnv(): string | null {
  let currentDir = process.cwd();
  while (currentDir !== "/" && currentDir !== ".") {
    const candidate = path.join(currentDir, ".env");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parent = path.dirname(currentDir);
    if (parent === currentDir) break;
    currentDir = parent;
  }
  return null;
}

const envPath = findRootEnv();
if (envPath) {
  dotenv.config({ path: envPath });
}
dotenv.config(); // fallback

function loadEnvironment(): EnvironmentConfig {
  const result = environmentSchema.safeParse(process.env);
  if (!result.success) {
    const errorDetails = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(
      `CRITICAL: Invalid environment configuration: ${errorDetails}`,
    );
  }
  return result.data;
}

export const env = loadEnvironment();
