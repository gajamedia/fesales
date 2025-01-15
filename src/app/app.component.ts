// src/app/main/main.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedloginService } from './services/sharedlogin.service';


@Component({
  selector: 'app-root',   

  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private sharedloginService: SharedloginService) {
  }

  ngOnInit() {
    // Initialize profile data when the app starts
    this.sharedloginService.initializeProfileData();
  }

}