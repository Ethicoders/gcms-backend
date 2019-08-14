export class Entity {
  public constructor(public name: string, public fields: Field[]) {}
  canCreate = true;
  canUpdate = true;
  canDelete = true;
}

export class Field {
  public constructor(public name: string, public conditionals?: Conditional[]) {}
  isRequired = false;
  isPublic = true;
}

export class Conditional {
  keyword: 'and' | 'or';
  fieldName: string;
  operator: OPERATORS;
  value: string;
}

enum OPERATORS {
  '==',
  '<=',
  '>=',
  '<',
  '>',
  '!=',
  'LIKE',
  'NOT LIKE',
  'IN',
  'NOT IN',
}

const ent = new Entity('posts', [
  new Field('title')
]);
