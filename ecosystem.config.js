module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'wchat-koa',
      script    : 'bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_test : {
        NODE_ENV: 'test'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    test : {
      user : 'moohng',
      host : '39.108.137.234',
      ref  : 'origin/master',
      repo : 'git@github.com:moohng/wchat-koa.git',
      path : '/home/moohng/server/test',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env test'
    }
  }
};
