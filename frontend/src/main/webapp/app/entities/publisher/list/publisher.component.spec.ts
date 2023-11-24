import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PublisherService } from '../service/publisher.service';

import { PublisherComponent } from './publisher.component';

describe('Publisher Management Component', () => {
  let comp: PublisherComponent;
  let fixture: ComponentFixture<PublisherComponent>;
  let service: PublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'publisher', component: PublisherComponent }]),
        HttpClientTestingModule,
        PublisherComponent,
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
      .overrideTemplate(PublisherComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PublisherComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PublisherService);

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
    expect(comp.publishers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to publisherService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPublisherIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPublisherIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
