import {Component} from '@angular/core';

declare var require: any;

@Component({
    selector: 'home',
    template: require('./home.html')
})

export class HomeComponent {}
