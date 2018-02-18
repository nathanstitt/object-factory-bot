const Sequences = require('./sequences');
const Reference = require('./reference');

const FACTORIES = new Map();

const Factory = {

    get sequence() { return Sequences.identifier; },

    reference(name, count) {
        return new Reference(name, count);
    },

    define(factoryName) {
        let p;
        const vals = Object.create(null);
        FACTORIES.set(factoryName, vals);

        const handler = {
            get(target, propertyName) {
                return (val) => {
                    target[propertyName] = val;
                    return p;
                };
            },
        };
        p = new Proxy(vals, handler);
        return p;
    },

    build(factoryName, ctx = {}) {
        const o = Object.assign({}, FACTORIES.get(factoryName));
        Object.keys(o).forEach((key) => {
            if ('function' === typeof o[key]) {
                o[key] = o[key](Object.assign({ object: o, key }, ctx));
            } else if (Sequences.identifier === o[key]) {
                o[key] = Sequences.nextVal(factoryName, key);
            } else if (o[key] instanceof Reference) {
                o[key] = o[key].build(Factory, { parent: o, key });
            }
        });
        return o;
    },

};

module.exports = Factory;
