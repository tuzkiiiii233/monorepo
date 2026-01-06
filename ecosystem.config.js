module.exports = {
  apps: [
    {
      name: "app-a",
      cwd: "./packages/app-a",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "app-b",
      cwd: "./packages/app-b",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
