import { ISeries } from 'app/entities/series/series.model';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { ICategory } from 'app/entities/category/category.model';

export interface IBoardGame {
  id: number;
  title?: string | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  publicationYear?: number | null;
  minAge?: number | null;
  playingTime?: number | null;
  cover?: string | null;
  coverContentType?: string | null;
  series?: Pick<ISeries, 'id' | 'name'> | null;
  publishers?: Pick<IPublisher, 'id' | 'name'>[] | null;
  categories?: Pick<ICategory, 'id' | 'name'>[] | null;
}

export type NewBoardGame = Omit<IBoardGame, 'id'> & { id: null };
