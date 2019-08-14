import { GraphQLModule } from '@graphql-modules/core';

import gql from 'graphql-tag';
import Database from './providers/Database';

export default new GraphQLModule({
  name: 'Database',
  typeDefs: [
    gql`
      type Entity {
        name: String!
        fields: [Field!]!
        canCreate: Boolean
        canUpdate: Boolean
        canDelete: Boolean
      }

      type Field {
        name: String!
        isRequired: Boolean
        isPublic: Boolean
      }
    `,
  ],
  providers: ({ config: { url, databaseName } }) => {
    return [
      {
        provide: 'DB',
        useFactory: () => {
          return Database.instantiate(url, databaseName);
        },
      },
    ];
  },
  configRequired: true,
});
