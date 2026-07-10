const idSymbol = Symbol("id");
const parentIdSymbol = Symbol("parentId");

function addIdSymbolsToObject(obj: Record<string | symbol, any>, id: number, parentId?: number) {
  obj[idSymbol] = id;
  if (parentId) {
    obj[parentIdSymbol] = parentId;
  }
}

function stripIdSymbolsFromObject(obj: Record<string | symbol, any>) {
  if (obj[idSymbol]) {
    delete obj[idSymbol];
  }
  if (obj[parentIdSymbol]) {
    delete obj[parentIdSymbol];
  }
}

// Only descend into arrays and plain objects. Scalar values that are technically
// `typeof === "object"` (Date, Prisma Decimal, Buffer/Uint8Array, etc.) must not
// be walked: they never hold relations, and tagging them with id symbols is both
// wasted work and pollutes the returned model instances until they are stripped.
function isTraversable(value: any): boolean {
  if (Array.isArray(value)) return true;
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function addIdSymbolsToResult(result: any, parentId?: number, startId = 1): number {
  let id = startId;

  if (Array.isArray(result)) {
    result.forEach((item) => {
      if (isTraversable(item)) {
        addIdSymbolsToObject(item, id, parentId);
        id += 1;

        Object.getOwnPropertyNames(item).forEach((key) => {
          if (isTraversable(item[key])) {
            id = addIdSymbolsToResult(item[key], item[idSymbol], id);
          }
        });
      }
    });

    return id;
  }

  if (isTraversable(result)) {
    addIdSymbolsToObject(result, id, parentId);
    id += 1;

    Object.getOwnPropertyNames(result).forEach((key) => {
      if (isTraversable(result[key])) {
        id = addIdSymbolsToResult(result[key], result[idSymbol], id);
      }
    });
  }

  return id;
}

export function stripIdSymbolsFromResult(result: any) {
  if (Array.isArray(result)) {
    result.forEach((item) => {
      if (isTraversable(item)) {
        stripIdSymbolsFromObject(item);

        Object.getOwnPropertyNames(item).forEach((key) => {
          if (isTraversable(item[key])) {
            stripIdSymbolsFromResult(item[key]);
          }
        });
      }
    });
    return;
  }

  if (isTraversable(result)) {
    stripIdSymbolsFromObject(result);

    Object.getOwnPropertyNames(result).forEach((key) => {
      if (isTraversable(result[key])) {
        stripIdSymbolsFromResult(result[key]);
      }
    });
  }
}

export function getRelationResult(result: any, relations: string[]): any {
  let relationResult = result;

  for (const relation of relations) {
    if (!relationResult) return;

    if (Array.isArray(relationResult)) {
      relationResult = relationResult.flatMap((item) => item[relation]).filter(Boolean);
    } else {
      relationResult = relationResult[relation];
    }
  }

  return relationResult;
}

function injectRelationResult(result: any, relation: string, relationResult: any) {
  if (Array.isArray(relationResult) && Array.isArray(result[relation])) {
    result[relation] = relationResult.filter((item) => item[parentIdSymbol] === result[idSymbol]);
    return;
  }

  if (Array.isArray(relationResult) && !Array.isArray(result[relation])) {
    result[relation] = relationResult.find((item) => item[parentIdSymbol] === result[idSymbol]) || null;
    return;
  }

  if (Array.isArray(result[relation])) {
    throw new Error("Cannot inject a single result into an array result");
  }

  result[relation] = relationResult;
}

export function updateResultRelation(result: any, relation: string, relationResult: any) {
  if (Array.isArray(result)) {
    result.forEach((item) => {
      if (typeof item === "object" && item !== null && item[relation]) {
        injectRelationResult(item, relation, relationResult);
      }
    });

    return result;
  }

  if (typeof result === "object" && result !== null && result[relation]) {
    injectRelationResult(result, relation, relationResult);
  }

  return result;
}
