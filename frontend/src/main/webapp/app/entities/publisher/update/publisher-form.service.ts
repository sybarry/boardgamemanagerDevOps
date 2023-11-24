import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPublisher, NewPublisher } from '../publisher.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPublisher for edit and NewPublisherFormGroupInput for create.
 */
type PublisherFormGroupInput = IPublisher | PartialWithRequiredKeyOf<NewPublisher>;

type PublisherFormDefaults = Pick<NewPublisher, 'id' | 'games'>;

type PublisherFormGroupContent = {
  id: FormControl<IPublisher['id'] | NewPublisher['id']>;
  name: FormControl<IPublisher['name']>;
  games: FormControl<IPublisher['games']>;
};

export type PublisherFormGroup = FormGroup<PublisherFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PublisherFormService {
  createPublisherFormGroup(publisher: PublisherFormGroupInput = { id: null }): PublisherFormGroup {
    const publisherRawValue = {
      ...this.getFormDefaults(),
      ...publisher,
    };
    return new FormGroup<PublisherFormGroupContent>({
      id: new FormControl(
        { value: publisherRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(publisherRawValue.name, {
        validators: [Validators.required],
      }),
      games: new FormControl(publisherRawValue.games ?? []),
    });
  }

  getPublisher(form: PublisherFormGroup): IPublisher | NewPublisher {
    return form.getRawValue() as IPublisher | NewPublisher;
  }

  resetForm(form: PublisherFormGroup, publisher: PublisherFormGroupInput): void {
    const publisherRawValue = { ...this.getFormDefaults(), ...publisher };
    form.reset(
      {
        ...publisherRawValue,
        id: { value: publisherRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PublisherFormDefaults {
    return {
      id: null,
      games: [],
    };
  }
}
