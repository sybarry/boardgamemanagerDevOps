import { Component, OnInit, ElementRef } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import SharedModule from "app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AlertError } from "app/shared/alert/alert-error.model";
import {
  EventManager,
  EventWithContent,
} from "app/core/util/event-manager.service";
import { DataUtils, FileLoadError } from "app/core/util/data-util.service";
import { ISeries } from "app/entities/series/series.model";
import { SeriesService } from "app/entities/series/service/series.service";
import { IPublisher } from "app/entities/publisher/publisher.model";
import { PublisherService } from "app/entities/publisher/service/publisher.service";
import { ICategory } from "app/entities/category/category.model";
import { CategoryService } from "app/entities/category/service/category.service";
import { BoardGameService } from "../service/board-game.service";
import { IBoardGame } from "../board-game.model";
import {
  BoardGameFormService,
  BoardGameFormGroup,
} from "./board-game-form.service";

@Component({
  standalone: true,
  selector: "jhi-board-game-update",
  templateUrl: "./board-game-update.component.html",
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BoardGameUpdateComponent implements OnInit {
  isSaving = false;
  boardGame: IBoardGame | null = null;

  seriesSharedCollection: ISeries[] = [];
  publishersSharedCollection: IPublisher[] = [];
  categoriesSharedCollection: ICategory[] = [];

  editForm: BoardGameFormGroup =
    this.boardGameFormService.createBoardGameFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected boardGameService: BoardGameService,
    protected boardGameFormService: BoardGameFormService,
    protected seriesService: SeriesService,
    protected publisherService: PublisherService,
    protected categoryService: CategoryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareSeries = (o1: ISeries | null, o2: ISeries | null): boolean =>
    this.seriesService.compareSeries(o1, o2);

  comparePublisher = (o1: IPublisher | null, o2: IPublisher | null): boolean =>
    this.publisherService.comparePublisher(o1, o2);

  compareCategory = (o1: ICategory | null, o2: ICategory | null): boolean =>
    this.categoryService.compareCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ boardGame }) => {
      this.boardGame = boardGame;
      if (boardGame) {
        this.updateForm(boardGame);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils
      .loadFileToForm(event, this.editForm, field, isImage)
      .subscribe({
        error: (err: FileLoadError) =>
          this.eventManager.broadcast(
            new EventWithContent<AlertError>("boardgamemanagerApp.error", {
              ...err,
              key: "error.file." + err.key,
            }),
          ),
      });
  }

  clearInputImage(
    field: string,
    fieldContentType: string,
    idInput: string,
  ): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector("#" + idInput)) {
      this.elementRef.nativeElement.querySelector("#" + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const boardGame = this.boardGameFormService.getBoardGame(this.editForm);
    if (boardGame.id !== null) {
      this.subscribeToSaveResponse(this.boardGameService.update(boardGame));
    } else {
      this.subscribeToSaveResponse(this.boardGameService.create(boardGame));
    }
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IBoardGame>>,
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(boardGame: IBoardGame): void {
    this.boardGame = boardGame;
    this.boardGameFormService.resetForm(this.editForm, boardGame);

    this.seriesSharedCollection =
      this.seriesService.addSeriesToCollectionIfMissing<ISeries>(
        this.seriesSharedCollection,
        boardGame.series,
      );
    this.publishersSharedCollection =
      this.publisherService.addPublisherToCollectionIfMissing<IPublisher>(
        this.publishersSharedCollection,
        ...(boardGame.publishers ?? []),
      );
    this.categoriesSharedCollection =
      this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
        this.categoriesSharedCollection,
        ...(boardGame.categories ?? []),
      );
  }

  protected loadRelationshipsOptions(): void {
    this.seriesService
      .query()
      .pipe(map((res: HttpResponse<ISeries[]>) => res.body ?? []))
      .pipe(
        map((series: ISeries[]) =>
          this.seriesService.addSeriesToCollectionIfMissing<ISeries>(
            series,
            this.boardGame?.series,
          ),
        ),
      )
      .subscribe((series: ISeries[]) => (this.seriesSharedCollection = series));

    this.publisherService
      .query()
      .pipe(map((res: HttpResponse<IPublisher[]>) => res.body ?? []))
      .pipe(
        map((publishers: IPublisher[]) =>
          this.publisherService.addPublisherToCollectionIfMissing<IPublisher>(
            publishers,
            ...(this.boardGame?.publishers ?? []),
          ),
        ),
      )
      .subscribe(
        (publishers: IPublisher[]) =>
          (this.publishersSharedCollection = publishers),
      );

    this.categoryService
      .query()
      .pipe(map((res: HttpResponse<ICategory[]>) => res.body ?? []))
      .pipe(
        map((categories: ICategory[]) =>
          this.categoryService.addCategoryToCollectionIfMissing<ICategory>(
            categories,
            ...(this.boardGame?.categories ?? []),
          ),
        ),
      )
      .subscribe(
        (categories: ICategory[]) =>
          (this.categoriesSharedCollection = categories),
      );
  }
}
