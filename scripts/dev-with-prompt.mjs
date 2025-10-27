import { spawn } from "child_process";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 Starting development server...\n");

rl.question("Do you want to load mocked data? (y/n): ", (answer) => {
  const useMockData =
    answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";

  console.log(
    useMockData ? "✅ Loading with mock data" : "❌ Loading without mock data",
  );
  console.log("Starting Next.js...\n");

  // Set environment variable and start Next.js
  const env = {
    ...process.env,
    USE_MOCK_DATA: useMockData ? "true" : "false",
  };

  const nextProcess = spawn("next", ["dev"], {
    env,
    stdio: "inherit",
    shell: true,
  });

  nextProcess.on("close", (code) => {
    process.exit(code);
  });

  rl.close();

  console.log(
    answer === "yes" || answer === "y"
      ? `📝 Loaded mock tasks!`
      : "📝 Starting with empty task list",
  );
});
