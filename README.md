## A very simple object factory using proxies


```javascript

import { sample } from 'lodash';
import faker from 'faker'; // https://github.com/marak/Faker.js

Factory.define('manufacturer')
    .name(() => sample(['Ford', 'GM', 'Tesla']))

Factory.define('wheel')
    .diameter(Math.round(Math.random() * 6)+ 15)
    .brand(sample(['Firestone', 'Cooper', 'Bridgestone']));

Factory.define('car')
    .id(Factory.sequence)
    .owner(() => faker.name.findName())
    .manufacturer(Factory.reference('manufacturer'))
    .wheels(Factory.reference('wheel', 4));

const car = Factory.build('car');

console.log(car)
```

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


Both of the above seem to be fairly complex and oriented towards building classes.

For my purposes I just wanted a way to build plain objects
