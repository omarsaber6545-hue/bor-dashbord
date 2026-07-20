module.exports = {
  apps: [
    {
      name: 'discord-control-center-backend',
      script: 'server/dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'discord-control-center-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start client',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
