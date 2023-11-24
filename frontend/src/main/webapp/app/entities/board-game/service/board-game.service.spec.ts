import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBoardGame } from '../board-game.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../board-game.test-samples';

import { BoardGameService } from './board-game.service';

const requireRestSample: IBoardGame = {
  ...sampleWithRequiredData,
};

describe('BoardGame Service', () => {
  let service: BoardGameService;
  let httpMock: HttpTestingController;
  let expectedResult: IBoardGame | IBoardGame[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BoardGameService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a BoardGame', () => {
      const boardGame = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(boardGame).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BoardGame', () => {
      const boardGame = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(boardGame).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BoardGame', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BoardGame', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BoardGame', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBoardGameToCollectionIfMissing', () => {
      it('should add a BoardGame to an empty array', () => {
        const boardGame: IBoardGame = sampleWithRequiredData;
        expectedResult = service.addBoardGameToCollectionIfMissing([], boardGame);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(boardGame);
      });

      it('should not add a BoardGame to an array that contains it', () => {
        const boardGame: IBoardGame = sampleWithRequiredData;
        const boardGameCollection: IBoardGame[] = [
          {
            ...boardGame,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBoardGameToCollectionIfMissing(boardGameCollection, boardGame);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BoardGame to an array that doesn't contain it", () => {
        const boardGame: IBoardGame = sampleWithRequiredData;
        const boardGameCollection: IBoardGame[] = [sampleWithPartialData];
        expectedResult = service.addBoardGameToCollectionIfMissing(boardGameCollection, boardGame);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(boardGame);
      });

      it('should add only unique BoardGame to an array', () => {
        const boardGameArray: IBoardGame[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const boardGameCollection: IBoardGame[] = [sampleWithRequiredData];
        expectedResult = service.addBoardGameToCollectionIfMissing(boardGameCollection, ...boardGameArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const boardGame: IBoardGame = sampleWithRequiredData;
        const boardGame2: IBoardGame = sampleWithPartialData;
        expectedResult = service.addBoardGameToCollectionIfMissing([], boardGame, boardGame2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(boardGame);
        expect(expectedResult).toContain(boardGame2);
      });

      it('should accept null and undefined values', () => {
        const boardGame: IBoardGame = sampleWithRequiredData;
        expectedResult = service.addBoardGameToCollectionIfMissing([], null, boardGame, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(boardGame);
      });

      it('should return initial array if no BoardGame is added', () => {
        const boardGameCollection: IBoardGame[] = [sampleWithRequiredData];
        expectedResult = service.addBoardGameToCollectionIfMissing(boardGameCollection, undefined, null);
        expect(expectedResult).toEqual(boardGameCollection);
      });
    });

    describe('compareBoardGame', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBoardGame(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareBoardGame(entity1, entity2);
        const compareResult2 = service.compareBoardGame(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareBoardGame(entity1, entity2);
        const compareResult2 = service.compareBoardGame(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareBoardGame(entity1, entity2);
        const compareResult2 = service.compareBoardGame(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
