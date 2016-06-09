
import getFactory from './factory';

export default function service(serviceName, serviceProvider = null) {
    return (target, property, descriptor) => {
        getFactory().registerService(serviceName, target, serviceProvider);
        console.log(`Service registered: "${serviceName}"`);
    }
}


