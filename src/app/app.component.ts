import { Component, Injectable, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http';
import html2canvas from "html2canvas";
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
@Injectable()
export class AppComponent {
  // title = 'ClientApp';
  @Output()
  dataCV = null;
  @Output()
  isPrint = false;
  @Output()
  sizePager = 210;
  @Output()
  stylePrint = null;
  height = 0;

  readonly timeoutPrint = 500;
  readonly pathUrlFile = '/assets/data/';
  constructor(
    private http: HttpClient
    , private sanitizer: DomSanitizer) {
    http.get(this.pathUrlFile + 'dataInfo.json').subscribe(data => {
      this.dataCV = data;
    });
  }

  ngOnInit(): void {
    const params = new URL(location.href).searchParams;
    if (params.get('print') != null) {
      this.sizePager = Number(params.get('print'));
    }
    this.height = Number(document.querySelector('header').clientHeight);
    this.proPrint(false);
  }

  PrintPage() {
    this.proPrint(true, null).then(() => {
      if (!this.isPrint) {
        return;
      }
      setTimeout(() => {
        window.print();
        this.proPrint(false);
      }, this.timeoutPrint);
    });
  }

  PrintImage() {
    this.proPrint(true, 'png').then(() => {
      if (!this.isPrint) {
        return;
      }
      setTimeout(() => {
        this.GetCanvas().then(canvas => {
          let imgData = canvas.toDataURL('image/png', 1);
          let url = URL.createObjectURL(this.dataURItoBlob(imgData));
          window.open(url);
          this.proPrint(false);
        });
      }, this.timeoutPrint);
    });
  }

  PrintPdf() {
    this.proPrint(true, 'pdf').then(() => {
      if (!this.isPrint) {
        return;
      }
      let pdf = new jsPDF.jsPDF('p', 'mm', 'a4');
      var options = {
        pagesplit: true
      };
      setTimeout(() => {
        this.GetCanvas().then(canvas => {
          var imgData = canvas.toDataURL('image/png', 1);
          var imgWidth = 210;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
          var position = 0;
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          pdf.save();
          this.proPrint(false);
        });
      }, this.timeoutPrint);
    });
  }

  private GetCanvas() {
    window.scrollTo(0, 0);
    let body = document.body;
    let html = document.documentElement;
    let maxHeight = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    // return html2canvas(document.body);
    return html2canvas(document.body, {
      width: this.sizePager * 3.779528,
      // windowWidth: 790,
      height: maxHeight,
      // windowHeight: maxHeight
    });
  }

  private async proPrint(isPrint, extensionFile = null) {
    if (extensionFile && isPrint) {
      let urlFile = this.pathUrlFile + 'cv.' + extensionFile;
      await this.http.head(urlFile, { observe: 'response' }).subscribe(
        resp => {
          window.open(urlFile);
        },
        err => {
          this.isPrint = isPrint;
          this.Print();
        }
      );
    }
    else {
      this.isPrint = isPrint;
      this.Print();
    }
  }

  private Print() {
    window.scrollTo(0, 0);
    let page = 'auto';
    if (this.sizePager != null) {
      page = this.sizePager + 'mm';
    }
    this.stylePrint = `<style>
@media print {
  @page {
      size: A4;
      margin: 0;
  }
}`
    this.stylePrint += this.isPrint ? `body {max-width: ${page}; overflow:auto } ngx-simplebar{width: inherit; height: inherit}` : '';
    this.stylePrint += `</style>`;
    this.stylePrint = this.sanitizer.bypassSecurityTrustHtml(this.stylePrint);
  }

  private dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }
}
