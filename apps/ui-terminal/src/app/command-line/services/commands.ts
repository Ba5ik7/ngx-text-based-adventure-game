import { Terminal } from '@xterm/xterm';
import { AdventureGameService } from '../../shared/services/adventure-game.service';
import {
  ANGULAR_LOGO,
  HEARTHSTONE,
  HELP,
  MESSAGE_OF_THE_DAY,
} from '../static-messages';

export const enum COMMANDS {
  CLEAR = 'clear',
  HELP = 'help',
  HEARTHSTONE = 'hearthstone',
  INIT = 'init',
  ANGULAR_LOGO = 'angular-logo',
  NEW_LINE = 'new-line',
}

function setCommands(terminal: Terminal, gameService: AdventureGameService) {
  return new Map<COMMANDS, () => void>([
    [COMMANDS.INIT, initCommand(terminal)],
    [COMMANDS.CLEAR, clearCommand(terminal)],
    [COMMANDS.HELP, helpCommand(terminal)],
    [COMMANDS.NEW_LINE, newLine(terminal)],
    [COMMANDS.ANGULAR_LOGO, angularLogoCommand(terminal)],
    [COMMANDS.HEARTHSTONE, hearthstoneCommand(terminal, gameService)],
  ]);
}

function promptUser(terminal: Terminal) {
  return () => {
    terminal.write('$ ');
  };
}

function newLine(terminal: Terminal) {
  return () => {
    terminal.writeln('');
  };
}

function clearCommand(terminal: Terminal) {
  return () => {
    terminal.writeln('\n');
    terminal.clear();
    promptUser(terminal)();
  };
}

function initCommand(terminal: Terminal) {
  return () => {
    terminal.writeln('');
    terminal.writeln(MESSAGE_OF_THE_DAY);
    promptUser(terminal)();
  };
}

function helpCommand(terminal: Terminal) {
  return () => {
    terminal.writeln('');
    terminal.writeln(HELP);
    promptUser(terminal)();
  };
}

function angularLogoCommand(terminal: Terminal) {
  return () => {
    terminal.writeln('');
    terminal.writeln(ANGULAR_LOGO);
    promptUser(terminal)();
  };
}

function hearthstoneCommand(
  terminal: Terminal,
  gameService: AdventureGameService
) {
  return () => {
    terminal.writeln('');
    gameService.initGame();
    terminal.writeln(HEARTHSTONE);
    promptUser(terminal)();
  };
}

function commandHandler(commands: Map<string, () => void>) {
  return (commandKey: string) => {
    const formattedCommand = commandKey.trim().toLowerCase();
    const commandFunction = commands.get(formattedCommand);
    commandFunction ? commandFunction() : commands.get(COMMANDS.HELP)?.();
  };
}

export function initCommands(
  terminal: Terminal,
  gameService: AdventureGameService
) {
  initCommand(terminal)();
  return commandHandler(setCommands(terminal, gameService));
}
