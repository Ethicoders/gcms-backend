import { ObjectType, Field, InputType } from 'type-graphql';

@ObjectType()
export class Plugin {
  @Field()
  name: string;

  @Field()
  isEnabled: boolean;
}

@ObjectType()
export class PluginUpdate {
  @Field()
  plugin: Plugin;
}

@InputType()
export class PluginInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  isEnabled?: boolean;
}
