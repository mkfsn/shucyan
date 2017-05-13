import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { RouterModule  } from '@angular/router';

import { AppComponent } from './app/app.component';
import { HomeComponent } from './home/home.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LatestComponent } from './latest/latest.component';
import { ChannelComponent } from './channel/channel.component';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        SidebarComponent,
        AboutComponent,
        LoginComponent,
        ChannelComponent,
        RegisterComponent,
        LatestComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        RouterModule.forRoot([
            {path: 'home', component: HomeComponent},
            {path: 'about', component: AboutComponent},
            {path: 'latest', component: LatestComponent},
            {path: 'login', component: LoginComponent},
            {path: 'register', component: RegisterComponent},
            {
                path: 'channel/:id',
                component: ChannelComponent
            },
            { path: '**', redirectTo: '/home', pathMatch: 'full' },
        ])
    ]
})

export class AppModule {}
