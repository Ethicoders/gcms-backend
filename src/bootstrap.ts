import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';
import FileJSON from '@/utils/json';
import { ConsumerModule, DatabaseModule, PluginModule } from '@/modules';
import { GraphQLModule } from '@graphql-modules/core';

const defaultConfig = {
  app: {
    graphqlRoot: '/',
    port: 4000,
    graphiql: true,
  },
  plugin: {
    pluginsFilePath: __dirname + '/plugins.json',
  },
  database: {
    url: 'mongodb://localhost:27017',
    databaseName: 'test',
  },
  modulesPath: __dirname + '/modules'
};

/*
Check if default exports are supported by Elm/PureScript/other bundlers
If not, use named exports instead and loop over the object to get a 
value that matches a plugin definition
*/

const getEnabledModules = plugins => {
  return plugins
    .filter(plugin => plugin.isEnabled)
    .map(plugin => require(`graphql-cms-${plugin.name}`).default);
};

export default (inputConfig: typeof defaultConfig) => {
  const app = express();

  const config = { ...defaultConfig, ...inputConfig };

  app.use(
    config.app.graphqlRoot,
    graphqlHTTP(async (request, response, graphQLParams) => {
      const pluginsFile = new FileJSON(config.plugin.pluginsFilePath);
      const plugins = await pluginsFile.read();
      const enabledModules = getEnabledModules(plugins);
      console.log(enabledModules);
      
      const RootModule = new GraphQLModule({
        imports: ({ config: { plugin, database } }) => [
          DatabaseModule.forRoot(database),
          PluginModule.forRoot(plugin),
          ConsumerModule,
          ...enabledModules,
        ],
        configRequired: true,
      });
      // const test = RootModule.forRoot(config);
      const { schema } = RootModule.forRoot(config);
      // console.log(test.schema);
      
      // const { schema } = AppModule.forRoot(config);
      response.setHeader('Access-Control-Allow-Origin', '*');

      // SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);

      // writeFileSync('schema.gql', printSchema(schema));

      return {
        schema,
        graphiql: config.app.graphiql,
      };
    }),
  );

  app.listen(config.app.port, () => {
    console.log(
      `Server ready at http://localhost:${config.app.port}${
        config.app.graphqlRoot
      }`,
    );
  });

  return app;
};
