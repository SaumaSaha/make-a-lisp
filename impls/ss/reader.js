const {
  MalList,
  MalValue,
  MalSymbol,
  MalVector,
  MalNil,
  MalString,
  MalMap,
  MalKeyword,
  MalBool,
} = require("./types");

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

  if (currentToken === "nil") {
    return new MalNil(); // If the token is all digits
  }

  if (currentToken === "true" || currentToken === "false") {
    return new MalBool(currentToken === "true"); // Convert to boolean value
  }

  if (/^:/.test(currentToken)) {
    return new MalKeyword(currentToken);
  }

  if (/^".*"$/.test(currentToken)) {
    return new MalString(currentToken);
  }

  if (/^[\Wa-zA-Z]+$/.test(currentToken)) {
    return new MalSymbol(currentToken); // If the token is all letters and symbols
  }

  return new MalValue(parseInt(currentToken));
};

const readList = (reader, terminator) => {
  const ast = [];
  while (reader.next()) {
    const currentToken = reader.peek();
    if (currentToken === terminator) return ast;
    if (!currentToken) throw new Error("unbalanced");
    ast.push(readForm(reader));
  }
};

const readForm = (reader) => {
  const token = reader.peek();

  switch (token) {
    case "(":
      return new MalList(...readList(reader, ")"));
    case "[":
      return new MalVector(...readList(reader, "]"));
    case "{":
      return new MalMap(...readList(reader, "}"));
    default:
      return readAtom(reader);
  }
};

const tokenize = (input) => {
  const regExp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...input.matchAll(regExp)].slice(0, -1).map((match) => match[1].trim());
};

const readStr = (input) => {
  const tokens = tokenize(input);
  const reader = new Reader(tokens);

  return readForm(reader);
};

module.exports = { readStr };
