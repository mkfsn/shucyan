import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ChannelComponent } from './components/channel/channel.component';
import { ChannelOverviewComponent } from './components/channel/channel-overview.component';

import { AuthGuard } from './guards/auth.guard';
import { ChannelGuard } from './guards/channel.guard';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'about',
        component: HomeComponent
    },
    {
        path: 'latest',
        component: HomeComponent
    },
    {
        path: 'channel',
        component: ChannelOverviewComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'channel/:id',
        component: ChannelComponent
    },
    {
        path: 'channel/demo/edit',
        component: ChannelComponent
    },
    {
        path: 'channel/:id/edit',
        component: ChannelComponent,
        canActivate: [ChannelGuard]
    },
    {
        path: '**',
        redirectTo: '/',
        pathMatch: 'full'
    }
];

export const Routings = RouterModule.forRoot(routes);
