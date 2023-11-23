import { ICategory, NewCategory } from "./category.model";

export const sampleWithRequiredData: ICategory = {
  id: 7142,
  name: "apud",
};

export const sampleWithPartialData: ICategory = {
  id: 7216,
  name: "ascend till mover",
};

export const sampleWithFullData: ICategory = {
  id: 18349,
  name: "whether fiddle",
  description: "so likewise",
};

export const sampleWithNewData: NewCategory = {
  name: "unless anguished tear",
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
