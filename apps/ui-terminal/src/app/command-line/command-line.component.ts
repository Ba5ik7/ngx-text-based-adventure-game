import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, mergeMap } from 'rxjs';
import { CommandLineService } from './services/command-line.service';

@Component({
  selector: 'ngx-command-line',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="crt">
      <div
        #commandLineDiv
        class="terminal-container"
        [ngClass]="initCommandLineInput$ | async"
      ></div>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        animation: turn-on 4s linear;
        animation-fill-mode: forwards;
      }
      .terminal-container {
        max-width: 720px;
        height: 100vh;
        overflow-y: hidden !important;
      }
      .crt {
        height: 100vh;
        animation: textShadow 1.6s infinite;
        &::before,
        &::after {
          content: ' ';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 2;
          pointer-events: none;
        }
        &::before {
          background: linear-gradient(
              rgba(18, 16, 16, 0) 50%,
              rgba(0, 0, 0, 0.25) 50%
            ),
            linear-gradient(
              90deg,
              rgba(255, 0, 0, 0.06),
              rgba(0, 255, 0, 0.02),
              rgba(0, 0, 255, 0.06)
            );
          background-size: 100% 2px, 3px 100%;
        }
        // flicker effect is cool. But! It could be to annoying
        // &::after {
        // background: rgba(18, 16, 16, 0.1);
        // opacity: 0;
        // animation: flicker 0.15s infinite;
        // }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandLineComponent {
  commandLineService = inject(CommandLineService);
  commandLineSignal = viewChild.required<ElementRef>('commandLineDiv');

  initCommandLineInput$ = toObservable(this.commandLineSignal).pipe(
    mergeMap((commandLineDiv) =>
      this.commandLineService.initCommandLine(commandLineDiv)
    ), // side effects 😞
    map(() => 'inited')
  );
}
