import { Component, Injectable, Output, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';
import { AppConstants } from './app.constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
@Injectable()
export class AppComponent {
  // title = 'ClientApp';
  @Input()
  dataCV = null;
  
  @Input()
  dataTestimonial = null;
  
  @Input()
  dataService = null;

  @Input()
  static isLoad = true;

  @Input()
  static typeComponent = null;


  constructor(
    private http: HttpClient
    , private sanitizer: DomSanitizer) {
  }

  get staticIsLoad() {
    return this.dataTestimonial != null && this.dataCV != null && AppComponent.isLoad;
  }

  get staticTypeComponent() {
    return AppComponent.typeComponent;
  }

  ngOnInit(): void {
    Promise.all([
      this.getInfo(),
      this.getTestimonials(),
      this.getServices(),
    ]).then(results => {
      this.dataCV = results[0];
      this.dataTestimonial = results[1];
      this.dataService = results[2];
      AppComponent.isLoad = false;
    });
  }

  getInfo(): Promise<any> {
    return this.http.get(AppConstants.pathUrlFileInfo).pipe(map(res => res)).toPromise();
  }
  
  getTestimonials(): Promise<any> {
    return this.http.get(AppConstants.pathUrlFileTestimonials).pipe(map(res => res)).toPromise();
  }
  
  getServices(): Promise<any> {
    return this.http.get(AppConstants.pathUrlFileServices).pipe(map(res => res)).toPromise();
  }
}
