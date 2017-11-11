import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

import { AuthService } from '../services/auth.service';
import { ChannelsService } from '../services/channels.service';

import { AuthUser } from '../models/user';
import { Channel } from '../models/channel';

@Injectable()
export class ChannelGuard implements CanActivate {

    constructor(private authService: AuthService, private channelsService: ChannelsService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const path = state.url.split('/');
        return this.authService.getAuthState().combineLatest(this.channelsService.getChannel(path[2]), (user: AuthUser, channel: Channel) => {
            const res = user.canEdit(channel);
            if (!res) {
                this.router.navigate(['/channel/', path[2]]);
            }
            return res;
        });
    }
}
