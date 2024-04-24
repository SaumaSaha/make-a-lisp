class Env {
  #outer;
  #data;

  constructor(outer, data = {}) {
    this.#outer = outer;
    this.#data = data;
  }

  createFunctionWithBinds(binds, exprs) {
    const data = {};
    binds.args.forEach((element, index) => {
      data[element.value] = exprs[index];
    });

    return new Env(this, data);
  }

  set(key, value) {
    this.#data[key] = value;
  }

  find(key) {
    return this.#data[key] ? this : this.#outer?.find(key);
  }

  get(key) {
    const env = this.find(key);

    if (!env) throw new Error(`${key} not found`);
    return env.#data[key];
  }
}

module.exports = { Env };
