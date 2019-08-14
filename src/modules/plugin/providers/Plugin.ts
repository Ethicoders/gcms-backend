import { Injectable } from '@graphql-modules/di';
import FileJSON from '@/utils/json';

@Injectable()
export default class Plugin {
  private pluginsFile;

  constructor(filePath: string) {
    this.pluginsFile = new FileJSON(filePath);
  }

  public getPlugins() {
    return this.pluginsFile.read();
  }

  public async updatePlugin(plugin) {
    const plugins = await this.getPlugins();
    plugins.some((row, index) => {
      if (row.name === plugin.name) {
        plugins[index] = plugin;
      }
    });
    this.pluginsFile.write(plugins);
  }
}
