import { MongoClient, Db } from 'mongodb';
import { Injectable } from '@graphql-modules/di';

@Injectable()
export default abstract class Database {
  public static async instantiate(url, databaseName): Promise<Db> {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    return client.db(databaseName);
  }
}
