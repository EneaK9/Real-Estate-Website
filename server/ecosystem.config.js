module.exports = {
  apps: [
    {
      name: "real-estate",
      script: "server/src/index.ts",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
