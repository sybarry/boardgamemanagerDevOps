import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BoardGameService } from '../service/board-game.service';

import { BoardGameComponent } from './board-game.component';

describe('BoardGame Management Component', () => {
  let comp: BoardGameComponent;
  let fixture: ComponentFixture<BoardGameComponent>;
  let service: BoardGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'board-game', component: BoardGameComponent }]),
        HttpClientTestingModule,
        BoardGameComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BoardGameComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BoardGameComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BoardGameService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.boardGames?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to boardGameService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBoardGameIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBoardGameIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
