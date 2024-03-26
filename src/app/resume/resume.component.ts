import { Component, Input, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

  @Input()
  dataCV = null;

  constructor() { }

  ngOnInit(): void {
  }

  GoCv() {
    AppComponent.typeComponent = 'app-cv';
  }
}
