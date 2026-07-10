import { DMMF, DMMFField } from "../types";

const cache = new WeakMap<object, Record<string, DMMFField[]>>();
export function getRelationsByModel(dmmf: DMMF) {
  let relationsByModel = cache.get(dmmf);
  if (!relationsByModel) {
    relationsByModel = dmmf.datamodel.models.reduce<Record<string, DMMFField[]>>((acc, model) => {
      acc[model.name] = model.fields.filter((field) => field.kind === "object" && field.relationName);
      return acc;
    }, {});
    cache.set(dmmf, relationsByModel);
  }
  return relationsByModel;
}

export function findOppositeRelation(dmmf: DMMF, relation: DMMFField): DMMFField {
  const parentRelations = getRelationsByModel(dmmf)[relation.type] || [];

  const oppositeRelation = parentRelations.find(
    (parentRelation) => parentRelation !== relation && parentRelation.relationName === relation.relationName,
  );

  if (!oppositeRelation) {
    throw new Error(`Unable to find opposite relation to ${relation.name}`);
  }

  return oppositeRelation;
}
