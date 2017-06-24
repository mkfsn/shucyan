import { Component } from '@angular/core';

declare var require: any;

@Component({
    selector: 'login',
    template: require('./login.html')
})

export class LoginComponent {}
