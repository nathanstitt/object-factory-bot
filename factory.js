const Sequences = require('./sequences');
const Reference = require('./reference');
const FACTORIES = new Map();

const Factory = {

    get sequence() { return Sequences.identifier; },

    reference(name, count) {
        return new Reference(name, count);
    },

    define(name) {
        let p;
        const vals = Object.create(null);
        FACTORIES.set(name, vals);

        const handler = {
            get: function(target, name, b) {
                return (val) => {
                    target[name] = val;
                    return p
                }
            }
        };
        p = new Proxy(vals, handler);
        return p
    },

    build(name, ctx = {}) {
        const o = Object.assign({}, FACTORIES.get(name));
        Object.keys(o).map(function(key, index) {
            if ('function' === typeof o[key]) {
                o[key] = o[key](Object.assign({object: o, key }, ctx));
            } else if (Sequences.identifier === o[key]) {
                o[key] = Sequences.nextVal(name, key);
            } else if (o[key] instanceof Reference) {
                o[key] = o[key].build(Factory, { parent: o, key });
            }
        });
        return o;
    },

}

module.exports = Factory;
