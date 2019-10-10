import { Pool } from 'generic-pool';
import { Injectable, ProviderScope } from '@graphql-modules/di';
import { OnRequest } from '@graphql-modules/core';
import { MongoClient } from 'mongodb';

@Injectable({
  scope: ProviderScope.Session,
})
export class DatabaseProvider implements OnRequest {
  private _poolClient: MongoClient;
  constructor(private pool: Pool) {}
  public async onRequest() {
    this._poolClient = await this.pool.acquire();
  }
  public async onResponse() {
    if (this._poolClient) {
      await this.pool.release(this._poolClient);
    }
  }
  public getClient() {
    return this._poolClient;
  }
}
