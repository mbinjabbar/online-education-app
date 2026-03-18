import { Component, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

  dropdownOpen = false;

  get user() { return this.authService.getUser(); }
  get firstName(): string { return this.user?.username?.split(' ')[0] || ''; }
  get userImage(): string | null {
    return this.user?.image ? `${environment.api.baseUrl}/uploads/${this.user.image}` : null;
  }

  isLoggedIn(): boolean { return this.authService.isLoggedIn(); }

  toggleDropdown() { this.dropdownOpen = !this.dropdownOpen; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu')) this.dropdownOpen = false;
  }

  goToProfile() {
    this.dropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  onLogout() {
    this.dropdownOpen = false;
    this.authService.clearSession();
    this.router.navigate(['/login']);
  }
}