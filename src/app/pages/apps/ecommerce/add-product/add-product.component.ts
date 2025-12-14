import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IconModule } from 'src/app/icon/icon.module';
import { MaterialModule } from 'src/app/material.module';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/apps/product/product.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { PRODUCT_DATA } from '../ecommerceData';
import { ArticleStatusEnum } from 'src/app/enum/article-status.enum';
import { BrandsService } from 'src/app/services/brands.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { MatDialog } from '@angular/material/dialog';
import { NewBrandDialogComponent } from '../brands/new-brand-dialog.component';
import { NewCategoryDialogComponent } from 'src/app/pages/apps/ecommerce/categories/new-category-dialog.component';
// Removed ngx-editor since description now uses a normal textarea
@Component({
  selector: 'app-add-product',
  imports: [
    MaterialModule,
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);
  private articlesService = inject(ArticlesService);
  private brandsService = inject(BrandsService);
  private categoriesService = inject(CategoriesService);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  // Removed rich text editor fields

  files: File[] = [];
  seasons: string[] = ['No Discount', 'Percentage %', 'Fixed Price'];
  sizes: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  brands: any[] = [];
  filteredBrands: any[] = [];
  displayBrand = (brand?: any) => (brand && brand.name) ? brand.name : '';

  categories: any[] = [];
  filteredCategories: any[] = [];
  displayCategory = (category?: any) => (category && category.name) ? category.name : '';

  taxClasses: string[] = [
    'Select an option',
    'Tax Free',
    'Taxable Goods',
    'Downloadable Products',
  ];
  // categories loaded from API
  templates: string[] = [
    'Default template',
    'Fashion',
    'Office Stationary',
    'Electronics',
  ];

  productStatuses = [
    { label: 'Stock', value: true },
    { label: 'Out of stock', value: false },
  ];
  // Inventario: opciones de estado (cadena)
  inventoryStatusOptions: string[] = [ArticleStatusEnum.AVAILABLE, ArticleStatusEnum.RESERVED, ArticleStatusEnum.SOLD_OUT];
  selectedOption: string = '';
  tags: string[] = []; // Selected tags
  allTags: string[] = ['electronics', 'books', 'clothing', 'music']; // Suggestions
  AddProduct!: FormGroup;

  product: any;
  isEditMode: boolean = false;
  constructor() {
    this.AddProduct = this.fb.group({
      id: [null],
      // Inventario: campos requeridos
      name: ['', Validators.required],
      code: ['', Validators.required],
      tax: [null, [Validators.required, Validators.min(0)]],
      ticketPrice: [null, [Validators.required, Validators.min(0)]],
      parcel: [null, [Validators.required, Validators.min(0)]],
      lidShopPrice: [null, [Validators.required, Validators.min(0)]],
      otherCosts: [null, [Validators.required, Validators.min(0)]],
      profit: [null, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      conversionRate: [''],
      currency: ['MX'],
      product_name: ['', Validators.required],
      description: [''],
      size: [''],
      variations: [''],
      base_price: [''],
      brand: [null],

      discount_type: ['No Discount'],
      set_discount_percentage: [''],
      fixed_discounted_price: [''],
      tax_class: [''],
      VAT_amount: [''],
      category: [null],
      default_template: [''],
      tags: this.fb.array([]),

      media: this.fb.array([]),
      Thumbnail: this.fb.array([]),
      // Imagen por URL (opcional)
      url: [''],
      // Dimensiones
      alto: [null, [Validators.min(0)]],
      largo: [null, [Validators.min(0)]],
      ancho: [null, [Validators.min(0)]],
    });
  }

  get isFormValid() {
    return this.AddProduct.valid;
  }

  get mediaArray() {
    return this.AddProduct.get('media') as FormArray;
  }
  get sizeControl() {
    return this.AddProduct.get('size');
  }
  get Thumbnail(): FormArray {
    return this.AddProduct.get('Thumbnail') as FormArray;
  }
  get tagsArray(): FormArray {
    return this.AddProduct.get('tags') as FormArray;
  }
  ngOnInit(): void {
    const currentUrl = this.router.url;
    const product = this.productService.getProduct();

    if (product) {
      // Edit mode when a product is provided by the service
      this.isEditMode = true;
      this.populateForm(product);
      this.productService.clearProduct(); // cleanup after reading
    } else if (
      currentUrl.includes('inventario/producto/nuevo') ||
      currentUrl.includes('add-product')
    ) {
      // Add mode when navigating to the add route without a preselected product
      this.isEditMode = false;
      this.populateForm({}); // empty form
    } else if (currentUrl.includes('edit-product') || currentUrl.includes('producto/editar')) {
      // Fallback: direct navigation to edit route with no product set
      this.isEditMode = true;
      this.populateForm(PRODUCT_DATA[0]); // fallback product
    }

    // Mantener sincronizado 'name' con 'product_name' para compatibilidad con flujos existentes
    this.AddProduct.get('name')?.valueChanges
      .pipe(debounceTime(0))
      .subscribe((v) => {
        this.AddProduct.patchValue({ product_name: v }, { emitEvent: false });
      });

    // Cargar marcas desde API
    this.brandsService.getBrands().subscribe({
      next: (resp) => {
        this.brands = resp.data || [];
        this.filteredBrands = this.brands;
        console.log('Brands cargadas:', this.brands);
      },
      error: (err) => {
        console.error('Error cargando marcas', err);
      },
    });

    // Cargar categorías desde API
    this.categoriesService.getCategories().subscribe({
      next: (resp: any) => {
        this.categories = resp.data || [];
        this.filteredCategories = this.categories;
        console.log('Categorías cargadas:', this.categories);
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
      },
    });

    // Filtrar categorías para autocomplete
    this.AddProduct.get('category')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        const query = typeof value === 'string' ? value.toLowerCase() : (value?.name || '').toLowerCase();
        this.filteredCategories = this.categories.filter((c: any) => (c.name || '').toLowerCase().includes(query));
      });

    // Filtrar marcas para autocomplete
    this.AddProduct.get('brand')?.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        const query = typeof value === 'string' ? value.toLowerCase() : (value?.name || '').toLowerCase();
        this.filteredBrands = this.brands.filter((b: any) => (b.name || '').toLowerCase().includes(query));
      });
  }
  ngOnDestroy() {
    // Optional: Clear product data when leaving the component
    this.productService.clearProduct();
  }

  openNewBrandDialog(): void {
    const dialogRef = this.dialog.open(NewBrandDialogComponent, {
      width: '480px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.name) {
        const payload = {
          name: result.name,
          descripcion: result.descripcion,
          siglas: result.siglas,
        };
        this.brandsService.createBrand(payload).subscribe({
          next: (res: any) => {
            const created = res?.data || payload;
            this.brands = [created, ...this.brands];
            this.filteredBrands = this.brands;
            this.AddProduct.patchValue({ brand: created });
          },
          error: (err) => {
            console.error('Error creando marca', err);
          },
        });
      }
    });
  }

  openNewCategoryDialog(): void {
    const dialogRef = this.dialog.open(NewCategoryDialogComponent, {
      width: '480px',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.name) {
        const payload = {
          name: result.name,
          descripcion: result.descripcion,
          siglas: result.siglas,
        };
        this.categoriesService.createCategory(payload).subscribe({
          next: (res: any) => {
            const created = res?.data || payload;
            this.categories = [created, ...this.categories];
            this.filteredCategories = this.categories;
            this.AddProduct.patchValue({ category: created });
          },
          error: (err) => {
            console.error('Error creando categoría', err);
          },
        });
      }
    });
  }

  onChange(event: any) {
    console.log('changed');
  }

  onBlur(event: any) {
    console.log('blur ' + event);
  }
  onSelect(event: any) {
    const files = event.addedFiles; // Getting the selected files

    // Loop through the selected files and add them to the FormArray
    files.forEach((file: any) => {
      this.mediaArray.push(this.fb.control(file)); // Add file to FormArray
    });
  }

  // Method to remove file
  onRemove(file: any, index?: any) {
    index = this.mediaArray.controls.findIndex(
      (control) => control.value === file
    );
    if (index > -1) {
      this.mediaArray.removeAt(index); // Remove file from FormArray
    }
  }
  onSeasonChange(event: any) {
    this.selectedOption = event.value;
  }
  selectTag(tag: string) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  addTagFromInput(event: any) {
    const input = event.input;
    const value = event.value?.trim();

    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }

    if (input) input.value = '';
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter((t) => t !== tag);
  }
  getBack() {
    this.router.navigate(['/inventario']);
  }
  getAddProduct(data: any) {
    const formData = this.AddProduct.getRawValue();
    const imageFilename = formData.media[0]; // e.g., "Spike Nextjs Free.jpg"

    // Construir objeto de inventario solicitado
    const inventoryArticle = this.buildInventoryArticle();
    console.log('InventoryArticle generado:', inventoryArticle);

    // Construir payload de creación según especificación
    const payload = this.buildArticlePayload();
    console.log('Payload a enviar:', payload);

    // Store the image filename in localStorage (as a string)
    localStorage.setItem('productImage', imageFilename);
    if (this.isEditMode) {
      if (!formData.id) {
        console.error('Updated product does not have an id:', formData); // Log if id is missing
      }
      this.updateProduct(formData); // Pass formData which should have id
    } else {
      // Enviar al endpoint con el payload solicitado usando multipart/form-data
      const file: File | undefined = this.mediaArray.length > 0 ? this.mediaArray.at(0).value : undefined;
      this.articlesService.createArticleMultipart(payload, file).subscribe({
        next: (resp) => {
          console.log('Article created', resp);
          this.openSnackBar('Operation successful');
          this.getBack();
        },
        error: (err) => {
          console.error('Error creating article', err);
          this.openSnackBar('Error creating article');
        },
      });
    }
  }

  addProduct(data: any) {
    if (this.AddProduct.valid) {
      // Ensure description is a plain string
      data.description = data.description ? String(data.description) : '';

      // Handle media
      if (data.media && data.media.length > 0) {
        data.media = data.media.map((file: any) => file.name);
      } else {
        data.media = [];
      }

      // Clean up unnecessary fields
      delete data.size;
      delete data.Thumbnail;
      delete data.VAT_amount;
      delete data.default_template;
      delete data.fixed_discounted_price;
      delete data.tags;
      delete data.tax_class;
      delete data.variations;
      delete data.set_discount_percentage;
      delete data.discount_type;

      // Mantener compatibilidad: emitir localmente si se requiere por otras vistas
      this.productService.emitProduct(data);
    }
  }

  populateForm(product: any) {
    // Map fields from InventoryArticle (inventario) and legacy ecommerce sample
    const size = product?.size;
    const mapped = {
      id: product._id ?? product.id ?? null,
      name: product.name ?? product.product_name ?? product.title ?? '',
      product_name: product.product_name ?? product.name ?? product.title ?? '',
      code: product.code ?? '',
      tax: typeof product.tax === 'number' ? product.tax : null,
      ticketPrice: typeof product.ticketPrice === 'number' ? product.ticketPrice : null,
      parcel: typeof product.parcel === 'number' ? product.parcel : null,
      lidShopPrice: typeof product.lidShopPrice === 'number' ? product.lidShopPrice : null,
      otherCosts: typeof product.otherCosts === 'number' ? product.otherCosts : null,
      profit: typeof product.profit === 'number' ? product.profit : null,
      status: product.status ?? '',
      description: product.description ?? '',
      category: product.category ?? null,
      base_price: product.base_price ?? product.price ?? '',
      imagePath: product.imagePath ?? '',
      url: product.url ?? product.imagePath ?? '',
      // Optional dimensions if present in other flows
      alto: (size && size.height != null) ? Number(size.height) : (product.alto != null ? Number(product.alto) : null),
      ancho: (size && size.width != null) ? Number(size.width) : (product.ancho != null ? Number(product.ancho) : null),
      largo: (size && size.deep != null) ? Number(size.deep) : (product.largo != null ? Number(product.largo) : null),
    };

    this.AddProduct.patchValue(mapped);
  }
  updateProduct(data: any) {
    if (this.AddProduct.valid) {
      const formData = this.AddProduct.getRawValue();
      const id = String(formData.id || data.id || '').trim();
      if (!id) {
        console.error('No article id provided for patch', formData);
        this.openSnackBar('Falta el ID del artículo para editar');
        return;
      }

      // Build payload consistent with POST format
      const payload = this.buildArticlePayload();

      // If a file is provided, send multipart; otherwise JSON
      const file: File | undefined = this.mediaArray.length > 0 ? this.mediaArray.at(0).value : undefined;

      const obs = file
        ? this.articlesService.updateArticleMultipart(id, payload, file)
        : this.articlesService.updateArticle(id, payload);

      obs.subscribe({
        next: () => {
          this.openSnackBar('Operation successful');
          this.getBack();
        },
        error: (err) => {
          console.error('Error updating article', err);
          this.openSnackBar('Error updating article');
        },
      });
    }
  }

  // Construye el objeto de inventario con los campos requeridos
  private buildInventoryArticle() {
    const v = this.AddProduct.getRawValue();
    const descriptionStr = String(v.description || '');
    return {
      name: v.name ?? v.product_name,
      code: v.code,
      tax: Number(v.tax ?? 0),
      ticketPrice: Number(v.ticketPrice ?? 0),
      parcel: Number(v.parcel ?? 0),
      lidShopPrice: Number(v.lidShopPrice ?? 0),
      otherCosts: Number(v.otherCosts ?? 0),
      profit: Number(v.profit ?? 0),
      status: v.status,
      description: descriptionStr || '',
    };
  }

  // Construye el objeto para POST conforme a especificación
  private buildArticlePayload() {
    const v = this.AddProduct.getRawValue();
    const descriptionStr = String(v.description || '');
    const publicationDateStr = v.publicationDate || new Date().toISOString();
    const brandId = v.brand?._id || v.brand?.id || v.brand || '';

    return {
      name: v.name ?? v.product_name,
      description: descriptionStr,
      code: v.code,
      // Imagen por URL cuando se proporcione
      url: v.url || '',
      tax: Number(v.tax ?? 0),
      ticketPrice: Number(v.ticketPrice ?? 0),
      parcel: Number(v.parcel ?? 0),
      lidShopPrice: Number(v.lidShopPrice ?? 0),
      otherCosts: Number(v.otherCosts ?? 0),
      profit: Number(v.profit ?? 0),
      exchangeValue: Number(v.exchangeValue ?? v.conversionRate ?? 0),
      status: v.status,
      brandId: String(brandId || ''),
      size: {
        height: Number(v.alto ?? 0),
        width: Number(v.ancho ?? 0),
        deep: Number(v.largo ?? 0),
      },
      publicationDate: String(publicationDateStr),
    };
  }

  private openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', { duration: 2000 });
  }
}
