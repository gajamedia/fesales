import { Component, OnInit } from '@angular/core';
import { LoadingStateService } from '../../services/loading-state.service';

@Component({
  selector: 'app-loading',
  standalone : true,
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  isLoading: boolean = false;  // Local loading state

  constructor(private loadingStateService: LoadingStateService) {}

  ngOnInit(): void {
    // Subscribe to the loading state from the service
    this.loadingStateService.isLoading$.subscribe((loading: boolean) => {
      this.isLoading = loading;
    });
  }
}
