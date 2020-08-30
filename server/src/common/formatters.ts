const strToCamelCase = (str: string) =>
  str
    .split('_')
    .map((part, i) =>
      i === 0 ? part : part[0].toLocaleUpperCase().concat(part.slice(1)),
    )
    .join('');

export function toCamelCase<O = any, I = any>(obj: I): O {
  if (obj instanceof Promise) {
    return obj.then((result) => toCamelCase(result)) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((o) => toCamelCase(o)) as any;
  }
  const newObj: any = {};
  for (const key in obj) {
    const newKey = strToCamelCase(key);
    const value = obj[key];
    if (value instanceof Object) {
      newObj[newKey] = toCamelCase(value);
    } else {
      newObj[newKey] = value;
    }
  }
  return newObj;
}

export const CamelCase: MethodDecorator = (
  target,
  propertyKey,
  descriptor: any,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function (...params: any) {
    const returnValue = originalMethod(...params);
    return toCamelCase(returnValue);
  };
  return descriptor;
};
