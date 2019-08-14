import { GraphQLModule } from '@graphql-modules/core';
import DatabaseModule from '../database';
import gql from 'graphql-tag';
import mutation from './resolvers/mutation';
import query from './resolvers/query';
import consumer from './resolvers/consumer';

export default new GraphQLModule({
  name: 'Consumer',
  typeDefs: gql`
    type Consumer {
      login: String!
      password: String
    }

    type Query {
      getConsumer(id: ID): Consumer!
      getConsumers: [Consumer!]
    }

    type AuthPayload {
      consumer: Consumer!
      token: String!
    }

    type Mutation {
      updateConsumer(consumer: ConsumerUpdateInput!): ConsumerUpdatePayload
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
      login: String!
    }

    type ConsumerUpdatePayload {
      consumer: Consumer
    }
  `,
  imports: [DatabaseModule],
  resolvers: {
    ...mutation,
    ...query,
    ...consumer,
  },
});
