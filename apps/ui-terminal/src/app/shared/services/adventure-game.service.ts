import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdventureGameService {
  private readonly httpClient = inject(HttpClient);
  private readonly isGameRunning = new BehaviorSubject<boolean>(false);
  isGameRunning$ = this.isGameRunning.asObservable();

  init() {
    this.isGameRunning.next(true);
  }

  pingServer() {
    return this.httpClient.get('/api/ping').pipe(
      catchError((error) => {
        console.log('Error pinging server', error);
        return of('Error pinging server');
      })
    );
  }

  sendCommand(command: string) {
    return this.httpClient.post('/api/command', { command }).pipe(
      catchError((error) => {
        console.log('Error sending command', error);
        return of('Error sending command');
      })
    );
  }

  exitGame(): boolean {
    this.isGameRunning.next(false);
    return this.isGameRunning.value;
  }
}
