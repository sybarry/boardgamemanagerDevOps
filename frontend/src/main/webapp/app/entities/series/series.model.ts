export interface ISeries {
  id: number;
  name?: string | null;
}

export type NewSeries = Omit<ISeries, 'id'> & { id: null };
