
import getFactory from './factory';
import {log} from './debug';

export default function service(serviceName, serviceProvider = null) {
    return (target, property, descriptor) => {
        getFactory().registerService(serviceName, target, serviceProvider);
        log(`Service registered: "${serviceName}"`);
    }
}


