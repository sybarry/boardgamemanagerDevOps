jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BoardGameService } from '../service/board-game.service';

import { BoardGameDeleteDialogComponent } from './board-game-delete-dialog.component';

describe('BoardGame Management Delete Component', () => {
  let comp: BoardGameDeleteDialogComponent;
  let fixture: ComponentFixture<BoardGameDeleteDialogComponent>;
  let service: BoardGameService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BoardGameDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(BoardGameDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BoardGameDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BoardGameService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
