import { ModuleContext } from '@graphql-modules/core';
import { Db, ObjectID } from 'mongodb';

export default {
  Query: {
    getConsumer: async (root, { id }, { injector }: ModuleContext) => {
      const consumers = await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .find({ _id: new ObjectID(id) })
        .limit(1)
        .toArray();
      const consumer = consumers[0];
      return consumer;
    },
    getListOfConsumer: async (root, { id }, { injector }: ModuleContext) => {
      const consumers = await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .find()
        .toArray();
      return consumers;
    },
  },
};
