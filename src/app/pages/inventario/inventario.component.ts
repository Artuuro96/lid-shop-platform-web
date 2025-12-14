import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { LoadingOverlayComponent } from 'src/app/components/common/loading-overlay/loading-overlay.component';
import { IconModule } from 'src/app/icon/icon.module';
import { DeleteDialogComponent } from '../apps/delete-dialog/delete-dialog.component';
import { CategoriesService, Category as ApiCategory } from 'src/app/services/categories.service';
import { Base } from 'src/app/interfaces/base.interface';
import { ArticlesService } from 'src/app/services/articles.service';
import { InventoryArticle } from 'src/app/interfaces/inventory-article.interface';
import { Element } from '../apps/ecommerce/ecommerceData';
import { ProductService } from 'src/app/services/apps/product/product.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AlertService } from 'src/app/services/alert.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    NgScrollbarModule,
    RouterModule,
    LoadingOverlayComponent,
  ],
  templateUrl: './inventario.component.html',
  styleUrl: '../apps/ecommerce/shop/shop.component.scss',
  styles: [
    `
    .blur-content {
      filter: blur(3px);
      transition: filter 120ms ease-in-out;
    }
    `,
  ],
})
export class InventarioComponent implements OnInit {
  private router = inject(Router);
  readonly dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private _snackBar = inject(MatSnackBar);
  private alert = inject(AlertService);
  private productService = inject(ProductService);
  private loadingService = inject(LoadingService);
  mobileQuery: MediaQueryList;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: 1199px)`);
  durationInSeconds = 1;
  searchText: string = '';

  allCards: InventoryArticle[] = [];
  filteredCards: InventoryArticle[] = [];
  isLoadingProducts: boolean = false;
  private searchDebounceHandle: ReturnType<typeof setTimeout> | null = null;

  folders: { name: string; icon: string }[] = [
    { name: 'all', icon: 'users' },
  ];
  selectedCategory: string = this.folders[0].name;
  // Selección múltiple de categorías
  selectedCategories: string[] = [];
  notes: { name: string; icon: string }[] = [
    { name: 'Reciente', icon: 'calendar' },
    { name: 'Precio: Alto - Bajo', icon: 'sort-descending' },
    { name: 'Precio: Bajo - Alto', icon: 'sort-ascending' },
    { name: 'En Descuento', icon: 'percentage' },
  ];
  selectedSortBy: string = this.notes[0].name;
  // Selección múltiple de orden
  selectedSortBys: string[] = [];
  selectedColor: string | null = null;
  isMobileView = false;
  selectedGender: string = 'all';
  selectedGenders: string[] = [];
  genderOptions = [
    { label: 'Todo', value: 'all' },
    { label: 'Hombre', value: 'men' },
    { label: 'Mujer', value: 'women' },
    { label: 'Niños', value: 'kids' },
  ];

  selectedPrice: string = 'all';
  priceOptions = [
    { label: 'All', value: 'all' },
    { label: '0 – 50', value: '0-50' },
    { label: '50–100', value: '50-100' },
    { label: '100–200', value: '100-200' },
    { label: 'Over 200', value: 'over-200' },
  ];

  selectedUpdateRanges: string[] = [];
  updateOptions = [
    { label: 'Todas', value: 'all' },
    { label: '24 horas', value: '24h' },
    { label: '7 días', value: '7d' },
    { label: '30 días', value: '30d' },
  ];

  // Server-side pagination state
  pageDisplay: number = 1; // UI page (1-based). Backend expects 0-based.
  limit: number = 12;
  pages: number[] = [];

  constructor(private articlesService: ArticlesService, private categoriesService: CategoriesService) {
    const media = inject(MediaMatcher);
    this.mobileQuery = media.matchMedia('(max-width: 1199px)');
    this.isMobileView = this.mobileQuery.matches;

    this.mobileQuery.addEventListener('change', (e) => {
      this.isMobileView = e.matches;
    });
  }

  ngOnInit(): void {
    this.fetchArticles();
    this.fetchCategories();
  }

  private fetchArticles(): void {
    this.isLoadingProducts = true;
    this.loadingService.increment();
    const categoryParam = this.selectedCategory && this.selectedCategory.toLowerCase() !== 'all'
      ? this.selectedCategory
      : '';
    const pageParam = Math.max(0, (this.pageDisplay || 1));
    const keyword = (this.searchText || '').trim() || undefined;
    const sortParams = this.getBackendSortParams();

    this.articlesService.getArticles({
      category: categoryParam,
      page: pageParam,
      limit: this.limit,
      keyword,
      sortBy: sortParams.sortBy,
      orderBy: sortParams.orderBy,
    }).subscribe({
      next: (res) => {
        const articles: InventoryArticle[] = res.data || [];
        this.allCards = articles;
        this.filteredCards = [...this.allCards];
        this.pages = Array.from({ length: res.totalPages || 0 }, (_, i) => i + 1);
        this.cdr.detectChanges();
        this.isLoadingProducts = false;
        this.loadingService.decrement();
      },
      error: () => {
        this.allCards = [];
        this.filteredCards = [];
        this.isLoadingProducts = false;
        this.loadingService.decrement();
      },
    });
  }

  private getBackendSortParams(): { sortBy?: string; orderBy?: 'ASC' | 'DESC' } {
    const selected = this.selectedSortBys && this.selectedSortBys.length ? this.selectedSortBys[0].toLowerCase() : (this.selectedSortBy || '').toLowerCase();
    switch (selected) {
      case 'reciente':
      case 'newest':
        return { sortBy: 'updatedAt', orderBy: 'DESC' };
      case 'precio: alto - bajo':
      case 'price: high-low':
        return { sortBy: 'lidShopPrice', orderBy: 'DESC' };
      case 'precio: bajo - alto':
      case 'price: low-high':
        return { sortBy: 'lidShopPrice', orderBy: 'ASC' };
      case 'en descuento':
      case 'discounted':
        return { sortBy: 'profit', orderBy: 'DESC' };
      default:
        return {};
    }
  }

  private mapArticlesToElements(articles: InventoryArticle[]): Element[] {
    const fallbackImage = '';
    return articles.map((a, index) => ({
      id: index + 1,
      imagePath: a.url || fallbackImage,
      product_name: a.name,
      categories: [a.status || ''],
      date: a.updatedAt || a.publicationDate || a.createdAt,
      status: (a.status || '').toLowerCase() !== 'inactive',
      base_price: Number(a.lidShopPrice ?? a.ticketPrice ?? 0),
      dealPrice: Number(a.ticketPrice ?? 0),
      description: a.description || '',
    }));
  }

  filterCards() {
    // Debounce user typing: clear previous scheduled search
    if (this.searchDebounceHandle) {
      clearTimeout(this.searchDebounceHandle);
    }

    // Schedule a new search after a short pause
    this.searchDebounceHandle = setTimeout(() => {
      this.isLoadingProducts = true;
      this.loadingService.increment();

      const categoryParam = this.selectedCategory && this.selectedCategory.toLowerCase() !== 'all'
        ? this.selectedCategory
        : '';
      const pageParam = Math.max(0, (this.pageDisplay || 1)); // backend expects 0-based
      const keyword = (this.searchText || '').trim() || undefined;
      const sortParams = this.getBackendSortParams();

      this.articlesService.getArticles({
        category: categoryParam,
        page: pageParam,
        limit: this.limit,
        keyword,
        sortBy: sortParams.sortBy,
        orderBy: sortParams.orderBy,
      }).subscribe({
        next: (res) => {
          const articles: InventoryArticle[] = res.data || [];
          this.allCards = articles;
          this.filteredCards = [...this.allCards];
          this.pages = Array.from({ length: res.totalPages || 0 }, (_, i) => i + 1);
          this.cdr.detectChanges();
          this.isLoadingProducts = false;
          this.loadingService.decrement();
        },
        error: () => {
          this.allCards = [];
          this.filteredCards = [];
          this.isLoadingProducts = false;
          this.loadingService.decrement();
        },
      });

      // Clear handle once executed
      this.searchDebounceHandle = null;
    }, 750);
  }

  getCategory(name: string): void {
    this.selectedCategory = name;
    this.pageDisplay = 1;
    this.fetchArticles();
  }

  getSorted(name: string): void {
    this.selectedSortBy = name;
    const nameLower = name.toLowerCase();
    switch (nameLower) {
      case 'newest':
        this.filteredCards = [...this.allCards].sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;

      case 'price: high-low':
        this.filteredCards = [...this.allCards].sort(
          (a, b) => +b.lidShopPrice - +a.lidShopPrice
        );
        break;

      case 'price: low-high':
        this.filteredCards = [...this.allCards].sort(
          (a, b) => +a.lidShopPrice - +b.lidShopPrice
        );
        break;

      case 'discounted':
        this.filteredCards = [...this.allCards].sort((a, b) => {
          const discountA = +a.lidShopPrice - +a.lidShopPrice;
          const discountB = +b.lidShopPrice - +b.lidShopPrice;
          return discountB - discountA;
        });
        break;

      default:
        this.filteredCards = [...this.allCards];
    }
  }

  // Orden múltiple: se toma la primera opción con prioridad
  applySortMultiSelect(): void {
    const selections = this.selectedSortBys || [];
    if (selections.length === 0) {
      this.filteredCards = [...this.allCards];
      return;
    }

    // Prioridad: Reciente > Precio Alto-Bajo > Precio Bajo-Alto > En Descuento
    const prioridad = ['Reciente', 'Precio: Alto - Bajo', 'Precio: Bajo - Alto', 'En Descuento'];
    const efective = prioridad.find((p) => selections.includes(p)) || selections[0];
    this.selectedSortBy = efective;

    const key = (efective || '').toLowerCase();
    if (key.includes('reciente') || key.includes('newest')) {
      this.filteredCards = [...this.allCards].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      return;
    }
    if (key.includes('alto') || key.includes('high-low')) {
      this.filteredCards = [...this.allCards].sort((a, b) => +b.lidShopPrice - +a.lidShopPrice);
      return;
    }
    if (key.includes('bajo') || key.includes('low-high')) {
      this.filteredCards = [...this.allCards].sort((a, b) => +a.lidShopPrice - +b.lidShopPrice);
      return;
    }
    if (key.includes('descuento') || key.includes('discount')) {
      this.filteredCards = [...this.allCards].sort((a, b) => {
        const discountA = +a.lidShopPrice - +a.lidShopPrice;
        const discountB = +b.lidShopPrice - +b.lidShopPrice;
        return discountB - discountA;
      });
      return;
    }
    this.filteredCards = [...this.allCards];
  }

  /*getGender(gender: string): void {
    if (gender.toLowerCase() === 'all') {
      this.filteredCards = [...this.allCards];
    } else {
      this.filteredCards = this.allCards.filter(
        (card) => card.gender === gender.toLowerCase()
      );
    }
  }

  // Filtro múltiple de género: muestra productos que coincidan con cualquiera
  applyGenderFilter(): void {
    const genders = this.selectedGenders || [];
    if (genders.length === 0 || genders.includes('all')) {
      this.filteredCards = [...this.allCards];
      return;
    }
    const set = new Set(genders.map((g) => g.toLowerCase()));
    this.filteredCards = this.allCards.filter((card) => {
      const cg = (card.gender || '').toLowerCase();
      return set.has(cg);
    });
  }
  getPricing(base_priceRange: string): void {
    this.selectedPrice = base_priceRange;
    switch (base_priceRange) {
      case '0-50':
        this.filteredCards = this.allCards.filter(
          (card) => +card.base_price >= 0 && +card.base_price <= 50
        );
        break;
      case '50-100':
        this.filteredCards = this.allCards.filter(
          (card) => +card.base_price > 50 && +card.base_price <= 100
        );
        break;
      case '100-200':
        this.filteredCards = this.allCards.filter(
          (card) => +card.base_price > 100 && +card.base_price <= 200
        );
        break;
      case 'over-200':
        this.filteredCards = this.allCards.filter((card) => +card.base_price > 200);
        break;
      case 'all':
      default:
        this.filteredCards = [...this.allCards];
        break;
    }
  }*/
  applyUpdateFilter(): void {
    const ranges = this.selectedUpdateRanges || [];
    // Si está vacío o incluye 'all', no filtramos
    if (ranges.length === 0 || ranges.includes('all')) {
      this.filteredCards = [...this.allCards];
      return;
    }

    const msMap: Record<string, number> = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    // Unión de rangos: tomamos el mayor window seleccionado
    const maxMs = ranges.reduce((acc, key) => Math.max(acc, msMap[key] ?? 0), 0);
    if (maxMs <= 0) {
      this.filteredCards = [...this.allCards];
      return;
    }

    const cutoff = Date.now() - maxMs;
    this.filteredCards = this.allCards.filter((card) => {
      const t = new Date(card.createdAt).getTime();
      return !isNaN(t) && t >= cutoff;
    });
  }
  getRestFilter() {
    this.selectedCategory = this.folders[0].name;
    this.selectedSortBy = this.notes[0].name;
    this.selectedUpdateRanges = [];
    this.selectedCategories = [];
    this.selectedSortBys = [];
    this.selectedGenders = [];
    this.filteredCards = [...this.allCards];
  }

  getProductList() {
    this.searchText = '';
    this.filteredCards = [...this.allCards];
  }

  onPageClick(displayPage: number): void {
    this.pageDisplay = displayPage;
    this.fetchArticles();
  }

  // Total number of pages available as fallback when backend totalPages not yet set
  totalPages: number = 27;

  // Ellipsis-style page list: shows first, current window, and last
  getDisplayPages(): (number | string)[] {
    const total = this.pages && this.pages.length ? this.pages.length : this.totalPages;
    const current = this.pageDisplay;
    const first = 1;
    const last = Math.max(first, total);
    const windowBefore = 2; // how many pages to show before current
    const windowAfter = 2;  // how many pages to show after current

    const pages: (number | string)[] = [];
    const start = Math.max(first, current - windowBefore);
    const end = Math.min(last, current + windowAfter);

    // Leading section
    if (start > first + 1) {
      pages.push(first, '...');
    } else {
      for (let i = first; i < start; i++) pages.push(i);
    }

    // Middle window around current
    for (let i = start; i <= end; i++) pages.push(i);

    // Trailing section
    if (end < last - 1) {
      pages.push('...', last);
    } else {
      for (let i = end + 1; i <= last; i++) pages.push(i);
    }

    return pages;
  }

  isNumber(val: unknown): val is number {
    return typeof val === 'number';
  }

  isOver(): boolean {
    return this.mediaMatcher.matches;
  }

  getAddProductRoute() {
    this.router.navigate(['inventario/producto/nuevo']);
  }
  openDialog(idOrIds: string | number[]): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        ids: Array.isArray(idOrIds) ? idOrIds : [idOrIds],
      },
      width: '400px',
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'delete') {
        if (Array.isArray(idOrIds)) {
          // optional: implement batch delete here if needed
        } else {
          this.getDeletedById(String(idOrIds));
        }
      }
    });
  }
  getDeletedById(id: string) {
    // Show global loader while deleting
    this.loadingService.increment();

    this.articlesService.deleteArticle(id).subscribe({
      next: () => {
        // Remove from current lists
        this.allCards = this.allCards.filter((product) => product._id !== id);
        this.filteredCards = this.filteredCards.filter((product) => product._id !== id);
        this.cdr.detectChanges();
        this.alert.success('Producto eliminado correctamente', 'Success');
        this.loadingService.decrement();
      },
      error: (err) => {
        console.error('Error eliminando artículo', err);
        this.openSnackBar('Error al eliminar el producto');
        this.loadingService.decrement();
      },
    });
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: this.durationInSeconds * 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  getviewDetails(productcardDetails: InventoryArticle) {
    this.productService.setProduct(productcardDetails);
    this.router.navigate(['/apps/product/product-details']);
  }
  toggleColor(color: string): void {
    this.selectedColor = this.selectedColor === color ? null : color;
  }
  getEditedProduct(productcardDetails: InventoryArticle) {
    this.productService.setProduct(productcardDetails);
    // Navigate to new edit route and show current product values
    this.router.navigate(['/producto/editar']);
  }
  getStarClass(index: number, rating?: number): string {
    const safeRating = rating ?? 0;
    const fullStars = Math.floor(safeRating);
    const partialStars = safeRating % 1 !== 0;
    if (index < fullStars) {
      return 'fill-warning';
    } else if (index === fullStars && partialStars) {
      return 'text-warning';
    } else {
      return '';
    }
  }
  private fetchCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res: Base<ApiCategory[]>) => {
        const categories: ApiCategory[] = res?.data ?? [];
        const mapped = categories.map((c) => ({ name: (c?.name ?? '').toLowerCase(), icon: 'folder' }));
        this.folders = [{ name: 'all', icon: 'users' }, ...mapped];
        this.selectedCategory = this.folders[0]?.name ?? 'all';
        this.cdr.detectChanges();
      },
      error: () => {
        this.folders = [{ name: 'all', icon: 'users' }];
      },
    });
  }
  // Multi-select de categorías: obtiene artículos de las categorías seleccionadas y los fusiona
  applyCategoryMultiSelect(): void {
    const categories = this.selectedCategories || [];
    // Si no hay selección o incluye 'Todas', traer todo y resetear
    if (categories.length === 0 || categories.some((c) => c.toLowerCase() === 'todas' || c.toLowerCase() === 'all')) {
      // Forzamos carga general
      this.isLoadingProducts = true;
      const pageParam = Math.max(0, (this.pageDisplay || 1) - 1);
      this.articlesService.getArticles({ category: '', page: pageParam, limit: this.limit }).subscribe({
        next: (res) => {
          const articles: InventoryArticle[] = res.data || [];
          this.allCards = articles;
          this.filteredCards = [...this.allCards];
          this.cdr.detectChanges();
          this.isLoadingProducts = false;
        },
        error: () => {
          this.allCards = [];
          this.filteredCards = [];
          this.isLoadingProducts = false;
        },
      });
      return;
    }
    this.isLoadingProducts = true;
    const pageParam = Math.max(0, (this.pageDisplay || 1) - 1);
    const requests = categories.map((cat) => this.articlesService.getArticles({ category: cat, page: pageParam, limit: this.limit }));
    forkJoin(requests).subscribe({
      next: (responses) => {
        // Fusionar y eliminar duplicados por _id
        const byId: Record<string, InventoryArticle> = {};
        responses.forEach((res) => {
          (res.data || []).forEach((a) => {
            if (a && a._id) byId[a._id] = a;
          });
        });
        const combined: InventoryArticle[] = Object.values(byId);
        this.allCards = combined;
        this.filteredCards = [...this.allCards];
        this.cdr.detectChanges();
        this.isLoadingProducts = false;
      },
      error: () => {
        this.allCards = [];
        this.filteredCards = [];
        this.isLoadingProducts = false;
      },
    });
  }
}
