import { Routes } from '@angular/router';
import { TranslateList } from './feature/translate/translate-list/translate-list';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'translate-list',
        pathMatch: 'full'
    },
    {
       path: 'translate-list',
       component: TranslateList
    }
];
