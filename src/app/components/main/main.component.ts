// src/app/main/main.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: []
})
export class MainComponent{
  

  constructor() {}

  
}