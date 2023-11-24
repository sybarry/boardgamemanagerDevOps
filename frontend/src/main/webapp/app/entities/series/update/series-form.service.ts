import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISeries, NewSeries } from '../series.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISeries for edit and NewSeriesFormGroupInput for create.
 */
type SeriesFormGroupInput = ISeries | PartialWithRequiredKeyOf<NewSeries>;

type SeriesFormDefaults = Pick<NewSeries, 'id'>;

type SeriesFormGroupContent = {
  id: FormControl<ISeries['id'] | NewSeries['id']>;
  name: FormControl<ISeries['name']>;
};

export type SeriesFormGroup = FormGroup<SeriesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SeriesFormService {
  createSeriesFormGroup(series: SeriesFormGroupInput = { id: null }): SeriesFormGroup {
    const seriesRawValue = {
      ...this.getFormDefaults(),
      ...series,
    };
    return new FormGroup<SeriesFormGroupContent>({
      id: new FormControl(
        { value: seriesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(seriesRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getSeries(form: SeriesFormGroup): ISeries | NewSeries {
    return form.getRawValue() as ISeries | NewSeries;
  }

  resetForm(form: SeriesFormGroup, series: SeriesFormGroupInput): void {
    const seriesRawValue = { ...this.getFormDefaults(), ...series };
    form.reset(
      {
        ...seriesRawValue,
        id: { value: seriesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SeriesFormDefaults {
    return {
      id: null,
    };
  }
}
