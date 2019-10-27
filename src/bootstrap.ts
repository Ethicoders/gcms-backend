import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import * as cors from 'cors';
import emitter from './emitter';
import * as WebSocket from 'ws';

// There should be no global default config but "per module" default config, TBI
const defaultConfig = {
  // App and plugin will be part of core
  app: {
    graphqlRoot: '/',
    port: 4000,
    graphiql: true,
  },
  plugin: {
    pluginsPrefix: '', // Empty string by default so it's required from local node_modules
    pluginsFilePath: __dirname + '/plugins.json',
  },

  // Should be a standalone
  database: {
    url: 'mongodb://localhost:27017',
    databaseName: 'test',
  },
};

/*
Check if default exports are supported by Elm/PureScript/other transpilers and bundlers
If not, use named exports instead and loop over the object to get a 
value that matches a plugin definition
*/

export default async (inputConfig: typeof defaultConfig) => {
  const app = express();

  const config = { ...defaultConfig, ...inputConfig };

  app.use('/graphql', cors());

  const schema = await require('@/modules/app').default(config);

  app.use(
    config.app.graphqlRoot,
    graphqlHTTP((request, response, graphQLParams) => {
      let chaining = '';

      emitter.once('dispatch:chaining', eventChaining => {
        chaining = eventChaining;
      });
      return {
        schema,
        request,
        customFormatErrorFn: error => ({
          message: error.message,
          locations: error.locations,
          stack: error.stack,
          path: error.path,
        }),
        extensions: ({
          document,
          variables,
          operationName,
          result,
          context,
        }) => {
          return {
            chaining,
            duration: Date.now() - (context as any).startTime,
          };
        },
        context: { startTime: Date.now() },
        graphiql: config.app.graphiql,
      };
    }),
  );

  const server = app.listen(config.app.port);

  const webSocketServer = new WebSocket.Server({ server });

  webSocketServer.on('connection', ws => {
    ws.on('message', () => {});
  });

  server.on('listening', () => {
    emitter.emit('ready');
  });

  return app;
};
