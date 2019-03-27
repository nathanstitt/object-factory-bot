const Sequences = require('./sequences');
const Reference = require('./reference');
const { getFactory } = require('./factories');
const propertyFactory = require('./property-factory');

const Factory = {

    defaults: Object.create(null),

    get sequence() { return Sequences.identifier; },

    reference(name, options) {
        return new Reference(name, options);
    },

    define(factoryName) {
        const factory = getFactory(factoryName);
        const proxy = new Proxy(factory, {
            get(target, propertyName) {
                return propertyFactory(Factory, factoryName, proxy, target, propertyName);
            },
        });
        return proxy;
    },

    create(factoryName, ctx = {}) {
        const object = {};
        const defaults = 'function' === typeof Factory.defaults ?
            Factory.defaults(factoryName, ctx) : Factory.defaults;
        const context = Object.assign({ object }, defaults, ctx);
        const factory = getFactory(factoryName);
        Object.keys(factory).forEach((key) => {
            context.key = key;
            if (factory[key].isReference || 'undefined' === typeof ctx[key]) {
                object[key] = factory[key](context);
            } else {
                object[key] = ctx[key];
            }
        });
        return object;
    },

};


module.exports = Factory;
