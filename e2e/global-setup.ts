import { execSync } from "node:child_process";
import { createMockServer } from "./mock-server";

const MOCK_PORT = 3099;

export default async function globalSetup() {
  // Kill any existing process on the mock port
  try {
    execSync(`lsof -ti:${MOCK_PORT} | xargs kill 2>/dev/null`, {
      stdio: "ignore",
    });
  } catch {
    // No process to kill
  }

  const server = await createMockServer(MOCK_PORT);

  return async () => {
    server.close();
  };
}
