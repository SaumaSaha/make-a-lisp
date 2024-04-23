class Env {
  #outer;
  #data;

  constructor(outer, data = {}) {
    this.#outer = outer;
    this.#data = data;
  }

  set(key, value) {
    this.#data[key] = value;
  }

  find(key) {
    const env = this.#data[key] || this.#outer?.find(key);
    if (!env) return this.#outer.find(key);
    return env;
  }

  get(key) {
    const env = this.find(key);

    if (!env) throw new Error("not found");
    return env;
  }
}

module.exports = { Env };
