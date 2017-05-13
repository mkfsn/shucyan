import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

declare var require: any;

@Component({
    selector: 'channel',
    template: require('./channel.html')
})

export class ChannelComponent {

    private id: string;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.forEach((param: Params) => {
            this.id = param.id;
        });
    }
}
