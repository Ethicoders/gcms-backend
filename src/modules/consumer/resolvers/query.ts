import { ModuleContext } from '@graphql-modules/core';
import { Db } from 'mongodb';

export default {
  Query: {
    getConsumer: async (root, { id }, { injector }: ModuleContext) => {
      const consumer = await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .find({ _id: id })
        .limit(1)
        .toArray()[0];
      return {
        consumer,
      };
    },
    getConsumers: async (root, { id }, { injector }: ModuleContext) => {
      const consumers = await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .find()
        .toArray();
      return consumers;
    },
  },
};
