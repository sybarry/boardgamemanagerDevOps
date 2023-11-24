import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: 15573,
  name: 'rouge',
};

export const sampleWithPartialData: ICategory = {
  id: 2865,
  name: 'oh lump phew',
};

export const sampleWithFullData: ICategory = {
  id: 22875,
  name: 'since',
  description: 'a',
};

export const sampleWithNewData: NewCategory = {
  name: 'garage',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
