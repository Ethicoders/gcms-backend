import { ModuleContext } from '@graphql-modules/core';
import { Db, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

const APP_SECRET = 'test';

export default {
  Mutation: {
    updateConsumer: async (root, { input }, { injector }: ModuleContext) => {
      await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .updateOne(
          { _id: new ObjectId(input.id) },
          {
            $set: input,
          },
        );
      return {
        consumer: input,
      };
    },
    signUp: async (root, { login, password }, { injector }: ModuleContext) => {
      const db = await ((await injector.get('DB')) as Db);

      const collection = db.collection('consumers');

      const hashedPassword = await hash(password, 10);
      const { insertedId } = await collection.insertOne({
        login,
        password: hashedPassword,
      });
      const consumer = await collection
        .find({ _id: new ObjectId(insertedId) })
        .limit(1)
        .toArray()[0];

      const token = sign({ userId: insertedId }, APP_SECRET);

      return {
        token,
        consumer,
      };
    },
    signIn: async (root, { login, password }, { injector }: ModuleContext) => {
      const consumers = await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .find({ login })
        .limit(1)
        .toArray();

      if (!consumers[0]) {
        throw new Error('No such user found');
      }
      const consumer = consumers[0];

      const valid = await compare(password, consumer.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const token = sign({ userId: consumer._id }, APP_SECRET);

      await ((await injector.get('DB')) as Db)
        .collection('consumers')
        .updateOne({ login }, { $set: { token } });

      return {
        token,
        consumer,
      };
    },
  },
};
