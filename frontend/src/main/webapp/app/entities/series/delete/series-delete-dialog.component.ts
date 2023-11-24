import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ISeries } from '../series.model';
import { SeriesService } from '../service/series.service';

@Component({
  standalone: true,
  templateUrl: './series-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class SeriesDeleteDialogComponent {
  series?: ISeries;

  constructor(
    protected seriesService: SeriesService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.seriesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
