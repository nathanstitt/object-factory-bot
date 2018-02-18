/* global describe, afterEach, it, expect */
const Sequences = require('./sequences');
const Factory = require('./factory');

describe('Factory', () => {
    afterEach(() => {
        Sequences.map.clear();
    });

    it('copies values', () => {
        const i = {};
        Factory.define('test')
            .bar('baz')
            .foo(42)
            .byValue(i);
        expect(Factory.create('test').byValue).toBe(i);
        expect(Factory.create('test')).toEqual({ bar: 'baz', foo: 42, byValue: i });
    });

    it('calls functions', () => {
        Factory.define('func').id(({ key, size }) => `${key}_${size}_test`);
        expect(Factory.create('func', { size: 8 })).toEqual({ id: 'id_8_test' });
    });

    it('increments sequences', () => {
        Factory.define('seq')
            .id(Factory.sequence)
            .bar('t')
            .foo(Factory.sequence);

        expect(Factory.create('seq')).toEqual({ id: 1, bar: 't', foo: 1 });
        expect(Factory.create('seq')).toEqual({ id: 2, bar: 't', foo: 2 });
        expect(Factory.create('seq')).toEqual({ id: 3, bar: 't', foo: 3 });
    });

    it('creates references', () => {
        Factory.define('child')
            .one(1)
            .ima(({ parentKey }) => parentKey)
            .parent_id(({ parent }) => parent.id);

        Factory.define('many')
            .bar('baz')
            .same(({ parent, parentKey }) => (parent[parentKey] ? parent[parentKey][0].same : 'firstValue'));

        Factory.define('parent')
            .id(Factory.sequence)
            .foo('bar')
            .child(Factory.reference('child'))
            .ary(Factory.reference('many', { count: 2 }));

        expect(Factory.create('parent')).toEqual({
            id: 1,
            foo: 'bar',
            child: { one: 1, parent_id: 1, ima: 'child' },
            ary: [{ bar: 'baz', same: 'firstValue' }, { bar: 'baz', same: 'firstValue' }],
        });
    });
});
