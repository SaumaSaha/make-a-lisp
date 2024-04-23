const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { readStr } = require("./reader");
const { prStr } = require("./printer");

const rl = readline.createInterface({ input, output });

const READ = (str) => {
  return readStr(str);
};
const EVAL = (str) => str;
const PRINT = (str) => prStr(str);

const rep = (str) => PRINT(EVAL(READ(str)));

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
