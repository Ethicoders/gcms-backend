import { GraphQLModule } from '@graphql-modules/core';

import PluginModule from './plugin';
import DatabaseModule from './database';
import ConsumerModule from './consumer';

export default new GraphQLModule({
  imports: ({ config: { plugin, database } }) => [
    DatabaseModule.forRoot(database),
    PluginModule.forRoot(plugin),
    ConsumerModule,
  ],
  configRequired: true,
});
