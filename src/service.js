
import getFactory from './factory';

export default function service(serviceName) {
    return (target, property, descriptor) => {
        getFactory().registerService(serviceName, () => new target());
        console.log(`Service registered: "${serviceName}"`);
    }
}


