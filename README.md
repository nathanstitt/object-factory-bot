## A simple object factory

[![Build Status](https://travis-ci.org/nathanstitt/object-factory-bot.svg?branch=master)](https://travis-ci.org/nathanstitt/object-factory-bot)

Uses Proxy objects to create a DSL for object construction.  Requires Proxy support, which is supported by modern browsers and Node 6 and above.  https://caniuse.com/#search=Proxy http://node.green/#ES2015-built-ins-Proxy

```javascript

import { sample } from 'lodash';
import faker from 'faker'; // https://github.com/marak/Faker.js

Factory.define('manufacturer')
    .name(() => sample(['Ford', 'GM', 'Mercedes']))

Factory.define('wheel')
    .diameter(Math.round(Math.random() * 6)+ 15)
    .brand(({ siblings }) => siblings && siblings.length ? siblings[0].brand : sample(['Firestone', 'Cooper', 'Bridgestone']));

Factory.define('car')
    .id(Factory.sequence)
    .owner(() => faker.name.findName())
    .manufacturer(Factory.reference('manufacturer'))
    .wheels(Factory.reference('wheel', { count: 4 }));

const car = Factory.create('car', { owner: 'Jillian West', manufacturer: { name: 'Tesla' } });
```


`car` will be a plain object looking something like:
```
    { id: 1,
      owner: 'Jillian West',
      manufacturer: { name: 'Tesla' },
      wheels:
       [ { diameter: 20, brand: 'Bridgestone' },
         { diameter: 20, brand: 'Bridgestone' },
         { diameter: 20, brand: 'Bridgestone' },
         { diameter: 20, brand: 'Bridgestone' } ] }
```

## References support options:
 * *count*: can be either a function or number.  If not provided, the reference will be a single object.  If provided, the reference will be an array with _count_ elements.
 * *defaults*: Also can be either a function or number.  The default values will override whatever is specified by the referenced child's property values, but will not override the context that is passed into the factory itself.

## See also:

 * [Rosie](https://github.com/rosiejs/rosie)
 * [FactoryGirl](https://github.com/aexmachina/factory-girl)


Both of the above seem to be fairly complex and oriented towards createing classes.

For my purposes I just wanted a way to create plain objects.

I also wanted the property name to appear first in the object specification so that it's easier to read.
