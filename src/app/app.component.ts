import { Component, Injectable, Output, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';
import { AppConstants } from './app.constants';

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
  static isLoad = true;

  @Input()
  static typeComponent = null;


  constructor(
    private http: HttpClient
    , private sanitizer: DomSanitizer) {
  }

  get staticIsLoad() {
    return this.dataCV != null && AppComponent.isLoad;
  }

  get staticTypeComponent() {
    return AppComponent.typeComponent;
  }

  ngOnInit(): void {
    this.http.get(AppConstants.pathUrlFileInfo).subscribe(data => {
      this.dataCV = data;
      AppComponent.isLoad = false;
    });
  }
}
