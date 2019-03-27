const Sequences = require('./sequences');
const Reference = require('./reference');
const { getFactory } = require('./factories');
const propertyFactory = require('./property-factory');

let factoryDefaults = {};

const getFactoryDefaults = (name, ctx) => (
    'function' === typeof factoryDefaults ?
        factoryDefaults(name, ctx) : factoryDefaults
);

const Factory = {

    set defaults(d) {
        factoryDefaults = d;
    },

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
        const context = Object.assign(
            { object },
            getFactoryDefaults(factoryName, ctx),
            ctx,
        );
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
