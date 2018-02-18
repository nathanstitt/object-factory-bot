const Sequences = require('./sequences');
const Reference = require('./reference');
const getFactory = require('./get-factory');
const propertyFactory = require('./property-factory');

const Factory = {

    get sequence() { return Sequences.identifier; },

    reference(name, count) {
        return new Reference(name, count);
    },

    define(factoryName) {
        let proxy;
        const factory = getFactory(factoryName);
        proxy = new Proxy(factory, {
            get(target, propertyName) {
                return propertyFactory(Factory, factoryName, proxy, target, propertyName);
            },
        });
        return proxy;
    },

    build(factoryName, ctx = {}) {
        const object = {};
        const context = Object.assign({ object }, ctx);
        const factory = getFactory(factoryName);
        Object.keys(factory).forEach((key) => {
            context.key = key;
            object[key] = factory[key](context);
        });
        return object;
    },

};

module.exports = Factory;
