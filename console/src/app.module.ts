import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ResourceModule } from 'ngx-resource';

import { AppComponent } from './app/app.component';
import { OverviewComponent } from './overview/overview.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LatestComponent } from './latest/latest.component';
import { ChannelComponent } from './channel/channel.component';
import { ProgramComponent } from './program/program.component';

import { ChannelService } from './service/channel.service';
import { ProgramService } from './service/program.service';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        OverviewComponent,
        HomeComponent,
        SidebarComponent,
        AboutComponent,
        LoginComponent,
        ChannelComponent,
        ProgramComponent,
        RegisterComponent,
        LatestComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
        ResourceModule.forRoot(),
        RouterModule.forRoot([
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
            },
        ])
    ],
    providers: [
        Title,
        ChannelService,
        ProgramService
    ]
})

export class AppModule {}
