import { IBoardGame } from "app/entities/board-game/board-game.model";

export interface IPublisher {
  id: number;
  name?: string | null;
  games?: Pick<IBoardGame, "id" | "title">[] | null;
}

export type NewPublisher = Omit<IPublisher, "id"> & { id: null };
