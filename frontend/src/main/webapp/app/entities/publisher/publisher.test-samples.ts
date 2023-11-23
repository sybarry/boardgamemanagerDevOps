import { IPublisher, NewPublisher } from "./publisher.model";

export const sampleWithRequiredData: IPublisher = {
  id: 17766,
  name: "milk closely actually",
};

export const sampleWithPartialData: IPublisher = {
  id: 2074,
  name: "convertible quirkily",
};

export const sampleWithFullData: IPublisher = {
  id: 18221,
  name: "outlandish",
};

export const sampleWithNewData: NewPublisher = {
  name: "experienced",
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
