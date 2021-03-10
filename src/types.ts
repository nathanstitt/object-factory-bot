import { Reference, ReferenceOptions, ReferenceContext } from './reference'
import { IDENTIFIER } from './sequences'

export interface Factory {
    defaults?: Record<string, any>,
    sequence: typeof IDENTIFIER,
    reference(name: string, options: ReferenceOptions): Reference,
    define(name: string): any,
    create(name: string, ctx?: ReferenceContext): Record<string, any>,
}
