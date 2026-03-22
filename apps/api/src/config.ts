function require(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export const config = {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  db: {
    url: require("DATABASE_URL"),
  },
  port: parseInt(process.env.PORT || "3000"),
  logLevel: process.env.LOG_LEVEL || "info",
  isDev: process.env.NODE_ENV !== "production",
};
