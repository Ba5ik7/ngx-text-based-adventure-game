import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { CommandLineService } from './command-line.service';

@Component({
  selector: 'ngx-command-line',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main>
      <div class="crt">
        <div
          #terminalDiv
          class="terminal-container"
          [ngClass]="terminalStyle$ | async"
        ></div>
      </div>
    </main>
  `,
  styleUrl: './command-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandLineComponent {
  commandLineService = inject(CommandLineService);
  terminalSignal = viewChild.required<ElementRef>('terminalDiv');

  terminalStyle$ = toObservable(this.terminalSignal).pipe(
    switchMap((terminalDiv) => this.commandLineService.init(terminalDiv)),
    map(() => 'inited')
  );
}
