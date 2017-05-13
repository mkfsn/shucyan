import {Component} from '@angular/core';

declare var require: any;

@Component({
    selector: 'about',
    template: require('./about.html')
})
export class AboutComponent {}

