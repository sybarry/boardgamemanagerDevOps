import { Routes } from "@angular/router";

import { UserRouteAccessService } from "app/core/auth/user-route-access.service";
import { ASC } from "app/config/navigation.constants";
import { BoardGameComponent } from "./list/board-game.component";
import { BoardGameDetailComponent } from "./detail/board-game-detail.component";
import { BoardGameUpdateComponent } from "./update/board-game-update.component";
import BoardGameResolve from "./route/board-game-routing-resolve.service";

const boardGameRoute: Routes = [
  {
    path: "",
    component: BoardGameComponent,
    data: {
      defaultSort: "id," + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/view",
    component: BoardGameDetailComponent,
    resolve: {
      boardGame: BoardGameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: "new",
    component: BoardGameUpdateComponent,
    resolve: {
      boardGame: BoardGameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ":id/edit",
    component: BoardGameUpdateComponent,
    resolve: {
      boardGame: BoardGameResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default boardGameRoute;
