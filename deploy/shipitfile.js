// shipitfile.js
module.exports = shipit => {
  // Load shipit-deploy tasks
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)

  shipit.initConfig({
    default: {
      deployTo: '/var/www/ep9',
      repositoryUrl: 'git@github.com:JSCasts-episodes/ep9-deploy-via-shipit.git',
      shared: {
        dirs: ['node_modules'],
        overwrite: true,
      },
    },
    staging: {
      servers: 'root@68.183.219.150',
    },
  })

  shipit.blTask('npm:install', async () => {
    await shipit.remote(`cd ${shipit.releasePath} && npm install --production`)
  })

  shipit.blTask('server:start', async () => {
    const command = 'NODE_ENV=production forever start current/server.js'
    await shipit.remote(`cd ${shipit.config.deployTo} && ${command}`)
  })

  shipit.blTask('server:restart', async () => {
    const command = 'forever restartall'
    await shipit.remote(`cd ${shipit.config.deployTo} && ${command}`)
  })

  shipit.on('updated', () => {
    shipit.start('npm:install')
  })

  shipit.on('published', () => {
    shipit.start('server:restart')
  })
}