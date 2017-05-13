import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'my-app',
    template: require('./app.html')
})

export class AppComponent {}
