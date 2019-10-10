import { GraphQLModule } from '@graphql-modules/core';
import gql from 'graphql-tag';
import Plugin from './providers/Plugin';
import mutation from './resolvers/mutation';
import query from './resolvers/query';
import plugin from './resolvers/plugin';
import ConsumerModule from '../consumer';
import emitter from '@/emitter';
import { exec } from 'child_process';

export interface PluginModuleConfig {
  pluginsFilePath: string;
  pluginsDirectory: string;
}

export default new GraphQLModule<PluginModuleConfig>({
  name: 'plugin',
  typeDefs: gql`
    "A gcms plugin, can be enabled or not"
    type Plugin @isAuthenticated(roles: ["admin"]) {
      name: String!
      isEnabled: Boolean!
    }

    type Query {
      getPlugin(name: String): Plugin
      getListOfPlugin: [Plugin!]!
    }

    type Mutation {
      updatePlugin(input: PluginUpdateInput!): PluginUpdatePayload
      installPlugin(name: String!): Plugin
    }

    input PluginUpdateInput {
      name: String!
      isEnabled: Boolean
    }

    type PluginUpdatePayload {
      plugin: Plugin
    }
  `,
  imports: [ConsumerModule],
  providers: ({ config: { pluginsFilePath, pluginsDirectory } }) => {
    return [
      {
        provide: Plugin,
        useFactory: () => new Plugin(pluginsFilePath, pluginsDirectory),
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
