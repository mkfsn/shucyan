import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './overview/overview.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { LatestComponent } from './latest/latest.component';
import { RegisterComponent } from './register/register.component';
import { ChannelComponent } from './channel/channel.component';

const routes: Routes = [
    {
        path: 'home',
        component: OverviewComponent,
        children: [{
            path: '',
            outlet: 'content',
            component: HomeComponent,
        }]
    },
    {
        path: 'about',
        component: OverviewComponent,
        children: [{
            path: '',
            outlet: 'content',
            component: AboutComponent
        }]
    },
    {
        path: 'latest',
        component: OverviewComponent,
        children: [{
            path: '',
            outlet: 'content',
            component: LatestComponent
        }]
    },
    {
        path: 'login',
        component: OverviewComponent,
        children: [{
            path: '',
            outlet: 'content',
            component: LoginComponent
        }]
    },
    {
        path: 'register',
        component: OverviewComponent,
        children: [{
            path: '',
            outlet: 'content',
            component: RegisterComponent
        }]
    },
    {
        path: 'channel/:id',
        component: ChannelComponent
    },
    {
        path: 'channel/:id/edit',
        component: ChannelComponent
    },
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

export const Routings = RouterModule.forRoot(routes);
