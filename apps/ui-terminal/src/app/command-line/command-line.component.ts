import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, tap } from 'rxjs';
import { CommandLineService } from './command-line.service';
import { AdventureGameService } from '../shared/services/adventure-game.service';

@Component({
  selector: 'ngx-command-line',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (viewModel$ | async; as vm) {
    <main>
      <div class="crt">
        <div #terminalDiv class="terminal-container"></div>
      </div>
    </main>
    }
  `,
  styleUrl: './command-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandLineComponent {
  zone = inject(NgZone);
  adventureGameService = inject(AdventureGameService);
  terminalSignal = viewChild<ElementRef>('terminalDiv');

  viewModel$ = combineLatest([
    toObservable(this.terminalSignal),
    this.adventureGameService.pingServer(),
  ]).pipe(
    tap(console.log),
    tap(([terminalDiv]) =>
      this.zone.runOutsideAngular(
        () => terminalDiv && new CommandLineService(terminalDiv).init()
      )
    )
  );
}
