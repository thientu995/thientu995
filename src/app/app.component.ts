import { Component, Injectable, Output, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';
import html2canvas from "html2canvas";
import * as jsPDF from 'jspdf';

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

  readonly pathUrlFile = '/assets/data/';
  constructor(
    private http: HttpClient
    , private sanitizer: DomSanitizer) {
    http.get(this.pathUrlFile + 'dataInfo.json').subscribe(data => {
      this.dataCV = data;
      AppComponent.isLoad = false;
    });
  }

  get staticIsLoad() {
    return AppComponent.isLoad;
  }

  get staticTypeComponent() {
    return AppComponent.typeComponent;
  }

  ngOnInit(): void {
  }
}
