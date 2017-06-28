module.exports = {
  apps: [{
    name: 'ericconstantinides.com',
    script: './bin/www'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-13-56-120-181.us-west-1.compute.amazonaws.com',
      key: '~/.ssh/TheKeyPairofEric.pem',
      ref: 'origin/master',
      repo: 'git@github.com:ericconstantinides/ericconstantinides.com.git',
      path: '/home/ubuntu/Sites/ericconstantinides.com',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}