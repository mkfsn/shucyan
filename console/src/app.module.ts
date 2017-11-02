// Angular
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// routing
import { Routings } from './app.routing';


import { ModalModule } from 'ngx-bootstrap/modal';
import { ResourceModule } from 'ngx-resource';
import { CookieModule } from 'ngx-cookie';

// Third-party
import { BootstrapModalModule  } from 'angular2-modal/plugins/bootstrap';

// APP Component
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

// APP Service
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
        CookieModule.forRoot(),
        BootstrapModalModule,
        Routings
    ],
    providers: [
        Title,
        ChannelService,
        ProgramService
    ]
})

export class AppModule {}
