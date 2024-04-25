class Env {
  #outer;
  #data;

  constructor(outer, data = {}) {
    this.#outer = outer;
    this.#data = data;
  }

  createEnvWithBinds(binds, exprs) {
    const env = new Env(this);
    console.log(binds, exprs);
    binds.value.forEach((element, index) => {
      env.set(element.value, exprs[index]);
    });

    return env;
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
