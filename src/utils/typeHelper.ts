export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj;
}

export type NestedKeyOf<ObjectType extends object> = 
{[Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
// @ts-ignore 
? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
: `${Key}`
}[keyof ObjectType & (string | number)];
