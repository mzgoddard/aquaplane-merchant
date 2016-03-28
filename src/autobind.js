export default function autobind(Class) {
  for (const methodName of Object.getOwnPropertyNames(Class.prototype)) {
    if (methodName !== 'constructor') {
      ((method) => {
        Object.defineProperty(Class.prototype, methodName, {
          get: function() {
            if (this === Class.prototype) {return method;}
            const boundMethod = method.bind(this);
            Object.defineProperty(this, methodName, {value: boundMethod});
            return boundMethod;
          },
        });
      })(Class.prototype[methodName]);
    }
  }
  return Class;
}
