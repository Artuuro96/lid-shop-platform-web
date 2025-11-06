import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { LoadingService } from 'src/app/services/loading.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './loading-overlay.component.html',
  styles: [
    `
    :host { position: fixed; inset: 0; pointer-events: none; }
    .overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(3px);
      z-index: 2147483647; /* max to ensure visibility above all */
      pointer-events: auto;
    }
    .overlay.no-blur {
      backdrop-filter: none;
      background: transparent;
    }
    .spinner-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 24px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.85);
      box-shadow: 0 6px 24px rgba(0,0,0,0.15);
    }
    .label { font-size: 14px; color: #333; }
    `,
  ],
})
export class LoadingOverlayComponent {
  loading$ = this.loadingService.loading$;
  noBlur = false;

  constructor(private loadingService: LoadingService, private router: Router) {
    this.updateBlurFlag(this.router.url);
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.updateBlurFlag(e.urlAfterRedirects);
      });
  }

  private updateBlurFlag(url: string) {
    // Disable blur specifically on the login route
    this.noBlur = url.startsWith('/authentication/login');
  }
}