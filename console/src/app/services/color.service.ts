import * as chroma from 'chroma-js';

import { Injectable } from '@angular/core';

@Injectable()
export class ColorService {

    // color cache
    private colors: Map<string, string>;

    constructor() {
        this.colors = new Map<string, string>();
    }

    // This should be protected by calling getColor()
    private calculateColor(tag: string): string {
        const sum = tag.split('').reduce((acc, val, arr) => acc * val.charCodeAt(0), 0x5F3759DF);
        // NOTE: v / 2 + 128 for displaying brighter color
        // e.g. 4 / 2 + 128 => 130, where 4 is too dark but 130 is not.
        const itoa = (v: number): string => ('00' + Math.floor(v / 2 + 128).toString(16)).substr(-2);
        const b = itoa(sum % 256),
            g = itoa((sum / 256) % 256),
            r = itoa((sum / 256 / 256) % 256);
        return chroma('#' + r + g + b).darker(2).hex();
    }

    public getColor(tag: string): string {
        if (!this.colors.has(tag)) {
            const color = this.calculateColor(tag);
            this.colors.set(tag, color);
        }
        return this.colors.get(tag);
    }

}
