import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MsToMinutesPipe } from '../../pipes/ms-to-minutes.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MsToMinutesPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  searchQuery = '';
  searchType = 'track'; // Default search type is 'track'
  searchTypes = ['track','artist','album','playlist']; 
  searchYear = ''; // Optional year filter
  tracks: any[] = [];
  albums: any[] = [];
  artists: any[] = [];
  playlists: any[] = [];
  searched = false;

  isModalOpen: boolean = false;
  selectedItem: any = null;
  selectedItemType: any = null;

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.getToken()
    if(!localStorage.getItem('spotifyAuthToken')) {
      window.location.href = this.spotifyService.getAuthorizationUrl();
    }
  }

  getToken() {
    this.spotifyService.getAccessToken().subscribe({
      next: (response: any) => {
        console.log(response);
        this.spotifyService.setToken(response.access_token);

        this.searchQuery = 'coldplay'
        for (let index = 0; index < this.searchTypes.length; index++) {
          this.searchItems(this.searchTypes[index])
        }

      },
      error: (err) => {
        console.log(err);
        this.getToken()
        alert('Error fetching token');
      },
    });
  }

  globalSearch() {
    for (let index = 0; index < this.searchTypes.length; index++) {
      this.searchItems(this.searchTypes[index])
    }
  }

  searchItems(searchType : any = undefined) {
    if (!this.searchQuery.trim()) {
      return;
    }
    var type;
    if(searchType) {
      type = searchType
    } else {
      type = this.searchType
    }

    var count = 5
    // Call the Spotify service with the query and selected type
    this.spotifyService.searchItems(this.searchQuery, type, count).subscribe({
      next: (response) => {
        if(searchType == 'track')
        this.tracks = response.tracks?.items || [];
        if(searchType == 'album')
          this.albums = response.albums?.items || [];
        if(searchType == 'artist')
          this.artists = response.artists?.items || [];
        if(searchType == 'playlist')
          this.playlists = response.playlists?.items || [];
        this.searched = true;
      },
      error: () => {
        alert('Error fetching items');
      },
    });
  }
  
  openModal(item: any, type: string) {
    console.log(item)
    console.log(type)

    if(type == 'track') {
      this.selectedItem = item;
      this.selectedItemType = type;
      this.isModalOpen = true;
    } 
    else if(type == 'album') {
      this.spotifyService.getAlbum(item.id).subscribe({
        next: (response: any) => {
          console.log(response);
          this.selectedItem = response;
          this.selectedItemType = type;
          this.isModalOpen = true;
        },
        error: (err) => {
          console.log(err);
          alert('Error fetching token');
        },
      });
    }
    else if(type == 'artist') {
      this.spotifyService.getArtistAlbums(item.id).subscribe({
        next: (response: any) => {
          console.log(response);
          item.albums = response.items;
          this.spotifyService.getArtistTopTracks(item.id).subscribe({
            next: (response: any) => {
              console.log(response);
              item.top_tracks = response.tracks;
              this.selectedItem = item;
              this.selectedItemType = type;
              this.isModalOpen = true;
            },
            error: (err) => {
              console.log(err);
              alert('Error fetching token');
            },
          });
        },
        error: (err) => {
          console.log(err);
          alert('Error fetching token');
        },
      });
    }
    else if(type == 'playlist') {
      this.spotifyService.getPlaylist(item.id).subscribe({
        next: (response: any) => {
          console.log(response);
          this.selectedItem = response;
          this.selectedItemType = type;
          this.isModalOpen = true;
        },
        error: (err) => {
          console.log(err);
          alert('Error fetching token');
        },
      });
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  playTrack(trackUri: string): void {
    if (!trackUri) {
      console.warn('No URI provided for this track.');
      return;
    }
    this.spotifyService.playTrack(trackUri).subscribe({
      next: () => {
        alert('Playing track...');
      },
      error: () => {
        alert('Error playing track. Make sure Spotify is active.');
      },
    });
  }

  getArtistsAsString(artists: { name: string }[]): string {
    return artists?.map(artist => artist.name).join(', ') || 'Unknown Artist';
  }

  goToProfile() {

  }

  logout() {
    this.router.navigate(['/login']);
  }
}
