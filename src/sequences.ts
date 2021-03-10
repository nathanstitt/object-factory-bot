const SEQUENCES = new Map<string, Record<string, number>>()
export const IDENTIFIER = Symbol('sequence')

export const Sequences = {

    get map(): Map<string, Record<string, number>> {
        return SEQUENCES
    },

    get identifier(): typeof IDENTIFIER {
        return IDENTIFIER
    },

    nextVal(name: string, key: string): number {
        let map = SEQUENCES.get(name)
        if (!map) {
            map = {}
            SEQUENCES.set(name, map)
        }
        let val = map[key] || (map[key] = 0)
        val += 1
        map[key] = val
        return val
    },

}
