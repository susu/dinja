
import {getDependencyList} from './dependencies';

const FACTORY_ATTR = '__dinjaFactory__';

export default function getFactory() {
    if (!(FACTORY_ATTR in global))
        global[FACTORY_ATTR] = new Factory();
    return global[FACTORY_ATTR];
}

class Factory {
    constructor() {
        console.log('Factory instantiated');
        this._services = {};
        this._serviceFactories = {};
    }

    registerService(serviceName, serviceFactory) {
        this._serviceFactories[serviceName] = serviceFactory;
    }

    create(injectedClass) {
        console.log(`Factory.create: "${injectedClass.name}", ` +
                `dependencies: ${getDependencyList(injectedClass)}`);

        const dependencyList = getDependencyList(injectedClass);
        return new injectedClass(...this._getServiceInstances(dependencyList));
    }

    getService(serviceName) {
        if (!(serviceName in this._services)) {
            const serviceFactory = this._serviceFactories[serviceName];
            this._services[serviceName] = serviceFactory();
        }
        return this._services[serviceName];
    }

    _getServiceInstances(dependencyList) {
        let services = [];
        for (const serviceName of dependencyList) {
            services.push(this.getService(serviceName));
        }
        return services;
    }
}
