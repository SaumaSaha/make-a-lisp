const { prStr } = require("./printer");
const { MalList, MalValue, MalSymbol, MalVector } = require("./types");

class Reader {
  #tokens;
  #position;
  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek() {
    return this.#tokens[this.#position];
  }

  next() {
    const token = this.#tokens[this.#position];
    this.#position++;
    return token;
  }
}

const readAtom = (reader) => {
  const currentToken = reader.peek();

  if (/^\d+$/.test(currentToken)) {
    return new MalValue(parseInt(currentToken)); // If the token is all digits
  }

  if (currentToken === "true" || currentToken === "false") {
    return new MalValue(currentToken === "true"); // Convert to boolean value
  }

  if (/^[\Wa-zA-Z]+$/.test(currentToken)) {
    return new MalSymbol(currentToken); // If the token is all letters and symbols
  }

  return MalNil();
};

const readList = (reader, terminator) => {
  const ast = [];
  while (reader.next()) {
    const currentToken = reader.peek();
    if (currentToken === terminator) {
      return terminator === ")" ? new MalList(...ast) : new MalVector(...ast);
    }
    if (!currentToken) throw new Error("unbalanced");
    ast.push(readForm(reader));
  }
};

const readForm = (reader) => {
  const token = reader.peek();
  if (token === "(") return readList(reader, ")");
  if (token === "[") return readList(reader, "]");
  return readAtom(reader);
};

const tokenize = (input) => {
  const regExp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...input.matchAll(regExp)].slice(0, -1).map((match) => match[1].trim());
};

const debugPrint = (value) => {
  console.log(value);
  return value;
};

const readStr = (input) => {
  const tokens = tokenize(input);
  const reader = new Reader(tokens);
  const malType = readForm(reader);
  prStr(malType);

  return malType.prStr();
};

module.exports = { readStr };
