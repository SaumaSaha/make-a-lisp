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

const readAtom = (reader) => {};

const readList = (reader) => {};

const readForm = (reader) => {
  const token = reader.peek();

  if (token === "(") {
    readList(reader);
  }

  readAtom(reader);
};

const tokenize = (input) => {
  const regExp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...input.matchAll(regExp)].slice(0, -1).map((match) => match[0]);
};

const readStr = (input) => {
  const tokens = tokenize(input);
  const reader = new Reader(tokens);
  console.log(tokens);
  readForm(reader);
};

module.exports = { readStr };
