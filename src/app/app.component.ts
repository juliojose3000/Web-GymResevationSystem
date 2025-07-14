import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Utils } from './utils/utils';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component'
import { SpinnerComponent } from './common/spinner/spinner.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
      HeaderComponent,
      RouterOutlet,
      FooterComponent,
      SpinnerComponent
    ],
})
export class AppComponent {

  title = 'dates-gym';

  // Inject Page
  constructor(private router: Router, private location: LocationStrategy) {

    //Back Action
    router.events.subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        const currentURL = this.router.url;

        // If the side menu is being displayed, so it doesn't go back, only close the side menu
        let isSideMenuDisplaying = (document.getElementById("show-menu") as HTMLInputElement).checked;
        if (isSideMenuDisplaying == true) {
          (document.getElementById("show-menu") as HTMLInputElement).checked = false;
          this.router.navigate([currentURL]);
          history.pushState(null, null, currentURL);
          return;
        }

        /* On the other hand, if the side menu is closed and the current page is some of the follows, so it keeps the 
        user in the current screen */
        switch (currentURL) {
          //case '/reserve':
          case '/home':
            this.router.navigate([currentURL]);
            history.pushState(null, null, currentURL);
            break;
        }
      }
    });

  }


}
