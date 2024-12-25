import 'reflect-metadata';

export function Controller(target: Function) {
    Reflect.defineMetadata('isController', true, target);
}