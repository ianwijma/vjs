export class AbstractClass {
    /**
     * @param {string} methodName
     * @protected
     */
    __undefinedAbstractMethod(methodName) {
        console.error(`Abstract method "${methodName}" is not overwritten`);
    }
}