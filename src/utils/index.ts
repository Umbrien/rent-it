type QueryParam = string | string[] | undefined;

export function mapParamToEnum<T extends Record<string, string>>(
  param: QueryParam,
  enumToPair: T
): T[keyof T] | undefined {
  if (Array.isArray(param)) {
    return undefined;
  }

  const statusEnumValue = enumToPair[param as keyof T];
  return statusEnumValue ?? undefined;
}
