import { Component, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Data,
  ParamMap,
  Router,
  RouterModule,
} from "@angular/router";
import { combineLatest, filter, Observable, switchMap, tap } from "rxjs";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import SharedModule from "app/shared/shared.module";
import { SortDirective, SortByDirective } from "app/shared/sort";
import {
  DurationPipe,
  FormatMediumDatetimePipe,
  FormatMediumDatePipe,
} from "app/shared/date";
import { FormsModule } from "@angular/forms";
import {
  ASC,
  DESC,
  SORT,
  ITEM_DELETED_EVENT,
  DEFAULT_SORT_DATA,
} from "app/config/navigation.constants";
import { DataUtils } from "app/core/util/data-util.service";
import { SortService } from "app/shared/sort/sort.service";
import { IBoardGame } from "../board-game.model";
import {
  EntityArrayResponseType,
  BoardGameService,
} from "../service/board-game.service";
import { BoardGameDeleteDialogComponent } from "../delete/board-game-delete-dialog.component";

@Component({
  standalone: true,
  selector: "jhi-board-game",
  templateUrl: "./board-game.component.html",
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class BoardGameComponent implements OnInit {
  boardGames?: IBoardGame[];
  isLoading = false;

  predicate = "id";
  ascending = true;

  constructor(
    protected boardGameService: BoardGameService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
  ) {}

  trackId = (_index: number, item: IBoardGame): number =>
    this.boardGameService.getBoardGameIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(boardGame: IBoardGame): void {
    const modalRef = this.modalService.open(BoardGameDeleteDialogComponent, {
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.boardGame = boardGame;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter((reason) => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([
      this.activatedRoute.queryParamMap,
      this.activatedRoute.data,
    ]).pipe(
      tap(([params, data]) =>
        this.fillComponentAttributeFromRoute(params, data),
      ),
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(
    params: ParamMap,
    data: Data,
  ): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(",");
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(
      response.body,
    );
    this.boardGames = this.refineData(dataFromBody);
  }

  protected refineData(data: IBoardGame[]): IBoardGame[] {
    return data.sort(
      this.sortService.startSort(this.predicate, this.ascending ? 1 : -1),
    );
  }

  protected fillComponentAttributesFromResponseBody(
    data: IBoardGame[] | null,
  ): IBoardGame[] {
    return data ?? [];
  }

  protected queryBackend(
    predicate?: string,
    ascending?: boolean,
  ): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.boardGameService
      .query(queryObject)
      .pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(["./"], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(
    predicate = this.predicate,
    ascending = this.ascending,
  ): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === "") {
      return [];
    } else {
      return [predicate + "," + ascendingQueryParam];
    }
  }
}
