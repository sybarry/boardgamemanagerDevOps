import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISeries } from '../series.model';
import { SeriesService } from '../service/series.service';
import { SeriesFormService, SeriesFormGroup } from './series-form.service';

@Component({
  standalone: true,
  selector: 'jhi-series-update',
  templateUrl: './series-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SeriesUpdateComponent implements OnInit {
  isSaving = false;
  series: ISeries | null = null;

  editForm: SeriesFormGroup = this.seriesFormService.createSeriesFormGroup();

  constructor(
    protected seriesService: SeriesService,
    protected seriesFormService: SeriesFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ series }) => {
      this.series = series;
      if (series) {
        this.updateForm(series);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const series = this.seriesFormService.getSeries(this.editForm);
    if (series.id !== null) {
      this.subscribeToSaveResponse(this.seriesService.update(series));
    } else {
      this.subscribeToSaveResponse(this.seriesService.create(series));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISeries>>): void {
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

  protected updateForm(series: ISeries): void {
    this.series = series;
    this.seriesFormService.resetForm(this.editForm, series);
  }
}
