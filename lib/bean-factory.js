const BEANS = Symbol('BEANS');
class BeanFactory {
  constructor() {
    this[BEANS] = {};
  }

  get(name) { return this[BEANS][name]; }

  set(name, bean) {
    const exists = this[BEANS][name] && Object.keys(this[BEANS][name]).length !== 0;
    if (exists) throw new Error(`The bean's name must be unique.`); 
    this[BEANS][name] = bean;
  }
}

module.exports = BeanFactory;
