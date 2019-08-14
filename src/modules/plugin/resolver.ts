import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Plugin, PluginUpdate, PluginInput } from './types';
import FileJSON from '@/utils/json';
import { Inject } from '@graphql-modules/di';

@Resolver()
export default class {
  constructor(@Inject('Plugins') private plugins: FileJSON) {}
  // @Inject('Plugins')
  // private readonly plugins: FileJSON;

  @Query(returns => [Plugin])
  public getPlugins() {
    return this.plugins.read();
  }

  @Mutation(returns => PluginUpdate)
  public async updatePlugin(@Arg('plugin') plugin: PluginInput) {
    const plugins = this.updatePluginByName(plugin.name, plugin);
    await this.updatePlugins(plugins);

    return {
      plugin,
    };
  }

  private updatePlugins(plugins) {
    return this.plugins.write(plugins);
  }

  private async getPluginByName(name: string) {
    const plugins: Plugin[] = await this.plugins.read();
    return plugins.find(item => item.name === name);
  }

  private async updatePluginByName(name: string, data: PluginInput) {
    const plugins: Plugin[] = await this.plugins.read();
    for (let i = 0; i < plugins.length; ++i) {
      if (plugins[i].name === name) {
        plugins[i] = { ...this.preparePluginData(data) };
        break;
      }
    }
    return plugins;
  }

  private preparePluginData(data: PluginInput): Plugin {
    return { isEnabled: false, ...data };
  }
}
