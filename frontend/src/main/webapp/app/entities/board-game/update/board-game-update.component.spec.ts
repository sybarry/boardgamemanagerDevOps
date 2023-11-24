import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ISeries } from 'app/entities/series/series.model';
import { SeriesService } from 'app/entities/series/service/series.service';
import { IPublisher } from 'app/entities/publisher/publisher.model';
import { PublisherService } from 'app/entities/publisher/service/publisher.service';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IBoardGame } from '../board-game.model';
import { BoardGameService } from '../service/board-game.service';
import { BoardGameFormService } from './board-game-form.service';

import { BoardGameUpdateComponent } from './board-game-update.component';

describe('BoardGame Management Update Component', () => {
  let comp: BoardGameUpdateComponent;
  let fixture: ComponentFixture<BoardGameUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let boardGameFormService: BoardGameFormService;
  let boardGameService: BoardGameService;
  let seriesService: SeriesService;
  let publisherService: PublisherService;
  let categoryService: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BoardGameUpdateComponent],
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
      .overrideTemplate(BoardGameUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BoardGameUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    boardGameFormService = TestBed.inject(BoardGameFormService);
    boardGameService = TestBed.inject(BoardGameService);
    seriesService = TestBed.inject(SeriesService);
    publisherService = TestBed.inject(PublisherService);
    categoryService = TestBed.inject(CategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Series query and add missing value', () => {
      const boardGame: IBoardGame = { id: 456 };
      const series: ISeries = { id: 4773 };
      boardGame.series = series;

      const seriesCollection: ISeries[] = [{ id: 22978 }];
      jest.spyOn(seriesService, 'query').mockReturnValue(of(new HttpResponse({ body: seriesCollection })));
      const additionalSeries = [series];
      const expectedCollection: ISeries[] = [...additionalSeries, ...seriesCollection];
      jest.spyOn(seriesService, 'addSeriesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ boardGame });
      comp.ngOnInit();

      expect(seriesService.query).toHaveBeenCalled();
      expect(seriesService.addSeriesToCollectionIfMissing).toHaveBeenCalledWith(
        seriesCollection,
        ...additionalSeries.map(expect.objectContaining),
      );
      expect(comp.seriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Publisher query and add missing value', () => {
      const boardGame: IBoardGame = { id: 456 };
      const publishers: IPublisher[] = [{ id: 3192 }];
      boardGame.publishers = publishers;

      const publisherCollection: IPublisher[] = [{ id: 11272 }];
      jest.spyOn(publisherService, 'query').mockReturnValue(of(new HttpResponse({ body: publisherCollection })));
      const additionalPublishers = [...publishers];
      const expectedCollection: IPublisher[] = [...additionalPublishers, ...publisherCollection];
      jest.spyOn(publisherService, 'addPublisherToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ boardGame });
      comp.ngOnInit();

      expect(publisherService.query).toHaveBeenCalled();
      expect(publisherService.addPublisherToCollectionIfMissing).toHaveBeenCalledWith(
        publisherCollection,
        ...additionalPublishers.map(expect.objectContaining),
      );
      expect(comp.publishersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Category query and add missing value', () => {
      const boardGame: IBoardGame = { id: 456 };
      const categories: ICategory[] = [{ id: 7142 }];
      boardGame.categories = categories;

      const categoryCollection: ICategory[] = [{ id: 5062 }];
      jest.spyOn(categoryService, 'query').mockReturnValue(of(new HttpResponse({ body: categoryCollection })));
      const additionalCategories = [...categories];
      const expectedCollection: ICategory[] = [...additionalCategories, ...categoryCollection];
      jest.spyOn(categoryService, 'addCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ boardGame });
      comp.ngOnInit();

      expect(categoryService.query).toHaveBeenCalled();
      expect(categoryService.addCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        categoryCollection,
        ...additionalCategories.map(expect.objectContaining),
      );
      expect(comp.categoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const boardGame: IBoardGame = { id: 456 };
      const series: ISeries = { id: 7792 };
      boardGame.series = series;
      const publishers: IPublisher = { id: 28957 };
      boardGame.publishers = [publishers];
      const categories: ICategory = { id: 14384 };
      boardGame.categories = [categories];

      activatedRoute.data = of({ boardGame });
      comp.ngOnInit();

      expect(comp.seriesSharedCollection).toContain(series);
      expect(comp.publishersSharedCollection).toContain(publishers);
      expect(comp.categoriesSharedCollection).toContain(categories);
      expect(comp.boardGame).toEqual(boardGame);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBoardGame>>();
      const boardGame = { id: 123 };
      jest.spyOn(boardGameFormService, 'getBoardGame').mockReturnValue(boardGame);
      jest.spyOn(boardGameService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boardGame });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: boardGame }));
      saveSubject.complete();

      // THEN
      expect(boardGameFormService.getBoardGame).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(boardGameService.update).toHaveBeenCalledWith(expect.objectContaining(boardGame));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBoardGame>>();
      const boardGame = { id: 123 };
      jest.spyOn(boardGameFormService, 'getBoardGame').mockReturnValue({ id: null });
      jest.spyOn(boardGameService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boardGame: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: boardGame }));
      saveSubject.complete();

      // THEN
      expect(boardGameFormService.getBoardGame).toHaveBeenCalled();
      expect(boardGameService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBoardGame>>();
      const boardGame = { id: 123 };
      jest.spyOn(boardGameService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ boardGame });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(boardGameService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSeries', () => {
      it('Should forward to seriesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(seriesService, 'compareSeries');
        comp.compareSeries(entity, entity2);
        expect(seriesService.compareSeries).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePublisher', () => {
      it('Should forward to publisherService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(publisherService, 'comparePublisher');
        comp.comparePublisher(entity, entity2);
        expect(publisherService.comparePublisher).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCategory', () => {
      it('Should forward to categoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(categoryService, 'compareCategory');
        comp.compareCategory(entity, entity2);
        expect(categoryService.compareCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
