const { Env } = require("./env");
const { MalValue } = require("./types");

const ns = {
  "+": (args) => new MalValue(args.reduce((a, b) => a + b)),
  "-": (args) => new MalValue(args.reduce((a, b) => a - b)),
  "*": (args) => new MalValue(args.reduce((a, b) => a * b)),
  "/": (args) => new MalValue(args.reduce((a, b) => a / b)),
  "=": ([a, b]) => a === b,
  "<": ([a, b]) => a < b,
  ">": ([a, b]) => a > b,
  "<=": ([a, b]) => a <= b,
  ">=": ([a, b]) => a >= b,
};

const createAndLoadEnv = () => {
  return new Env(null, { ...ns });
};

module.exports = { createAndLoadEnv };
