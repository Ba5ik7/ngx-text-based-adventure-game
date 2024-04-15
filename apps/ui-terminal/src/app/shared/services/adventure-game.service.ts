import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdventureGameService {
  private readonly httpClient = inject(HttpClient);

  pingServer() {
    return this.httpClient.get('http://localhost:3000/api/ping').pipe(
      catchError((error) => {
        console.log('Error pinging server', error);
        return of('Error pinging server');
      })
    );
  }
}
