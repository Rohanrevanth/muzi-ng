import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {

  private CLIENT_ID = "bb7a9d1d649646328dfef40517c4c671"
  private CLIENT_SECRET = "9e336a85e5644407baf24d8739205c65"
  private baseUrl = 'https://api.spotify.com/v1';

  private redirectUri = 'http://localhost:4200/callback'; // Change to your redirect URI
  private authUrl = 'https://accounts.spotify.com/authorize';
  private tokenApi = `https://accounts.spotify.com/api/token`;
  
  private accessToken = '';
  private authToken = '';

  constructor(private http: HttpClient) {
    this.accessToken = localStorage.getItem('spotifyAuthToken') || ""
  }

  getAccessToken() {
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const body = new HttpParams()
        .set('grant_type', 'client_credentials')
        .set('client_id', this.CLIENT_ID)
        .set('client_secret', this.CLIENT_SECRET);
  
      return this.http.post(this.tokenApi, body.toString(), { headers });
  }

  exchangeCodeForToken(code: string) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.redirectUri,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post(this.tokenApi, body.toString(), { headers });
  }

  refreshAccessToken() {
    const refreshToken = localStorage.getItem('spotifyRefreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
    });
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  
    return this.http.post(this.tokenApi, body.toString(), { headers });
  }

  getAuthorizationUrl() {
    // const scope = 'user-read-playback-state user-modify-playback-state streaming';
    const scope = 'user-read-private user-read-email';
    const authParams = new URLSearchParams({
      client_id: this.CLIENT_ID,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope,
    });
    return `${this.authUrl}?${authParams}`;
  }

  getProfile() {
    const url = `${this.baseUrl}/me`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    
    return this.http.get(url, { headers });
  }

  searchItems(query: string, type: string, limit: number = 20) {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<any>(url, { headers });
  }

  getAlbum(albumId: string) {
    const url = `${this.baseUrl}/albums/${albumId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<any>(url, { headers });
  }

  getArtistAlbums(artistId: string) {
    const url = `${this.baseUrl}/artists/${artistId}/albums?limit=5`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<any>(url, { headers });
  }

  getArtistTopTracks(artistId: string) {
    const url = `${this.baseUrl}/artists/${artistId}/top-tracks`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<any>(url, { headers });
  }

  getPlaylist(playlistId: string) {
    const url = `${this.baseUrl}/playlists/${playlistId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<any>(url, { headers });
  }

  playTrack(uri: string) {
    const url = `${this.baseUrl}/me/player/play`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.accessToken}`);
    const body = { uris: [uri] };
    
    return this.http.put(url, body, { headers });
  }

  setToken(token : string) {
    this.accessToken = token
  }
}
