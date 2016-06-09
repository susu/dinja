
import {getDependencyList} from './dependencies';

const FACTORY_ATTR = '__dinjaFactory__';

export default function getFactory() {
    if (!(FACTORY_ATTR in global))
        global[FACTORY_ATTR] = new Factory();
    return global[FACTORY_ATTR];
}

/**
 * Reset factory unconditionally!
 * Do not use this in production code, useful for testing.
 */
export function resetFactory() {
    global[FACTORY_ATTR] = new Factory();
}

class Factory {
    constructor() {
        console.log('Factory instantiated');
        this._services = {};
        this._serviceFactories = {};
    }

    registerService(serviceName, serviceClass, serviceProvider = null) {
        console.log(`Registering service: ${serviceName}`);
        this._serviceFactories[serviceName] = [serviceClass, serviceProvider];
    }

    create(injectedClass) {
        console.log(`Factory.create: "${injectedClass.name}", ` +
                `dependencies: ${getDependencyList(injectedClass)}`);

        return new injectedClass(...this._getServiceInstancesForClass(injectedClass));
    }

    getService(serviceName) {
        if (!(serviceName in this._services)) {
            const [serviceClass, provider] = this._serviceFactories[serviceName];
            console.log(`Creating service: ${serviceName}`);

            if (provider !== null)
                this._services[serviceName] = provider(...this._getServiceInstancesForClass(serviceClass));
            else
                this._services[serviceName] = this.create(serviceClass);
        }
        return this._services[serviceName];
    }

    _getServiceInstancesForClass(injectedClass) {
        const dependencyList = getDependencyList(injectedClass);
        return this._getServiceInstances(dependencyList);
    }

    _getServiceInstances(dependencyList) {
        let services = [];
        for (const serviceName of dependencyList) {
            services.push(this.getService(serviceName));
        }
        return services;
    }
}
