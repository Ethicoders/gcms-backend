import { GraphQLModule } from '@graphql-modules/core';

import gql from 'graphql-tag';
import Database from './providers/Database';
import { Pool, createPool } from 'generic-pool';
import { MongoClient } from 'mongodb';
import { DatabaseProvider } from './providers/database.provider';

export default new GraphQLModule({
  name: 'database',
  // typeDefs: [
  //   gql`
  //     type Entity @isAuthenticated {
  //       test: String
  //     }

  //   `,
  // ],
  providers: ({ config: { url, databaseName } }) => {
    return [
      {
        provide: 'DB',
        //   provide: Pool,
        useFactory: () => {
          return Database.instantiate(url, databaseName);
        },
        //   useFactory: () =>
        //     createPool({
        //       create: () =>
        //         MongoClient.connect(url, {
        //           useNewUrlParser: true,
        //         }),
        //       destroy: client => client.close(),
        //     }),
      },
      // DatabaseProvider,
    ];
  },
  configRequired: true,
});
