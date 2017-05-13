import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'latest',
    template: require('./latest.html')
})

export class LatestComponent {}
