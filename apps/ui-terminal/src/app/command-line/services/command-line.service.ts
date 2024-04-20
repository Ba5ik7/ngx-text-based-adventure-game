import { ElementRef, Injectable, NgZone, inject } from '@angular/core';
import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { of } from 'rxjs';
import { AdventureGameService } from '../../shared/services/adventure-game.service';
import { initCommands, COMMANDS } from './commands';

const BACKSPACE_SPACE_BACKSPACE = '\b \b';

const enum USER_INPUTS {
  ENTER_KEY = '\r',
  BACKSPACE_KEY = '\x7f',
}

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
  private readonly processCommand = initCommands(this.terminal, this.adventureGameService);

  private commandLineBuffer = '';
  private userInputHandlers = new Map([
      [USER_INPUTS.ENTER_KEY, this.handleEnter.bind(this)],
      [USER_INPUTS.BACKSPACE_KEY, this.handleBackspace.bind(this)],
    ]);

  initCommandLine(terminalDiv: ElementRef) {
    this.zone.runOutsideAngular(() => this.initXtermJs(terminalDiv));
    return of({ initialized: true }); 
  }

  private initXtermJs(terminalDiv: ElementRef) {
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.open(terminalDiv.nativeElement);
    this.fitAddon.fit();
    this.terminal.focus();
    this.terminal.onData((userPrompt) => this.handleUserInput(userPrompt));
  }

  private handleUserInput(userPrompt: unknown) {
    const handler = this.userInputHandlers.get(userPrompt as USER_INPUTS);
    handler ? handler() : this.writeToCommandLineBuffer(userPrompt as string);
  }

  private writeToCommandLineBuffer(data: string) {
    this.commandLineBuffer += data;
    this.terminal.write(data);
  }

  private handleEnter() {
    this.processCommand(this.commandLineBuffer);
    this.commandLineBuffer = '';
  }

  private handleBackspace() {
    if (this.commandLineBuffer.length > 0) {
      this.commandLineBuffer = this.commandLineBuffer.substring(
        0,
        this.commandLineBuffer.length - 1
      );
      this.terminal.write(BACKSPACE_SPACE_BACKSPACE);
    }
  }
}
