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

class MalValue {
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return this.value + "";
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

class MalNil {
  prStr() {
    return "nil";
  }
}

module.exports = { MalValue, MalSymbol, MalList, MalVector, MalNil };
