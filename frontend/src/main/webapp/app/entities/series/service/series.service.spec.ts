import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISeries } from '../series.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../series.test-samples';

import { SeriesService } from './series.service';

const requireRestSample: ISeries = {
  ...sampleWithRequiredData,
};

describe('Series Service', () => {
  let service: SeriesService;
  let httpMock: HttpTestingController;
  let expectedResult: ISeries | ISeries[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SeriesService);
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

    it('should create a Series', () => {
      const series = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(series).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Series', () => {
      const series = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(series).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Series', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Series', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Series', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSeriesToCollectionIfMissing', () => {
      it('should add a Series to an empty array', () => {
        const series: ISeries = sampleWithRequiredData;
        expectedResult = service.addSeriesToCollectionIfMissing([], series);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(series);
      });

      it('should not add a Series to an array that contains it', () => {
        const series: ISeries = sampleWithRequiredData;
        const seriesCollection: ISeries[] = [
          {
            ...series,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSeriesToCollectionIfMissing(seriesCollection, series);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Series to an array that doesn't contain it", () => {
        const series: ISeries = sampleWithRequiredData;
        const seriesCollection: ISeries[] = [sampleWithPartialData];
        expectedResult = service.addSeriesToCollectionIfMissing(seriesCollection, series);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(series);
      });

      it('should add only unique Series to an array', () => {
        const seriesArray: ISeries[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const seriesCollection: ISeries[] = [sampleWithRequiredData];
        expectedResult = service.addSeriesToCollectionIfMissing(seriesCollection, ...seriesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const series: ISeries = sampleWithRequiredData;
        const series2: ISeries = sampleWithPartialData;
        expectedResult = service.addSeriesToCollectionIfMissing([], series, series2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(series);
        expect(expectedResult).toContain(series2);
      });

      it('should accept null and undefined values', () => {
        const series: ISeries = sampleWithRequiredData;
        expectedResult = service.addSeriesToCollectionIfMissing([], null, series, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(series);
      });

      it('should return initial array if no Series is added', () => {
        const seriesCollection: ISeries[] = [sampleWithRequiredData];
        expectedResult = service.addSeriesToCollectionIfMissing(seriesCollection, undefined, null);
        expect(expectedResult).toEqual(seriesCollection);
      });
    });

    describe('compareSeries', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSeries(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSeries(entity1, entity2);
        const compareResult2 = service.compareSeries(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSeries(entity1, entity2);
        const compareResult2 = service.compareSeries(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSeries(entity1, entity2);
        const compareResult2 = service.compareSeries(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
