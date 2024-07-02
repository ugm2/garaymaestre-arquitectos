import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(
    private readonly router: Router,
  ) {}

  public async goHome(): Promise<void> {
    await this.router.navigate(['/']);
  }

}
