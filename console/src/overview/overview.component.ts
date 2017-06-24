import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

declare var require: any;

@Component({
    selector: 'overview',
    template: require('./overview.html')
})
export class OverviewComponent {
    constructor(private titleService: Title) {
        this.titleService.setTitle('週間プログラム');
    }
}
