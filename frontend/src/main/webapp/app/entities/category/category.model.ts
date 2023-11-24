import { IBoardGame } from 'app/entities/board-game/board-game.model';

export interface ICategory {
  id: number;
  name?: string | null;
  description?: string | null;
  games?: Pick<IBoardGame, 'id' | 'title'>[] | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
