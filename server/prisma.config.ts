import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";
import path from "path";

// Load root .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
