import { ModuleContext } from '@graphql-modules/core';
import Plugin from '../providers/Plugin';

export default {
  Query: {
    getListOfPlugin: (root, args, context: ModuleContext) => {
      // console.log(context);

      return context.injector.get(Plugin).getPlugins();
    },
    getPlugin: async (root, { name }, context: ModuleContext) => {
      const plugins = await context.injector.get(Plugin).getPlugins();
      return plugins.find(plugin => plugin.name === name);
    },
  },
};
