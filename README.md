## A very simple object factory

[![Build Status](https://travis-ci.org/nathanstitt/object-factory-bot.svg?branch=master)](https://travis-ci.org/nathanstitt/object-factory-bot)


Uses Proxy objects to create a DSL for object construction.  Requires Proxy support, which is supported by modern browsers and Node 6 and above.  https://caniuse.com/#search=Proxy http://node.green/#ES2015-built-ins-Proxy

```javascript

import { sample } from 'lodash';
import faker from 'faker'; // https://github.com/marak/Faker.js

Factory.define('manufacturer')
    .name(() => sample(['Ford', 'GM', 'Tesla']))

Factory.define('wheel')
    .diameter(Math.round(Math.random() * 6)+ 15)
    .brand(({ parent, parentKey }) => parent[parentKey] ? parent[parentKey][0].brand : sample(['Firestone', 'Cooper', 'Bridgestone']));

Factory.define('car')
    .id(Factory.sequence)
    .owner(() => faker.name.findName())
    .manufacturer(Factory.reference('manufacturer'))
    .wheels(Factory.reference('wheel', 4));

const car = Factory.create('car');
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


## See also:

 * [Rosie](https://github.com/rosiejs/rosie)
 * [FactoryGirl](https://github.com/aexmachina/factory-girl)


Both of the above seem to be fairly complex and oriented towards createing classes.

For my purposes I just wanted a way to create plain objects
