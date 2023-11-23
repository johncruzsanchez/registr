import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tabs2Page } from './tabs2.page';

const routes: Routes = [
  {
    path: '',
    component: Tabs2Page,
    children:[
      {
        path: 'home2',
        loadChildren: () => import('./home2/home2.module').then( m => m.Home2PageModule)
      },
      {
        path: 'profile2',
        loadChildren: () => import('./profile2/profile2.module').then( m => m.Profile2PageModule)
      },
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tabs2PageRoutingModule {}
