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
  return { ast: addBinding(sec, last, replEnv), env: replEnv };
};

const handleLet = (ast, replEnv) => {
  const newEnv = new Env(replEnv);
  const [_, sec, last] = ast.value;
  for (let index = 0; index < sec.value.length; index += 2) {
    const key = sec.value[index];
    const value = sec.value[index + 1];
    addBinding(key, value, newEnv);
  }
  return !last ? { ast: new MalNil(), env: replEnv } : { ast: last, env: newEnv };
};

const handleDo = (ast, replEnv) => {
  const [_, ...rest] = ast.value;
  const list = new MalVector(...rest.slice(0, -1));
  EVAL(list, replEnv);

  return { ast: rest.at(-1), env: replEnv };
};

const handleIf = (ast, replEnv) => {
  const [_, condition, then, otherWise] = ast.value;
  const test = EVAL(condition, replEnv);

  return test.value === false
    ? { ast: otherWise, env: replEnv }
    : { ast: then, env: replEnv };
};

const handleFn = (ast, replEnv) => {
  const [_, parameters, body] = ast.value;
  return { ast: new MalFunc(parameters, body, replEnv), env: replEnv };
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
  while (true) {
    if (!(ast instanceof MalList)) return evalAst(ast, replEnv);
    if (ast instanceof MalList && ast.isEmpty()) return ast;

    switch (true) {
      case isSpecialForm(ast) !== undefined:
        const { ast: newAst, env } = handleSpecialForm(ast, replEnv);
        ast = newAst;
        replEnv = env;
        break;

      default:
        const [fn, ...args] = evalAst(ast, replEnv);
        if (fn instanceof MalFunc) {
          ast = fn.ast;
          replEnv = fn.env.createEnvWithBinds(fn.parameters, args);
          break;
        }
        if (fn instanceof Function) return fn(args);

        throw `${fn} is not a function`;
    }
  }
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
