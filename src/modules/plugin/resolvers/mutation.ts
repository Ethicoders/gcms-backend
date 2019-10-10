import { ModuleContext } from '@graphql-modules/core';
import Plugin from '../providers/Plugin';
import { emitter } from '@/index';

export default {
  Mutation: {
    updatePlugin: (root, { input }, { injector }: ModuleContext) => {
      injector.get(Plugin).updatePlugin(input);
      emitter.emit('dispatch:chaining', 'system.restart');
      return {
        plugin: input,
      };
    },
    installPlugin: (root, { name }, { injector }: ModuleContext) => {
      emitter.emit('plugin:install', name);
      emitter.emit('dispatch:chaining', 'system.restart');
      return {
        name,
        isEnabled: false,
      };
    },
  },
};
