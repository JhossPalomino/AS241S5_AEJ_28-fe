import { Routes } from '@angular/router';
import { TranslateList } from './feature/translate/translate-list/translate-list';
import { TtsList } from './feature/tts/tts-list/tts-list';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'translate-list',
        pathMatch: 'full'
    },
    {
       path: 'translate-list',
       component: TranslateList
    },
    {
        path: 'tts-list',
        component: TtsList
    }
];
