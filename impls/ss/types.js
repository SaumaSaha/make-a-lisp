class MalSeq {
  constructor(...args) {
    this.args = args;
  }

  prStr(start, end) {
    return `${start}${this.args.map((arg) => arg.prStr()).join(" ")}${end}`;
  }
}

class MalList extends MalSeq {
  constructor(...args) {
    super(...args);
  }

  isEmpty() {
    return this.args.length === 0;
  }

  prStr() {
    return super.prStr("(", ")");
  }
}

class MalVector extends MalSeq {
  constructor(...args) {
    super(...args);
  }

  prStr() {
    return super.prStr("[", "]");
  }
}

class MalMap extends MalSeq {
  constructor(...args) {
    super(...args);
  }

  prStr() {
    return super.prStr("{", "}");
  }
}

class MalValue {
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return this.value + "";
  }
}

class MalBool extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalSymbol {
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return this.value.toString();
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalNil {
  prStr() {
    return "nil";
  }
}

class MalFunc extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value);
  }
}

module.exports = {
  MalSeq,
  MalValue,
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalString,
  MalMap,
  MalKeyword,
  MalFunc,
  MalBool,
};
