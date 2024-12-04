import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private spotifyService: SpotifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract authorization code from the URL
    this.route.queryParams.subscribe((params) => {
      const code = params['code'];
      if (code) {
        this.spotifyService.exchangeCodeForToken(code).subscribe(
          (response: any) => {
            // Store access token in localStorage/sessionStorage
            localStorage.setItem('spotifyAuthToken', response.access_token);

            this.spotifyService.setToken(response.access_token);

            // Optionally, store the refresh token
            if (response.refresh_token) {
              localStorage.setItem('spotifyRefreshToken', response.refresh_token);
            }

            // Navigate to your main app (e.g., dashboard)
            this.router.navigate(['/home']);
          },
          (error) => {
            console.error('Error exchanging code for token', error);
            // Handle errors (e.g., redirect back to login or show an error message)
            this.router.navigate(['/login']);
          }
        );
      } else {
        console.error('No authorization code found in callback URL');
        this.router.navigate(['/login']);
      }
    });
  }
}
