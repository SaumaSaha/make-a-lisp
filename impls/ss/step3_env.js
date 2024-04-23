const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { readStr } = require("./reader");
const { prStr } = require("./printer");
const {
  MalList,
  MalValue,
  MalSymbol,
  MalVector,
  MalMap,
  MalIdentifier,
} = require("./types");
const { Env } = require("./env");

const rl = readline.createInterface({ input, output });

const replEnv = {
  "+": (args) => new MalValue(args.reduce((a, b) => a + b)),
  "-": (args) => new MalValue(args.reduce((a, b) => a - b)),
  "*": (args) => new MalValue(args.reduce((a, b) => a * b)),
  "/": (args) => new MalValue(args.reduce((a, b) => a / b)),
};

const env = new Env(null, { ...replEnv });

const evalAst = (ast, env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const handler = env.get(ast.value);
      if (handler) return new MalValue(handler);
      throw new Error("no value found");
    case ast instanceof MalList:
      return ast.args.map((arg) => EVAL(arg, env));
    case ast instanceof MalVector:
      return new MalVector(...ast.args.map((arg) => EVAL(arg, env)));
    case ast instanceof MalMap:
      return new MalMap(...ast.args.map((arg) => EVAL(arg, env)));
    default:
      return ast;
  }
};

const READ = (str) => {
  return readStr(str);
};

const EVAL = (ast, replEnv) => {
  if (!(ast instanceof MalList)) return evalAst(ast, replEnv);
  if (ast instanceof MalList && ast.isEmpty()) return ast;
  if (ast.args[0].value === "def!") {
    const [_, sec, last] = ast.args;
    replEnv.set(sec.value, last.value);
    return new MalValue(last.value);
  }

  const [fn, ...args] = evalAst(ast, replEnv);
  return fn(args.map((arg) => arg.value));
};

const PRINT = (str) => prStr(str);

const rep = (str) => PRINT(EVAL(READ(str), env));

const repl = () => {
  rl.question("user> ", (input) => {
    if (input.trim() === "EOF") return rl.close();
    try {
      rep(input);
    } catch (error) {
      console.error(error);
    }

    repl();
  });
};

repl();
