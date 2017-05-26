import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'overview',
    template: require('./overview.html')
})
export class OverviewComponent {}
