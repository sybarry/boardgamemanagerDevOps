import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBoardGame } from '../board-game.model';
import { BoardGameService } from '../service/board-game.service';

export const boardGameResolve = (route: ActivatedRouteSnapshot): Observable<null | IBoardGame> => {
  const id = route.params['id'];
  if (id) {
    return inject(BoardGameService)
      .find(id)
      .pipe(
        mergeMap((boardGame: HttpResponse<IBoardGame>) => {
          if (boardGame.body) {
            return of(boardGame.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default boardGameResolve;
