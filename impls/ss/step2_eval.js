const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { readStr } = require("./reader");
const { prStr } = require("./printer");
const {
  MalList,
  MalValue,
  MalSymbol,
  MalSeq,
  MalVector,
  MalMap,
  MalIdentifier,
  MalKeyword,
} = require("./types");

const rl = readline.createInterface({ input, output });

const replEnv = {
  "+": (args) => new MalValue(args.reduce((a, b) => a + b)),
  "-": (args) => new MalValue(args.reduce((a, b) => a - b)),
  "*": (args) => new MalValue(args.reduce((a, b) => a * b)),
  "/": (args) => new MalValue(args.reduce((a, b) => a / b)),
};

const evalAst = (ast, replEnv) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const handler = replEnv[ast.value];
      if (handler) return handler;
      throw new Error("no value found");
    case ast instanceof MalList:
      return ast.args.map((arg) => EVAL(arg, replEnv));
    case ast instanceof MalVector:
      return new MalVector(...ast.args.map((arg) => EVAL(arg, replEnv)));
    case ast instanceof MalMap:
      return new MalMap(...ast.args.map((arg) => EVAL(arg, replEnv)));
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
  const [fn, ...args] = evalAst(ast, replEnv);

  return fn(args.map((arg) => arg.value));
};

const PRINT = (str) => prStr(str);

const rep = (str) => PRINT(EVAL(READ(str), replEnv));

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
