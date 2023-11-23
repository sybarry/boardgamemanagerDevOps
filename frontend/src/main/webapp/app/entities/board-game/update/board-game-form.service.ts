import { Injectable } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { IBoardGame, NewBoardGame } from "../board-game.model";

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<
  Omit<T, "id">
> & { id: T["id"] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBoardGame for edit and NewBoardGameFormGroupInput for create.
 */
type BoardGameFormGroupInput =
  | IBoardGame
  | PartialWithRequiredKeyOf<NewBoardGame>;

type BoardGameFormDefaults = Pick<
  NewBoardGame,
  "id" | "publishers" | "categories"
>;

type BoardGameFormGroupContent = {
  id: FormControl<IBoardGame["id"] | NewBoardGame["id"]>;
  title: FormControl<IBoardGame["title"]>;
  minPlayers: FormControl<IBoardGame["minPlayers"]>;
  maxPlayers: FormControl<IBoardGame["maxPlayers"]>;
  publicationYear: FormControl<IBoardGame["publicationYear"]>;
  minAge: FormControl<IBoardGame["minAge"]>;
  playingTime: FormControl<IBoardGame["playingTime"]>;
  cover: FormControl<IBoardGame["cover"]>;
  coverContentType: FormControl<IBoardGame["coverContentType"]>;
  series: FormControl<IBoardGame["series"]>;
  publishers: FormControl<IBoardGame["publishers"]>;
  categories: FormControl<IBoardGame["categories"]>;
};

export type BoardGameFormGroup = FormGroup<BoardGameFormGroupContent>;

@Injectable({ providedIn: "root" })
export class BoardGameFormService {
  createBoardGameFormGroup(
    boardGame: BoardGameFormGroupInput = { id: null },
  ): BoardGameFormGroup {
    const boardGameRawValue = {
      ...this.getFormDefaults(),
      ...boardGame,
    };
    return new FormGroup<BoardGameFormGroupContent>({
      id: new FormControl(
        { value: boardGameRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(boardGameRawValue.title, {
        validators: [Validators.required],
      }),
      minPlayers: new FormControl(boardGameRawValue.minPlayers),
      maxPlayers: new FormControl(boardGameRawValue.maxPlayers),
      publicationYear: new FormControl(boardGameRawValue.publicationYear),
      minAge: new FormControl(boardGameRawValue.minAge),
      playingTime: new FormControl(boardGameRawValue.playingTime),
      cover: new FormControl(boardGameRawValue.cover),
      coverContentType: new FormControl(boardGameRawValue.coverContentType),
      series: new FormControl(boardGameRawValue.series),
      publishers: new FormControl(boardGameRawValue.publishers ?? []),
      categories: new FormControl(boardGameRawValue.categories ?? []),
    });
  }

  getBoardGame(form: BoardGameFormGroup): IBoardGame | NewBoardGame {
    return form.getRawValue() as IBoardGame | NewBoardGame;
  }

  resetForm(
    form: BoardGameFormGroup,
    boardGame: BoardGameFormGroupInput,
  ): void {
    const boardGameRawValue = { ...this.getFormDefaults(), ...boardGame };
    form.reset(
      {
        ...boardGameRawValue,
        id: { value: boardGameRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BoardGameFormDefaults {
    return {
      id: null,
      publishers: [],
      categories: [],
    };
  }
}
