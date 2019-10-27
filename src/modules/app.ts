import { GraphQLModule, ModuleContext } from '@graphql-modules/core';
import FileJSON from '@/utils/json';
import builtinModules from '@/modules';

import gql from 'graphql-tag';
import generateScopedSchema from 'gcms-scoped-schema';

import { introspectionQuery } from 'graphql';
import { graphqlSync } from 'graphql';
import DiscoverProvider, { FORBIDDEN_TYPES } from './discover';
import emitter from '@/emitter';

export default async config => {
  const getPluginByName = await import(config.plugin.pluginsDirectory);
  const getEnabledModules = plugins => {
    return plugins
      .filter(plugin => plugin.isEnabled)
      .map(plugin => getPluginByName(plugin.name));
  };

  const pluginsFile = new FileJSON(config.plugin.pluginsFilePath);

  const plugins = await pluginsFile.read();
  const enabledModules = getEnabledModules(plugins);
  enabledModules.forEach(enabledModule => {
    enabledModule._options.imports = enabledModule._options.imports || [];
    enabledModule._options.imports = [
      ...builtinModules,
      ...enabledModule._options.imports,
    ];
  });

  const modulesToImport = [...builtinModules, ...enabledModules];

  const RootModule = new GraphQLModule(
    {
      imports: ({ config }) =>
        modulesToImport.map(imported =>
          imported.forRoot(config[imported.name] || {}),
        ),
      typeDefs: gql`
        type Query {
          discover: ScopedSchema
        }

        type Mutation @isAuthenticated(roles: ["admin"]) {
          restart: Null
        }

        type Field {
          name: String!
          description: String
          args: [InputValue!]!
          type: Type!
          isDeprecated: Boolean!
          deprecationReason: String
        }

        type EnumValue {
          name: String!
          description: String
          isDeprecated: Boolean!
          deprecationReason: String
        }

        type ScopedSchema {
          types: [Type!]!
          queryType: Type!
          mutationType: Type
          subscriptionType: Type
          directives: [Directive!]!
        }

        type Directive {
          name: String!
          description: String
          locations: [DirectiveLocation!]!
          args: [InputValue!]!
        }

        type Type {
          kind: TypeKind!
          name: String
          description: String
          fields(includeDeprecated: Boolean = false): [Field!]
          interfaces: [Type!]
          possibleTypes: [Type!]
          enumValues(includeDeprecated: Boolean = false): [EnumValue!]
          inputFields: [InputValue!]
          ofType: Type
        }

        type InputValue {
          name: String!
          description: String
          type: Type!
          defaultValue: String
        }

        scalar DirectiveLocation

        scalar TypeKind
      `,
      providers: [DiscoverProvider],
      resolvers: {
        Query: {
          async discover(root, args, { injector }: ModuleContext) {
            const criteriaList: any[] = injector.get(FORBIDDEN_TYPES);

            const scopedSchema = generateScopedSchema(schema, criteriaList);

            const real = graphqlSync(scopedSchema, introspectionQuery);

            return real.data.__schema;
          },
        },
        Mutation: {
          restart() {
            emitter.emit('trigger:restart');
          },
        },
      },
      configRequired: true,
    },
    config,
  );
  const { schema } = RootModule;
  return schema;
};
