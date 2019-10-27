import gql from 'graphql-tag';
import { GraphQLModule } from '@graphql-modules/core';

export default new GraphQLModule({
  name: 'plugin',
  typeDefs: gql`
    scalar Null

    scalar HTML
  `,
});
