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
        expect(Factory.build('test').byValue).toBe(i);
        expect(Factory.build('test')).toEqual({ bar: 'baz', foo: 42, byValue: i });
    });

    it('calls functions', () => {
        Factory.define('func').id(({ key }) => `${key}_test`);
        expect(Factory.build('func')).toEqual({ id: 'id_test' });
    });

    it('increments sequences', () => {
        Factory.define('seq')
            .id(Factory.sequence)
            .bar('t')
            .foo(Factory.sequence);

        expect(Factory.build('seq')).toEqual({ id: 1, bar: 't', foo: 1 });
        expect(Factory.build('seq')).toEqual({ id: 2, bar: 't', foo: 2 });
        expect(Factory.build('seq')).toEqual({ id: 3, bar: 't', foo: 3 });
    });

    it('builds references', () => {
        Factory.define('child')
            .one(1)
            .ima(({ parentKey }) => parentKey)
            .parent_id(({ parent }) => parent.id);

        Factory.define('many')
            .bar('baz')
            .same(({ parent, parentKey }) => {
                return parent[parentKey] ? parent[parentKey][0].same : 'firstValue'
            })

        Factory.define('parent')
            .id(Factory.sequence)
            .foo('bar')
            .child(Factory.reference('child'))
            .ary(Factory.reference('many', 2));

        expect(Factory.build('parent')).toEqual({
            id: 1,
            foo: 'bar',
            child: { one: 1, parent_id: 1, ima: 'child' },
            ary: [{ bar: 'baz', same: 'firstValue' }, { bar: 'baz', same: 'firstValue' }],
        });
    });
});
