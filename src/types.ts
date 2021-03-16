import { Reference, ReferenceOptions } from './reference'
import { IDENTIFIER } from './sequences'

export interface Factory {
    defaults?: Record<string, any>,
    sequence: typeof IDENTIFIER,
    resetSequences(): void,
    reference(name: string, options?: ReferenceOptions): Reference,
    define(name: string): any,
    create(name: string, values?: Record<string, any>): Record<string, any>,
}
