import { inject } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { of, EMPTY, Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { ISeries } from "../series.model";
import { SeriesService } from "../service/series.service";

export const seriesResolve = (
  route: ActivatedRouteSnapshot,
): Observable<null | ISeries> => {
  const id = route.params["id"];
  if (id) {
    return inject(SeriesService)
      .find(id)
      .pipe(
        mergeMap((series: HttpResponse<ISeries>) => {
          if (series.body) {
            return of(series.body);
          } else {
            inject(Router).navigate(["404"]);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default seriesResolve;
