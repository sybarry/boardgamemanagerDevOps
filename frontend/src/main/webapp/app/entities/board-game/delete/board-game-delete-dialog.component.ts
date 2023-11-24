import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBoardGame } from '../board-game.model';
import { BoardGameService } from '../service/board-game.service';

@Component({
  standalone: true,
  templateUrl: './board-game-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BoardGameDeleteDialogComponent {
  boardGame?: IBoardGame;

  constructor(
    protected boardGameService: BoardGameService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.boardGameService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
