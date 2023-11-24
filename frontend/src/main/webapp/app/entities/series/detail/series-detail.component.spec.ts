import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SeriesDetailComponent } from './series-detail.component';

describe('Series Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: SeriesDetailComponent,
              resolve: { series: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SeriesDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load series on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SeriesDetailComponent);

      // THEN
      expect(instance.series).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
