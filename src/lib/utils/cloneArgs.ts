import { isAnyNull, isDbNull, isJsonNull } from "@prisma/client/runtime/client";
import { cloneDeepWith } from "es-toolkit";

// Prisma v4+ requires that instances of Prisma.NullTypes are not cloned,
// otherwise it will parse them as 'undefined' and the operation will fail.
function passThroughNullTypes(value: any) {
  if (isDbNull(value) || isJsonNull(value) || isAnyNull(value)) {
    return value;
  }
}

export function cloneArgs(args: any) {
  return cloneDeepWith(args, passThroughNullTypes);
}
