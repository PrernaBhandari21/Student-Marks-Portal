import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'students-marks-portal';

  showHeaderSidemenu: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routeData = this.activatedRoute.firstChild?.snapshot.data;
        this.showHeaderSidemenu = !routeData || routeData['showHeaderSidemenu'] !== false;
      }

      console.log("Finally this.showHeaderSidemenu", this.showHeaderSidemenu);
    });
  }
}
