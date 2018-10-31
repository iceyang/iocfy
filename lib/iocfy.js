const util = require('util');
const path = require('path');
const BeanFactory = require('./bean-factory');

const TYPES = {
  NEW_INSTANCE: 'NEW_INSTANCE',
  ONLY_REQUIRED: 'ONLY_REQUIRED',
};

class Iocify {
  constructor() {
    this.beanFactory = new BeanFactory();
    this.isLoaded = false;
  }

  _error(beanName, reason) {
    const msg = `Initial Bean(${beanName}) failed: ${reason}`;
    throw new Error(msg);
  }

  _validateConfig(config) {
    // TODO
    return true;
  }

  _getBeanInstance(beanName, BeanClass, type) {
    if (!type || type === TYPES.NEW_INSTANCE) {
      if (typeof BeanClass === 'function') return new BeanClass();
      this._error(beanName, `is not a class`);
    }
    if (type === TYPES.ONLY_REQUIRED)
      return BeanClass;
    this._error(beanName, `type error. there's not type: ${type}`);
  }

  _defineProperty(beanInstance, property, value) {
    Object.defineProperty(beanInstance, property, {
      value,
      enumerable: true
    });
  }

  _injectBeanFields(beansConfig) {
    Object.keys(beansConfig).forEach(beanName => {
      const beanConfig = beansConfig[beanName];
      const beanInstance = this.beanFactory.get(beanName);
      const beanFieldsConfig = beanConfig.beans;
      if (!beanFieldsConfig || Object.keys(beanFieldsConfig).length === 0) return;
      for (const name in beanFieldsConfig) {
        const value = util.isArray(beanFieldsConfig[name]) ?
          beanFieldsConfig[name].map(beanName => this.beanFactory.get(beanName)) :
          this.beanFactory.get(beanFieldsConfig[name]) ;
        this._defineProperty(beanInstance, name, value);
      }
    });
  }

  _injectBeanProperties(beanInstance, beanPropertiesConfig) {
    if (beanPropertiesConfig &&
      Object.keys(beanPropertiesConfig).length !== 0) {
      for (const propertyName in beanPropertiesConfig) {
        const config = beanPropertiesConfig[propertyName];
        this._defineProperty(beanInstance, propertyName, getPropertyValue(config));
      }
    }
    return;
    function getPropertyValue(value) {
      const isEnvValue = value.indexOf('$ENV') === 0;
      if (!isEnvValue) return value;
      const envName = value.replace(/\$ENV\.(.*)/, '$1');
      return process.env[envName];
    }
  }

  _initialBean(beansConfig) {
    Object.keys(beansConfig).forEach(beanName => {
      const beanConfig = beansConfig[beanName];
      const BeanClass = require(path.resolve(beanConfig.class));
      const beanInstance = this._getBeanInstance(beanName, BeanClass, beanConfig.type);
      this._injectBeanProperties(beanInstance, beanConfig.properties);
      this.beanFactory.set(beanName, beanInstance);
    });
  }

  getBean(name) { return this.beanFactory.get(name); }

  load(config) {
    if (this.isLoaded) throw new Error('the beans can only be initialized once');
    this._validateConfig(config);
    const { beans } = config;
    this._initialBean(beans);
    this._injectBeanFields(beans);
    this.isLoaded = true;
  }
}

module.exports = new Iocify();
