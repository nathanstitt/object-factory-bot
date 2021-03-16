/* global describe, afterEach, it, expect */
import { Sequences } from './sequences'
import Factory from './factory'
import { FactoriesMap } from './factories'

describe('Factory', () => {
    afterEach(() => {
        Sequences.map.clear()
        FactoriesMap.clear()
        Factory.defaults = undefined
    })

    it('sets global defaults', () => {
        Factory.defaults = { one: 1 }
        Factory.define('test').bar(({ one }: any) => one)
        expect(Factory.create('test')).toEqual({ bar: 1 })
    })

    it('copies values', () => {
        const i = {}
        Factory.define('test')
            .bar('baz')
            .foo(42)
            .byValue(i)
        expect(Factory.create('test').byValue).toBe(i)
        expect(Factory.create('test')).toEqual({ bar: 'baz', foo: 42, byValue: i })
    })

    it('calls functions', () => {
        Factory.define('func').id(({ key, size }: { key: string, size: number }) => `${key}_${size}_test`)
        expect(Factory.create('func', { size: 8 })).toEqual({ id: 'id_8_test' })
    })

    it('increments sequences', () => {
        Factory.define('seq')
            .id(Factory.sequence)
            .bar('t')
            .foo(Factory.sequence)

        expect(Factory.create('seq')).toEqual({ id: 1, bar: 't', foo: 1 })
        expect(Factory.create('seq')).toEqual({ id: 2, bar: 't', foo: 2 })
        expect(Factory.create('seq')).toEqual({ id: 3, bar: 't', foo: 3 })
    })

    it('creates references', () => {
        Factory.define('child')
            .one(1)
            .from_default('ignored')
            .ima(({ parentProperty }: any) => parentProperty)
            .parent_id(({ parent }: any) => parent.object.id)

        Factory.define('many')
            .bar('baz')
            .i(({ index }: { index: number }) => index)
            .same(({ siblings }: { siblings: any[] }) => (siblings.length ? siblings[0].same : 'firstValue'))

        Factory.define('parent')
            .id(Factory.sequence)
            .foo('bar')
            .child(Factory.reference('child', { defaults: { from_default: 42 } }))
            .ary(Factory.reference('many', { count: ({ manyCount }: any) => manyCount }))

        expect(Factory.create('parent', { manyCount: 2 })).toEqual({
            id: 1,
            foo: 'bar',
            child: { one: 1, parent_id: 1, ima: 'child', from_default: 42 },
            ary: [{ i: 0, bar: 'baz', same: 'firstValue' }, { i: 1, bar: 'baz', same: 'firstValue' }],
        })

        expect(Factory.create('parent', { manyCount: 0 })).toMatchObject({
            ary: [],
        })
    })

    it('uses context values as defaults', () => {
        Factory.define('child')
            .value('from-factory')
            .otherValue('not-from-factory')
        Factory.define('parent')
            .foo('bar')
            .child(Factory.reference('child'))
            .children(Factory.reference('child', { count: 2 }))

        expect(Factory.create('parent')).toEqual({
            foo: 'bar',
            children: [
                { value: 'from-factory', otherValue: 'not-from-factory' },
                { value: 'from-factory', otherValue: 'not-from-factory' },
            ],
            child: { value: 'from-factory', otherValue: 'not-from-factory' },
        })
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
        })
    })

    it('raise error when factory is unknown', () => {
        expect(() => {
            Factory.create('A BAD NAME')
        }).toThrow('factory "A BAD NAME" has not been created')
    })
})
