import { GraphQLModule } from '@graphql-modules/core';
import DatabaseModule from '../database';
import gql from 'graphql-tag';
import mutation from './resolvers/mutation';
import query from './resolvers/query';
import consumer from './resolvers/consumer';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import AuthProvider, { store } from './storage';
import { GraphQLObjectType, GraphQLField } from 'graphql';
import DiscoverProvider, { FORBIDDEN_TYPES } from '../discover';
import { DatabaseProvider } from '@modules/database/providers/database.provider';

class IsAuthenticatedDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(
    { name, astNode }: GraphQLField<any, any>,
    details,
  ) {
    const target = {
      roles: astNode.directives,
      criteria: {
        'name.value': name,
        parent: {
          'name.value': details.objectType,
          kind: 'ObjectTypeDefinition',
        },
      },
    };
    if (!store.find(row => JSON.stringify(row) === JSON.stringify(target))) {
      store.push(target);
    }
  }

  public visitObject({ name, astNode }: GraphQLObjectType) {
    const target = {
      roles: astNode.directives,
      criteria: {
        'name.value': name,
        kind: 'ObjectTypeDefinition',
      },
    };
    if (!store.find(row => JSON.stringify(row) === JSON.stringify(target))) {
      store.push(target);
    }
  }
}

const addTypeToStorage = (type, parent = null) => {
  type.astNode.directives.some(directive => {
    if (directive.name.value === 'isAuthenticated') {
      const argument = directive.arguments.find(
        argument => argument.name.value === 'roles',
      );

      store[type.astNode.kind].push({
        name: type.name,
        parent,
        roles: argument ? argument.value.values.map(value => value.value) : [],
      });

      return true;
    }
  });
};

export default new GraphQLModule({
  name: 'consumer',
  typeDefs: gql`
    "Account to use to access all the API endpoints"
    type Consumer {
      id: ID!
      login: String!
    }

    type Query {
      getConsumer(id: ID): Consumer!
      getListOfConsumer: [Consumer!]!
    }

    type AuthPayload {
      consumer: Consumer!
      token: String!
    }

    type Mutation {
      updateConsumer(input: ConsumerUpdateInput!): ConsumerUpdatePayload
      signIn(login: String!, password: String!): AuthPayload!
      signUp(login: String!, password: String!): AuthPayload!
      #   signOut(): AuthPayload!
      #   refreshSession(): AuthPayload!
    }

    input ConsumerCreateInput {
      login: String!
    }

    type ConsumerCreatePayload {
      consumer: Consumer
    }

    input ConsumerUpdateInput {
      id: ID!
      login: String!
    }

    type ConsumerUpdatePayload {
      consumer: Consumer
    }

    directive @intl on FIELD_DEFINITION

    directive @isAuthenticated(
      roles: [String]
    ) on OBJECT | FIELD | FIELD_DEFINITION
    directive @hasRole(role: String) on FIELD | FIELD_DEFINITION
  `,
  schemaDirectives: {
    isAuthenticated: IsAuthenticatedDirective,
  },
  imports: [DatabaseModule],
  providers: [AuthProvider, DiscoverProvider],
  resolvers: {
    ...mutation,
    ...query,
    ...consumer,
  },
  async context({ headers }, currentContext, { injector }) {
    // console.log('Checking token...');

    // const token = headers.authorization
    //   ? headers.authorization.replace('Bearer ', '')
    //   : '';
    // const consumers = await ((await injector.get('DB')) as Db)
    //   .collection('consumers')
    //   .find({ token })
    //   .limit(1)
    //   .toArray();

    // console.log(consumers[0] ? 'Authenticated!' : 'Invalid/expired token');

    // // const consumer = {
    // //   login: 'test',
    // //   roles: ['admin'],
    // // };

    // const forbiddenTypes: string[] = injector.get(FORBIDDEN_TYPES);

    // store.forEach((row: { roles: any[]; criteria: any }) => {
    //   let match = true;

    //   if (consumer && row.roles.length) {
    //     const matchingRole = consumer.roles.find(role =>
    //       row.roles.includes(role),
    //     );

    //     match = !!matchingRole;
    //   } else if (!consumer) {
    //     match = false;
    //   }

    //   if (
    //     !match &&
    //     !forbiddenTypes.find(
    //       forbiddenType =>
    //         JSON.stringify(forbiddenType) ===
    //         JSON.stringify(row.criteria),
    //     )
    //   ) {
    //     forbiddenTypes.push(row.criteria);
    //   }
    // });

    return { consumer };
  },
});
