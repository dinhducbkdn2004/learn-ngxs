export class Increment {
  static readonly type = '[Counter] Increment';
}

export class Decrement {
  static readonly type = '[Counter] Decrement';
}

export class Reset {
  static readonly type = '[Counter] Reset';
}

export class IncrementBy {
  static readonly type = '[Counter] IncrementBy';
  constructor(public payload: number) {}
}
