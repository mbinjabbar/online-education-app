import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private isDark = false;

  constructor() {
    const saved = localStorage.getItem('theme');
    this.isDark = saved === 'dark';
    this.applyTheme();
  }

  toggle(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  get darkMode(): boolean {
    return this.isDark;
  }

  private applyTheme(): void {
    const html = document.documentElement;
    if (this.isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}