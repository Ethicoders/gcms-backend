import { GraphQLModule } from '@graphql-modules/core';
import gql from 'graphql-tag';
import Plugin from './providers/Plugin';
import mutation from './resolvers/mutation';
import query from './resolvers/query';
import plugin from './resolvers/plugin';

export default new GraphQLModule({
  typeDefs: gql`
    type Plugin {
      name: String!
      isEnabled: Boolean!
    }

    type Query {
      getPlugins: [Plugin!]!
    }

    type Mutation {
      updatePlugin(plugin: PluginUpdateInput!): PluginUpdatePayload
    }

    input PluginUpdateInput {
      name: String!
      isEnabled: Boolean
    }

    type PluginUpdatePayload {
      plugin: Plugin
    }
  `,
  providers: ({ config: { pluginsFilePath } }) => {
    return [
      {
        provide: Plugin,
        useFactory: () => new Plugin(pluginsFilePath),
      },
    ];
  },
  resolvers: {
    ...mutation,
    ...query,
    ...plugin,
  },
  configRequired: true,
});
