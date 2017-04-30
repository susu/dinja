import dependencies from './dependencies';
import {create, resetFactory, inject} from './factory';
import service from './service';
import {enableDebug, disableDebug} from './debug';

module.exports = {
    dependencies,
    create,
    inject,
    service,
    resetFactory,
    enableDebug,
    disableDebug,
};
