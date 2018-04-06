/* global describe, afterEach, it, expect */
const Sequences = require('./sequences');
const Factory = require('./factory');
const { FactoriesMap } = require('./factories');

describe('Factory', () => {
    afterEach(() => {
        Sequences.map.clear();
        FactoriesMap.clear();
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
            .ima(({ parentProperty }) => parentProperty)
            .parent_id(({ parent }) => parent.object.id);

        Factory.define('many')
            .bar('baz')
            .i(({ index }) => index)
            .same(({ siblings }) => (siblings.length ? siblings[0].same : 'firstValue'));

        Factory.define('parent')
            .id(Factory.sequence)
            .foo('bar')
            .child(Factory.reference('child'))
            .ary(Factory.reference('many', { count: ({ manyCount }) => manyCount }));

        expect(Factory.create('parent', { manyCount: 2 })).toEqual({
            id: 1,
            foo: 'bar',
            child: { one: 1, parent_id: 1, ima: 'child' },
            ary: [{ i: 0, bar: 'baz', same: 'firstValue' }, { i: 1, bar: 'baz', same: 'firstValue' }],
        });
    });

    it('uses context values as defaults', () => {
        Factory.define('child')
            .value('from-factory')
            .otherValue('not-from-factory');
        Factory.define('parent')
            .foo('bar')
            .child(Factory.reference('child'))
            .children(Factory.reference('child', { count: 2 }));

        expect(Factory.create('parent')).toEqual({
            foo: 'bar',
            children: [
                { value: 'from-factory', otherValue: 'not-from-factory' },
                { value: 'from-factory', otherValue: 'not-from-factory' },
            ],
            child: { value: 'from-factory', otherValue: 'not-from-factory' },
        });
        expect(
            Factory.create('parent', {
                children: { value: 'context-provided' },
                child: { value: 'context-provided' },
            }),
        ).toEqual({
            foo: 'bar',
            children: [
                { value: 'context-provided', otherValue: 'not-from-factory' },
                { value: 'context-provided', otherValue: 'not-from-factory' },
            ],
            child: { value: 'context-provided', otherValue: 'not-from-factory' },
        });
    });
});
