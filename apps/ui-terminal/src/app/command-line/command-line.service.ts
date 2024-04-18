import { ElementRef, Injectable, NgZone, inject } from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { IDisposable, Terminal } from '@xterm/xterm';
import { tap } from 'rxjs';
import { HELP, MESSAGE_OF_THE_DAY, HEARTHSTONE } from './static-messages';
import { AdventureGameService } from '../shared/services/adventure-game.service';

const XTERM_OPTIONS = {
  cursorBlink: true,
  fontFamily: 'Cascadia Code, monospace',
  fontSize: 16,
  convertEol: true,
  allowTransparency: true,
  theme: {
    background: 'rgba(0, 0, 0, 0)',
    foreground: '#7bb368',
  },
};
@Injectable({
  providedIn: 'root',
})
export class CommandLineService {
  private readonly adventureGameService = inject(AdventureGameService);
  private readonly zone = inject(NgZone);
  private readonly fitAddon = new FitAddon();
  private readonly terminal = new Terminal(XTERM_OPTIONS);

  private buffer = '';
  private onDataCallBackDisposable: IDisposable | undefined;

  init(terminalDiv: ElementRef) {
    return this.adventureGameService.isGameRunning$.pipe(
      tap((isRunning) => {
        this.zone.runOutsideAngular(() => {
          this.terminal.loadAddon(this.fitAddon);
          this.terminal.open(terminalDiv.nativeElement);
          this.terminal.writeln(MESSAGE_OF_THE_DAY);
          this.fitAddon.fit();
          this.prompt();
          this.terminal.focus();
        });

        if (this.onDataCallBackDisposable) {
          this.onDataCallBackDisposable.dispose();
        }
        this.onDataCallBackDisposable = this.terminal.onData((data) =>
          this.handleInput(data, isRunning)
        );
      })
    );
  }

  prompt() {
    this.buffer = ''; // Reset buffer after processing
    this.terminal.write('$ '); // Write a new line and prompt symbol
  }

  handleInput(data: string, isGameRunning: boolean) {
    // Check if 'Enter' key was pressed
    if (data === '\r' && isGameRunning) {
      this.adventureGameService.sendCommand(this.buffer);
    } else if (data === '\r') {
      // Handle backspace
      this.processCommand(this.buffer);
      this.prompt();
    } else if (data === '\x7f') {
      // Handle backspace
      if (this.buffer.length > 0) {
        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
        this.terminal.write('\b \b'); // Move cursor back, write space to erase, and move back again
      }
    } else {
      this.buffer += data;
      this.terminal.write(data);
    }
  }

  processCommand(command: string) {
    command = command.trim();
    switch (command.toLowerCase()) {
      case 'clear':
        this.terminal.writeln('');
        this.terminal.clear();
        break;
      case 'help':
        this.terminal.writeln(HELP);
        break;
      case 'hearthstone':
        this.adventureGameService.init();
        this.terminal.writeln(`\r`);
        this.terminal.writeln(HEARTHSTONE);
        break;
      default:
        this.terminal.writeln(`\r`);
        this.terminal.writeln(`No such command: ${command}`);
        this.terminal.writeln('Type help to show available commands');
    }
  }
}
