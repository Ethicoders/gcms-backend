import { Injectable } from '@graphql-modules/di';
import FileJSON from '@/utils/json';
import emitter from '@/emitter';
import { exec } from 'child_process';

@Injectable()
export default class Plugin {
  private pluginsFile: FileJSON;

  constructor(filePath: string, private pluginsDirectoryPath: string) {
    this.pluginsFile = new FileJSON(filePath);

    emitter.on('plugin:install', name => {
      this.installPlugin(name);
    });
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

  public async installPlugin(name) {
    const command = exec(`yalc add gcms-${name} && yarn`, {
      cwd: this.pluginsDirectoryPath,
    });
    command.stderr.on('data', data => {
      console.log('Install stdout: ', data);
    });

    command.on('exit', () => {
      console.log('done installing');
    });
  }
}
