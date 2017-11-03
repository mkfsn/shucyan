import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-channel-overview',
    templateUrl: './channel-overview.component.html',
    styleUrls: ['./channel-overview.component.scss']
})
export class ChannelOverviewComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    newChannel(name: string, description: string) {
        console.log(name, description);
    }

}
