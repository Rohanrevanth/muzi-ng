import { Component } from '@angular/core';
import { ApiService } from '../../services/test.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  data: any[] = [];
  loading: boolean = false;
  postResponse: any = null;

  constructor(private apiService: ApiService) {}

  fetchData(): void {
    this.loading = true;
    this.apiService.getData().subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.loading = false;
      }
    });
  }
}
