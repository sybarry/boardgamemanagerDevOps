import { IBoardGame, NewBoardGame } from "./board-game.model";

export const sampleWithRequiredData: IBoardGame = {
  id: 26099,
  title: "recklessly reinvent easy",
};

export const sampleWithPartialData: IBoardGame = {
  id: 14604,
  title: "brr than",
  maxPlayers: 5212,
  cover: "../fake-data/blob/hipster.png",
  coverContentType: "unknown",
};

export const sampleWithFullData: IBoardGame = {
  id: 7894,
  title: "recant outperform",
  minPlayers: 18747,
  maxPlayers: 30942,
  publicationYear: 28513,
  minAge: 24172,
  playingTime: 4582,
  cover: "../fake-data/blob/hipster.png",
  coverContentType: "unknown",
};

export const sampleWithNewData: NewBoardGame = {
  title: "along ferret incompetence",
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
