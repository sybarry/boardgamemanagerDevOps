import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

import { SeriesService } from "../service/series.service";

import { SeriesComponent } from "./series.component";

describe("Series Management Component", () => {
  let comp: SeriesComponent;
  let fixture: ComponentFixture<SeriesComponent>;
  let service: SeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: "series", component: SeriesComponent },
        ]),
        HttpClientTestingModule,
        SeriesComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: "id,asc",
            }),
            queryParamMap: of(
              jest.requireActual("@angular/router").convertToParamMap({
                page: "1",
                size: "1",
                sort: "id,desc",
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SeriesComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(SeriesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SeriesService);

    const headers = new HttpHeaders();
    jest.spyOn(service, "query").mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it("Should call load all on init", () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.series?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe("trackId", () => {
    it("Should forward to seriesService", () => {
      const entity = { id: 123 };
      jest.spyOn(service, "getSeriesIdentifier");
      const id = comp.trackId(0, entity);
      expect(service.getSeriesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
