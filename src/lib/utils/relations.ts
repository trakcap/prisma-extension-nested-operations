import { DMMF, DMMFField } from "../types";

let relationsByModel: Record<string, DMMFField[]> | undefined;
export function getRelationsByModel(dmmf: DMMF) {
  if (!relationsByModel) {
    relationsByModel = dmmf.datamodel.models.reduce(
      (acc, model) => {
        acc[model.name] = model.fields.filter((field) => field.kind === "object" && field.relationName);
        return acc;
      },
      {} as Record<string, DMMFField[]>,
    );
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
