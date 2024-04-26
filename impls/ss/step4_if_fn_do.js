const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { readStr } = require("./reader");
const { prStr } = require("./printer");
const { MalList, MalSymbol, MalVector, MalMap, MalNil, MalFunc } = require("./types");
const { Env } = require("./env");
const { createAndLoadEnv } = require("./core");

const rl = readline.createInterface({ input, output });

const env = createAndLoadEnv();

const addBinding = (key, value, env) => {
  const malValue = EVAL(value, env);
  env.set(key.value, malValue);
  return malValue;
};

const handleDef = (ast, replEnv) => {
  const [_, sec, last] = ast.value;
  return addBinding(sec, last, replEnv);
};

const handleLet = (ast, replEnv) => {
  const newEnv = new Env(replEnv);
  const [_, sec, last] = ast.value;
  for (let index = 0; index < sec.value.length; index += 2) {
    const key = sec.value[index];
    const value = sec.value[index + 1];
    addBinding(key, value, newEnv);
  }
  return !last ? new MalNil() : EVAL(last, newEnv);
};

const handleDo = (ast, replEnv) => {
  const [_, ...rest] = ast.value;
  const list = new MalVector(...rest);
  const evalList = EVAL(list, replEnv);

  return evalList.value.at(-1);
};

const handleIf = (ast, replEnv) => {
  const [_, condition, then, otherWise] = ast.value;
  const test = EVAL(condition, replEnv);

  return test.value === false ? EVAL(otherWise, replEnv) : EVAL(then, replEnv);
};

const handleFn = (ast, replEnv) => {
  const [_, parameters, body] = ast.value;
  const fn = (args) => {
    const newEnv = replEnv.createEnvWithBinds(parameters, args);
    return EVAL(body, newEnv);
  };
  return new MalFunc(fn);
};

const specialForms = {
  "def!": handleDef,
  "let*": handleLet,
  "do": handleDo,
  "if": handleIf,
  "fn*": handleFn,
};

const handleSpecialForm = (ast, replEnv) => {
  const first = ast.value[0].value;
  const specialFormHandler = specialForms[first];
  return specialFormHandler(ast, replEnv);
};

const isSpecialForm = (ast) => specialForms[ast.value[0].value];

const evalAst = (ast, env) => {
  switch (true) {
    case ast instanceof MalSymbol:
      return env.get(ast.value);
    case ast instanceof MalList:
      return ast.value.map((arg) => EVAL(arg, env));
    case ast instanceof MalVector:
      return new MalVector(...ast.value.map((arg) => EVAL(arg, env)));
    case ast instanceof MalMap:
      return new MalMap(...ast.value.map((arg) => EVAL(arg, env)));
    default:
      return ast;
  }
};

const READ = (str) => readStr(str);

const EVAL = (ast, replEnv) => {
  if (!(ast instanceof MalList)) return evalAst(ast, replEnv);
  if (ast instanceof MalList && ast.isEmpty()) return ast;

  if (isSpecialForm(ast)) return handleSpecialForm(ast, replEnv);

  const [fn, ...args] = evalAst(ast, replEnv);
  if (fn instanceof MalFunc) return fn.value(args);
  return fn(args);
};

const PRINT = (str) => prStr(str);

const rep = (str) => PRINT(EVAL(READ(str), env));

rep("(def! not (fn* (a) (if a false true)))");

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
