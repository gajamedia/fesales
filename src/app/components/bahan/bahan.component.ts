import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedloginService } from '../../services/sharedlogin.service';
import { BahanService } from '../../services/bahan.service';

@Component({
  selector: 'app-bahan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SharedloginService, BahanService],
  templateUrl: './bahan.component.html',
  styleUrl: './bahan.component.scss'
})
export class BahanComponent {

}
