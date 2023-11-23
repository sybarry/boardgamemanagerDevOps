import { Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { ASC } from "app/config/navigation.constants";
import { SeriesComponent } from "./list/series.component";
import { SeriesDetailComponent } from "./detail/series-detail.component";
import { SeriesUpdateComponent } from "./update/series-update.component";
import SeriesResolve from "./route/series-routing-resolve.service";

const seriesRoute: Routes = [
  {
    path: "",
    component: SeriesComponent,
    data: {
      defaultSort: "id," + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: SeriesDetailComponent,
    resolve: {
      series: SeriesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: SeriesUpdateComponent,
    resolve: {
      series: SeriesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: SeriesUpdateComponent,
    resolve: {
      series: SeriesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default seriesRoute;
