import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { MenuProductService, ProductRecipe } from '../../../services/menu-product.service';
import { RecipeService, Recipe } from '../../../services/recipe.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, InputField, Button, MatIconModule],
  templateUrl: './create-product.html',
  styleUrls: ['./create-product.css']
})
export class CreateProduct implements OnInit {
  productForm!: FormGroup;
  recipeFormGroup!: FormGroup;
  
  isEditMode = signal<boolean>(false);
  editProductId = signal<number | null>(null);
  
  availableRecipes = signal<Recipe[]>([]);
  recipeSearchQuery = signal<string>('');
  isDropdownOpen = signal<boolean>(false);
  
  filteredRecipes = computed(() => {
    const query = this.recipeSearchQuery().toLowerCase();
    return this.availableRecipes().filter(r => r.name.toLowerCase().includes(query));
  });

  selectedRecipe = signal<Recipe | null>(null);

  selectedRecipes = signal<(ProductRecipe & { recipeName: string })[]>([]);
  isSaving = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private menuProductService: MenuProductService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      imageUrl: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3'], // Default placeholder
      price: ['', [Validators.required, Validators.min(0)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      isVeg: [true],
      isBestseller: [false]
    });

    this.recipeFormGroup = this.fb.group({
      qty: [1, [Validators.required, Validators.min(1)]]
    });

    this.recipeService.getRecipes().subscribe(recipes => {
      this.availableRecipes.set(recipes);
      
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode.set(true);
          this.editProductId.set(parseInt(id, 10));
          this.loadProductData(parseInt(id, 10));
        }
      });
    });
  }

  loadProductData(id: number) {
    this.menuProductService.getProductById(id).subscribe(product => {
      if (product) {
        this.productForm.patchValue({
          name: product.name,
          imageUrl: product.imageUrl,
          price: product.price,
          qty: product.qty,
          isVeg: product.isVeg,
          isBestseller: product.isBestseller
        });

        const loadedRecipes = product.recipes.map(r => {
          const recipeInfo = this.availableRecipes().find(ar => ar.id === r.recipeId);
          if (!recipeInfo) return null;

          return {
            recipeId: r.recipeId,
            qty: r.qty,
            recipeName: recipeInfo.name
          };
        }).filter(Boolean) as any[];

        this.selectedRecipes.set(loadedRecipes);
      }
    });
  }

  selectRecipe(recipe: Recipe) {
    this.selectedRecipe.set(recipe);
    this.recipeSearchQuery.set(recipe.name);
    this.isDropdownOpen.set(false);
  }

  addRecipeToProduct() {
    if (this.recipeFormGroup.invalid || !this.selectedRecipe()) return;

    const { qty } = this.recipeFormGroup.value;
    const recipe = this.selectedRecipe()!;

    const currentRecipes = this.selectedRecipes();
    const existingIndex = currentRecipes.findIndex(r => r.recipeId === recipe.id);

    if (existingIndex > -1) {
      currentRecipes[existingIndex].qty += parseFloat(qty);
      this.selectedRecipes.set([...currentRecipes]);
    } else {
      this.selectedRecipes.update(recipes => [...recipes, {
        recipeId: recipe.id,
        qty: parseFloat(qty),
        recipeName: recipe.name
      }]);
    }

    // Reset recipe form
    this.recipeFormGroup.reset({ qty: 1 });
    this.selectedRecipe.set(null);
    this.recipeSearchQuery.set('');
  }

  removeRecipe(recipeId: number) {
    this.selectedRecipes.update(recipes => recipes.filter(r => r.recipeId !== recipeId));
  }

  saveProduct() {
    if (this.productForm.invalid) return;

    this.isSaving.set(true);
    const formValues = this.productForm.value;
    
    const recipesToSave: ProductRecipe[] = this.selectedRecipes().map(r => ({
      recipeId: r.recipeId,
      qty: r.qty
    }));

    const productData = {
      name: formValues.name,
      imageUrl: formValues.imageUrl,
      price: parseFloat(formValues.price),
      qty: parseFloat(formValues.qty),
      isVeg: formValues.isVeg,
      isBestseller: formValues.isBestseller,
      recipes: recipesToSave
    };

    if (this.isEditMode() && this.editProductId()) {
      this.menuProductService.updateProduct(this.editProductId()!, productData).subscribe(() => {
        this.isSaving.set(false);
        this.router.navigate(['/products']);
      });
    } else {
      this.menuProductService.addProduct(productData).subscribe(() => {
        this.isSaving.set(false);
        this.router.navigate(['/products']);
      });
    }
  }
}
