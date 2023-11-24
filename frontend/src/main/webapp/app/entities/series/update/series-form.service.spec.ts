import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../series.test-samples';

import { SeriesFormService } from './series-form.service';

describe('Series Form Service', () => {
  let service: SeriesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesFormService);
  });

  describe('Service methods', () => {
    describe('createSeriesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSeriesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing ISeries should create a new form with FormGroup', () => {
        const formGroup = service.createSeriesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getSeries', () => {
      it('should return NewSeries for default Series initial value', () => {
        const formGroup = service.createSeriesFormGroup(sampleWithNewData);

        const series = service.getSeries(formGroup) as any;

        expect(series).toMatchObject(sampleWithNewData);
      });

      it('should return NewSeries for empty Series initial value', () => {
        const formGroup = service.createSeriesFormGroup();

        const series = service.getSeries(formGroup) as any;

        expect(series).toMatchObject({});
      });

      it('should return ISeries', () => {
        const formGroup = service.createSeriesFormGroup(sampleWithRequiredData);

        const series = service.getSeries(formGroup) as any;

        expect(series).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISeries should not enable id FormControl', () => {
        const formGroup = service.createSeriesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSeries should disable id FormControl', () => {
        const formGroup = service.createSeriesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
