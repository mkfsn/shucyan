import {Component} from '@angular/core';

declare var require: any;

@Component({
    selector: 'sidebar',
    template: require('./sidebar.html')
})
export class SidebarComponent {}
