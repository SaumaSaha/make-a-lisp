class MalSeq {
  constructor(...value) {
    this.value = value;
  }

  prStr(start, end) {
    return `${start}${this.value.map((arg) => arg.prStr()).join(" ")}${end}`;
  }
}

class MalList extends MalSeq {
  constructor(...value) {
    super(...value);
  }

  isEmpty() {
    return this.value.length === 0;
  }

  prStr() {
    return super.prStr("(", ")");
  }
}

class MalVector extends MalSeq {
  constructor(...value) {
    super(...value);
  }

  prStr() {
    return super.prStr("[", "]");
  }
}

class MalMap extends MalSeq {
  constructor(...value) {
    super(...value);
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

class MalNil extends MalValue {
  constructor() {
    super(false);
  }
  prStr() {
    return "nil";
  }
}

class MalFunc {
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return "#<function>";
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
