import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
    name: 'safeHtml'
})
export class SafeUrlPipe implements PipeTransform {
    constructor(private domSanitizer: DomSanitizer) { }
    transform(url) {
        return this.domSanitizer.bypassSecurityTrustHtml(url);
    }
}