Dinja
=====

[![Build Status](https://travis-ci.org/susu/dinja.svg?branch=master)](https://travis-ci.org/susu/dinja)
[![npm version](https://badge.fury.io/js/dinja.png)](https://badge.fury.io/js/dinja)

A dependency injection library for ES6 with power of decorators and with React support.

Tested compiler: Babel 6 with config:

```json
{
 "presets": ["es2015"],
 "plugins": ["transform-decorators-legacy"],
}
```

Examples:

**NOTE:** for really up-to-date examples, check the test directory.
```js

// mark FooService class as a service:

@service('FooService')
class FooService {
    getText() {
        return 'foobartext';
    }
}

// define Bar class' dependencies

@dependencies(['FooService'])
class Bar {
    constructor(fooService) {
        this._fooService = fooService;
    }

    doBar() {
        return this._fooService.getText();
    }
}

// Instantiate bar; FooService will be instantiated lazily in the background,
// and injected to Bar.
let bar = create(Bar);
bar.doBar();
```

But, the best feature of this library is React (and Flux) support:
```js

// -------- Dispatcher.js --------
// Register your dispatcher
// (since dispatcher is usually defined in external library,
// use the service decorator without the "@" syntax
import {service} from 'dinja';
service('Dispatcher')(Dispatcher)

// Dependency injection will happen in background,
// you don't need to instantiate the dispatcher.

// -------- stores/ItemStore.js --------

// import other stuff ...
import {dependencies, service} from 'dinja';

// Register the store as a service, but define dispatcher as dependency.
// DI will happen in background, you don't need to instantiate the store.

@dependencies(['Dispatcher'])
@service('ItemStore')
class ItemStore extends EventEmitter {
    constructor(dispatcher) {
        this._dispatcher = dispatcher;
        // dispatcher.register, ...
    }
    // ...
}

// -------- components/ItemList.js --------

// import other stuff ...
import {dependencies} from 'dinja';

@dependencies(['ItemStore'])
class ItemList extends React.Component {
    // ...

    componenctDidMount() {
        // itemStore injected in the background
        this.props.itemStore.addChangeListener(this._onItemStoreChange);
    }

    componentWillUnmount() {
        this.props.itemStore.removeChangeListener(this._onItemStoreChange);
    }

    render() {
        // Here you can use the itemStore props, it is injected in the background.
        let items = this.props.itemStore.getItems();
        return (<div></div>); // ... format your JSX, or whatever
    }
}


// in the render method of ItemList's parent component,
// no itemStore prop has to be defined, it is injected seamlessly.
// with JSX:
render() {
    return (<ItemList />);
}

// without JSX:
render() {
    return React.createElement(ItemList, null);
}

```

API reference
-------------

### `dependencies(deps: Array<string>)(targetClass)`

Defines dependencies for a class.
Designed to be used as a decorator.

### `service(serviceName: string, serviceProvider: ((...deps) => T) = null)(targetClass)`

Registers `targetClass` as a service by name `serviceName`.
Designed to be used as a decorator.

`serviceProvider` is a function, that creates a service instance of targetClass.
If the service has dependencies, those are passed to the function.

### `inject(serviceName: string): T`

Returns the instance of the service defined by `serviceName`.

### `create(targetClass): T`

Creates a new instance of `targetClass` with `@dependencies` injected.

### `resetFactory()`

Resets the whole factory, meaning all services, serviceProviders will be deleted.
Useful for testing.

### `enableDebug()`

Enables debug logging to console.

### `disableDebug()`

Disables debug logging to console.
