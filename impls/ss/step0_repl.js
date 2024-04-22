const { rl } = require("./readline");

const READ = (str) => str;
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
