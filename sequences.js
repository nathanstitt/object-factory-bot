const SEQUENCES = new Map();
const IDENTIFIER = Symbol('sequence');

module.exports = {

    get map() {
        return SEQUENCES;
    },

    get identifier() {
        return IDENTIFIER;
    },

    nextVal(name, key) {
        let map = SEQUENCES.get(name);
        if (!map) {
            map = {};
            SEQUENCES.set(name, map);
        }
        let val = map[key] || (map[key] = 0);
        val += 1;
        map[key] = val;
        return val;
    },

};
