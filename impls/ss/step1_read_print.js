const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { readStr } = require("./reader");

const rl = readline.createInterface({ input, output });

const READ = (str) => {
  try {
    readStr(str);
  } catch (e) {
    console.log(e);
  }
};
const EVAL = (str) => str;
const PRINT = (str) => str;

const rep = (str) => PRINT(EVAL(READ(str)));

const repl = () => {
  rl.question("user> ", (input) => {
    if (input.trim() === "EOF") return rl.close();

    console.log(rep(input));
    repl();
  });
};

repl();
