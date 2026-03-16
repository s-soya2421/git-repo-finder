export type LogEntry = {
  timestamp: string;
  level: "info" | "warn" | "error";
  message: string;
  [key: string]: unknown;
};

export function log(entry: Omit<LogEntry, "timestamp">): void {
  const full = {
    timestamp: new Date().toISOString(),
    ...entry,
  };
  console.log(JSON.stringify(full));
}
