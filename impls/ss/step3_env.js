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
  MalNil,
  MalFunc,
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

const addBinding = (key, value, env) => {
  const malValue = EVAL(value, env);
  env.set(key.value, malValue.value);
  return malValue;
};

const handleDef = (ast, replEnv) => {
  const [_, sec, last] = ast.args;
  return addBinding(sec, last, replEnv);
};

const handleLet = (ast, replEnv) => {
  const newEnv = new Env(replEnv);
  const [_, sec, last] = ast.args;
  for (let index = 0; index < sec.args.length; index += 2) {
    const key = sec.args[index];
    const value = sec.args[index + 1];
    addBinding(key, value, newEnv);
  }
  return !last ? new MalNil() : EVAL(last, newEnv);
};

const evalAst = (ast, env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const handler = env.get(ast.value);
      if (handler) return new MalFunc(handler);
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
  const first = ast.args[0].value;
  if (first === "def!") {
    return handleDef(ast, replEnv);
  }
  if (first === "let*") {
    return handleLet(ast, replEnv);
  }

  const [fn, ...args] = evalAst(ast, replEnv);
  return fn.value(args.map((arg) => arg.value));
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
