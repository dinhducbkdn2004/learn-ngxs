export class AddAnimal {
  static readonly type = '[Animals] Add';
  constructor(public name: string) {}
}

export class RemoveAnimal {
  static readonly type = '[Animals] Remove';
  constructor(public name: string) {}
}
