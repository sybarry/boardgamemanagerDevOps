import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SeriesService } from '../service/series.service';
import { ISeries } from '../series.model';
import { SeriesFormService } from './series-form.service';

import { SeriesUpdateComponent } from './series-update.component';

describe('Series Management Update Component', () => {
  let comp: SeriesUpdateComponent;
  let fixture: ComponentFixture<SeriesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let seriesFormService: SeriesFormService;
  let seriesService: SeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), SeriesUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(SeriesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SeriesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    seriesFormService = TestBed.inject(SeriesFormService);
    seriesService = TestBed.inject(SeriesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const series: ISeries = { id: 456 };

      activatedRoute.data = of({ series });
      comp.ngOnInit();

      expect(comp.series).toEqual(series);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeries>>();
      const series = { id: 123 };
      jest.spyOn(seriesFormService, 'getSeries').mockReturnValue(series);
      jest.spyOn(seriesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ series });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: series }));
      saveSubject.complete();

      // THEN
      expect(seriesFormService.getSeries).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(seriesService.update).toHaveBeenCalledWith(expect.objectContaining(series));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeries>>();
      const series = { id: 123 };
      jest.spyOn(seriesFormService, 'getSeries').mockReturnValue({ id: null });
      jest.spyOn(seriesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ series: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: series }));
      saveSubject.complete();

      // THEN
      expect(seriesFormService.getSeries).toHaveBeenCalled();
      expect(seriesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISeries>>();
      const series = { id: 123 };
      jest.spyOn(seriesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ series });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(seriesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
