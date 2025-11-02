import { Component, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

// ✅ PrimeNG Imports replacing Angular Material
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import type { MenuItem } from 'primeng/api';

interface NavigationModule {
  id: string;
  name: string;
  icon: string;
  route: string;
  description: string;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SidebarModule,
    ToolbarModule,
    ButtonModule,
    CardModule,
    MenuModule,
    TieredMenuModule,
    OverlayPanelModule,
    BadgeModule,
    DividerModule,
    TooltipModule,
    AvatarModule,
    ChipModule
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  sidenavOpened = signal(true);

  ngOnInit(): void {
    try {
      console.log('Shell component initialized successfully');
    } catch (error) {
      console.error('Error initializing shell component:', error);
    }
  }

  modules: NavigationModule[] = [
    { id: 'scholar-graph', name: 'ScholarGraph', icon: 'pi pi-search', route: '/scholar-graph', description: 'AI-powered research discovery' },
    { id: 'citation-network', name: 'Citation Network', icon: 'pi pi-share-alt', route: '/citation-network', description: 'Interactive citation graph visualization' },
    { id: 'library', name: 'Library', icon: 'pi pi-book', route: '/library', description: 'Saved papers collection' },
    { id: 'paper-pilot', name: 'PaperPilot', icon: 'pi pi-file', route: '/paper-pilot', description: 'Literature review assistant' },
    { id: 'omni-ai', name: 'OmniAI Copilot', icon: 'pi pi-robot', route: '/omni-ai', description: 'AI research assistant' },
    { id: 'lab-sync', name: 'LabSync', icon: 'pi pi-comments', route: '/lab-sync', description: 'Real-time collaboration' },
    { id: 'grant-ai', name: 'GrantAI', icon: 'pi pi-dollar', route: '/grant-ai', description: 'Funding finder' },
    { id: 'meta-lab', name: 'MetaLab', icon: 'pi pi-flask', route: '/meta-lab', description: 'Reproducibility tracker' },
    { id: 'data-verse', name: 'DataVerse', icon: 'pi pi-chart-bar', route: '/data-verse', description: 'Data visualization' },
    { id: 'edu-forge', name: 'EduForge', icon: 'pi pi-graduation-cap', route: '/edu-forge', description: 'Learning & mentorship' },
    { id: 'trust-layer', name: 'TrustLayer', icon: 'pi pi-shield', route: '/trust-layer', description: 'Verification & provenance' },
    { id: 'global-knowledge-bridge', name: 'GlobalKnowledgeBridge', icon: 'pi pi-language', route: '/global-knowledge-bridge', description: 'Cross-language research' }
  ];

  constructor(public authService: AuthService, public router: Router) {}

  toggleSidenav(): void {
    this.sidenavOpened.set(!this.sidenavOpened());
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }

  // Menu items as computed signal to prevent recreation on each change detection
  userMenuItems = computed(() => [
    { label: 'Profile', icon: 'pi pi-user', command: () => this.goToProfile() },
    { label: 'Settings', icon: 'pi pi-cog', command: () => this.goToSettings() },
    { separator: true },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
  ]);
}
