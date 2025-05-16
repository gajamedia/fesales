import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isSidebarCollapsed = false; // Track whether the sidebar is collapsed
  isProfileMenuOpen = false; // Track whether the profile menu is open

  //randomBgColor: string = this.getRandomColor();

  
  constructor(private router: Router) {}

  getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F6', '#33FFF3']; // Tambahkan warna lain sesuai keinginan
    return colors[Math.floor(Math.random() * colors.length)];
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
