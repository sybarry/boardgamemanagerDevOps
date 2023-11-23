import { TestBed } from "@angular/core/testing";

import {
  sampleWithRequiredData,
  sampleWithNewData,
} from "../board-game.test-samples";

import { BoardGameFormService } from "./board-game-form.service";

describe("BoardGame Form Service", () => {
  let service: BoardGameFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardGameFormService);
  });

  describe("Service methods", () => {
    describe("createBoardGameFormGroup", () => {
      it("should create a new form with FormControl", () => {
        const formGroup = service.createBoardGameFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            minPlayers: expect.any(Object),
            maxPlayers: expect.any(Object),
            publicationYear: expect.any(Object),
            minAge: expect.any(Object),
            playingTime: expect.any(Object),
            cover: expect.any(Object),
            series: expect.any(Object),
            publishers: expect.any(Object),
            categories: expect.any(Object),
          }),
        );
      });

      it("passing IBoardGame should create a new form with FormGroup", () => {
        const formGroup = service.createBoardGameFormGroup(
          sampleWithRequiredData,
        );

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            minPlayers: expect.any(Object),
            maxPlayers: expect.any(Object),
            publicationYear: expect.any(Object),
            minAge: expect.any(Object),
            playingTime: expect.any(Object),
            cover: expect.any(Object),
            series: expect.any(Object),
            publishers: expect.any(Object),
            categories: expect.any(Object),
          }),
        );
      });
    });

    describe("getBoardGame", () => {
      it("should return NewBoardGame for default BoardGame initial value", () => {
        const formGroup = service.createBoardGameFormGroup(sampleWithNewData);

        const boardGame = service.getBoardGame(formGroup) as any;

        expect(boardGame).toMatchObject(sampleWithNewData);
      });

      it("should return NewBoardGame for empty BoardGame initial value", () => {
        const formGroup = service.createBoardGameFormGroup();

        const boardGame = service.getBoardGame(formGroup) as any;

        expect(boardGame).toMatchObject({});
      });

      it("should return IBoardGame", () => {
        const formGroup = service.createBoardGameFormGroup(
          sampleWithRequiredData,
        );

        const boardGame = service.getBoardGame(formGroup) as any;

        expect(boardGame).toMatchObject(sampleWithRequiredData);
      });
    });

    describe("resetForm", () => {
      it("passing IBoardGame should not enable id FormControl", () => {
        const formGroup = service.createBoardGameFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it("passing NewBoardGame should disable id FormControl", () => {
        const formGroup = service.createBoardGameFormGroup(
          sampleWithRequiredData,
        );
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
