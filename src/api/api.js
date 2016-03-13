import express from 'express';
import bodyParser from 'body-parser';

/* Config */

import config from '../config';

/* API Resource Models */

import * as apiModels from './models';

const app = express();
app.use(bodyParser.json());

//app.user = apiModels.User;
//apiModels.User.register(app, '/users');

if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
