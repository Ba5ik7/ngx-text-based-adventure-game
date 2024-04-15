import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { CommandLineComponent } from './command-line/command-line.component';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, CommandLineComponent],
  selector: 'ngx-root',
  template: `<ngx-command-line></ngx-command-line>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        // background-color: #3b2c00;
        background-color: #000;
        color: #7bb368;
      }
    `,
  ],
})
export class AppComponent {
  title = 'ui-terminal';
}
