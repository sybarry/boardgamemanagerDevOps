import { ISeries, NewSeries } from "./series.model";

export const sampleWithRequiredData: ISeries = {
  id: 17145,
  name: "upon defenseless love",
};

export const sampleWithPartialData: ISeries = {
  id: 5196,
  name: "liquidity demote",
};

export const sampleWithFullData: ISeries = {
  id: 31030,
  name: "circa immense",
};

export const sampleWithNewData: NewSeries = {
  name: "handsome huzzah",
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
