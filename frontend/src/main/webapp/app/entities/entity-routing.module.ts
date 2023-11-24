import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'board-game',
        data: { pageTitle: 'boardgamemanagerApp.boardGame.home.title' },
        loadChildren: () => import('./board-game/board-game.routes'),
      },
      {
        path: 'category',
        data: { pageTitle: 'boardgamemanagerApp.category.home.title' },
        loadChildren: () => import('./category/category.routes'),
      },
      {
        path: 'publisher',
        data: { pageTitle: 'boardgamemanagerApp.publisher.home.title' },
        loadChildren: () => import('./publisher/publisher.routes'),
      },
      {
        path: 'series',
        data: { pageTitle: 'boardgamemanagerApp.series.home.title' },
        loadChildren: () => import('./series/series.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
