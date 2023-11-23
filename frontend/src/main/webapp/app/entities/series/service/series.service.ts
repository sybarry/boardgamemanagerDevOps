import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { ISeries, NewSeries } from "../series.model";

export type PartialUpdateSeries = Partial<ISeries> & Pick<ISeries, "id">;

export type EntityResponseType = HttpResponse<ISeries>;
export type EntityArrayResponseType = HttpResponse<ISeries[]>;

@Injectable({ providedIn: "root" })
export class SeriesService {
  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/series");

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(series: NewSeries): Observable<EntityResponseType> {
    return this.http.post<ISeries>(this.resourceUrl, series, {
      observe: "response",
    });
  }

  update(series: ISeries): Observable<EntityResponseType> {
    return this.http.put<ISeries>(
      `${this.resourceUrl}/${this.getSeriesIdentifier(series)}`,
      series,
      { observe: "response" },
    );
  }

  partialUpdate(series: PartialUpdateSeries): Observable<EntityResponseType> {
    return this.http.patch<ISeries>(
      `${this.resourceUrl}/${this.getSeriesIdentifier(series)}`,
      series,
      { observe: "response" },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISeries>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISeries[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  getSeriesIdentifier(series: Pick<ISeries, "id">): number {
    return series.id;
  }

  compareSeries(
    o1: Pick<ISeries, "id"> | null,
    o2: Pick<ISeries, "id"> | null,
  ): boolean {
    return o1 && o2
      ? this.getSeriesIdentifier(o1) === this.getSeriesIdentifier(o2)
      : o1 === o2;
  }

  addSeriesToCollectionIfMissing<Type extends Pick<ISeries, "id">>(
    seriesCollection: Type[],
    ...seriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const series: Type[] = seriesToCheck.filter(isPresent);
    if (series.length > 0) {
      const seriesCollectionIdentifiers = seriesCollection.map(
        (seriesItem) => this.getSeriesIdentifier(seriesItem)!,
      );
      const seriesToAdd = series.filter((seriesItem) => {
        const seriesIdentifier = this.getSeriesIdentifier(seriesItem);
        if (seriesCollectionIdentifiers.includes(seriesIdentifier)) {
          return false;
        }
        seriesCollectionIdentifiers.push(seriesIdentifier);
        return true;
      });
      return [...seriesToAdd, ...seriesCollection];
    }
    return seriesCollection;
  }
}
