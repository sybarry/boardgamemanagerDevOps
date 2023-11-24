import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBoardGame, NewBoardGame } from '../board-game.model';

export type PartialUpdateBoardGame = Partial<IBoardGame> & Pick<IBoardGame, 'id'>;

export type EntityResponseType = HttpResponse<IBoardGame>;
export type EntityArrayResponseType = HttpResponse<IBoardGame[]>;

@Injectable({ providedIn: 'root' })
export class BoardGameService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/board-games');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(boardGame: NewBoardGame): Observable<EntityResponseType> {
    return this.http.post<IBoardGame>(this.resourceUrl, boardGame, { observe: 'response' });
  }

  update(boardGame: IBoardGame): Observable<EntityResponseType> {
    return this.http.put<IBoardGame>(`${this.resourceUrl}/${this.getBoardGameIdentifier(boardGame)}`, boardGame, { observe: 'response' });
  }

  partialUpdate(boardGame: PartialUpdateBoardGame): Observable<EntityResponseType> {
    return this.http.patch<IBoardGame>(`${this.resourceUrl}/${this.getBoardGameIdentifier(boardGame)}`, boardGame, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBoardGame>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBoardGame[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBoardGameIdentifier(boardGame: Pick<IBoardGame, 'id'>): number {
    return boardGame.id;
  }

  compareBoardGame(o1: Pick<IBoardGame, 'id'> | null, o2: Pick<IBoardGame, 'id'> | null): boolean {
    return o1 && o2 ? this.getBoardGameIdentifier(o1) === this.getBoardGameIdentifier(o2) : o1 === o2;
  }

  addBoardGameToCollectionIfMissing<Type extends Pick<IBoardGame, 'id'>>(
    boardGameCollection: Type[],
    ...boardGamesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const boardGames: Type[] = boardGamesToCheck.filter(isPresent);
    if (boardGames.length > 0) {
      const boardGameCollectionIdentifiers = boardGameCollection.map(boardGameItem => this.getBoardGameIdentifier(boardGameItem)!);
      const boardGamesToAdd = boardGames.filter(boardGameItem => {
        const boardGameIdentifier = this.getBoardGameIdentifier(boardGameItem);
        if (boardGameCollectionIdentifiers.includes(boardGameIdentifier)) {
          return false;
        }
        boardGameCollectionIdentifiers.push(boardGameIdentifier);
        return true;
      });
      return [...boardGamesToAdd, ...boardGameCollection];
    }
    return boardGameCollection;
  }
}
