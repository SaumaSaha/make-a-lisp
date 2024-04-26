const { Env } = require("./env");
const { MalValue, MalList, MalBool, MalSeq } = require("./types");

const checkEquals = (a, b) => {
  if (a instanceof MalSeq && b instanceof MalSeq) {
    if (a.value.length !== b.value.length) return new MalBool(false);
    return new MalBool(
      a.value.every((element, index) => checkEquals(element, b.value[index]))
    );
  }

  return new MalBool(a.value === b.value);
};

const ns = {
  "+": (args) => new MalValue(args.reduce((a, b) => a.value + b.value)),
  "-": (args) => new MalValue(args.reduce((a, b) => a.value - b.value)),
  "*": (args) => new MalValue(args.reduce((a, b) => a.value * b.value)),
  "/": (args) => new MalValue(args.reduce((a, b) => a.value / b.value)),
  "=": ([a, b]) => checkEquals(a, b),
  "<": ([a, b]) => new MalBool(a.value < b.value),
  ">": ([a, b]) => new MalBool(a.value > b.value),
  "<=": ([a, b]) => new MalBool(a.value <= b.value),
  ">=": ([a, b]) => new MalBool(a.value >= b.value),
  "list": (args) => new MalList(...args),
  "list?": (args) => new MalBool(args[0] instanceof MalList),
  "empty?": (args) => new MalBool(args[0].value.length === 0),
  "count": (args) => new MalValue(args[0].value.length),
};

const createAndLoadEnv = () => {
  return new Env(null, { ...ns });
};

module.exports = { createAndLoadEnv };
