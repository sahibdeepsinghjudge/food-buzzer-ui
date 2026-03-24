import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputField } from '../../../ui/input-field/input-field';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService, RecipeIngredient } from '../../../services/recipe.service';
import { InventoryService, RawMaterial } from '../../inventory/inventory-service';

@Component({
  selector: 'app-create-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, InputField, Button, MatIconModule],
  templateUrl: './create-recipe.html',
  styleUrls: ['./create-recipe.css']
})
export class CreateRecipe implements OnInit {
  recipeForm!: FormGroup;
  ingredientForm!: FormGroup;
  
  isEditMode = signal<boolean>(false);
  editRecipeId = signal<number | null>(null);
  
  availableMaterials = signal<RawMaterial[]>([]);
  materialSearchQuery = signal<string>('');
  isDropdownOpen = signal<boolean>(false);
  
  filteredMaterials = computed(() => {
    const query = this.materialSearchQuery().toLowerCase();
    return this.availableMaterials().filter(m => m.name.toLowerCase().includes(query));
  });

  selectedMaterial = signal<RawMaterial | null>(null);
  selectedUnit = signal<string>('');
  availableUnits = computed(() => {
    const mat = this.selectedMaterial();
    if (!mat) return [];
    const baseUnit = mat.unit.toLowerCase();
    if (['kg', 'g', 'grams', 'kilograms'].includes(baseUnit)) {
      return ['g', 'KG'];
    }
    if (['l', 'ml', 'liters', 'milliliters'].includes(baseUnit)) {
      return ['ml', 'L'];
    }
    return [mat.unit];
  });

  selectedIngredients = signal<(RecipeIngredient & { materialName: string, unit: string, displayPortion: number, displayUnit: string })[]>([]);
  isSaving = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private inventoryService: InventoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.ingredientForm = this.fb.group({
      portionSize: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.inventoryService.getRawMaterials().subscribe(materials => {
      this.availableMaterials.set(materials);
      
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode.set(true);
          this.editRecipeId.set(parseInt(id, 10));
          this.loadRecipeData(parseInt(id, 10));
        }
      });
    });
  }

  loadRecipeData(id: number) {
    this.recipeService.getRecipeById(id).subscribe(recipe => {
      if (recipe) {
        this.recipeForm.patchValue({
          name: recipe.name,
          description: recipe.description
        });

        const loadedIngredients = recipe.ingredients.map(ing => {
          const material = this.availableMaterials().find(m => m.id === ing.materialId);
          if (!material) return null;

          let displayPortion = ing.portionSize;
          let displayUnit = material.unit;
          const baseMatUnit = material.unit.toLowerCase();

          // Inverse conversion from base units back to display units if possible
          if (baseMatUnit === 'kg' || baseMatUnit === 'kilograms') {
            if (ing.portionSize < 1 && ing.portionSize > 0) {
              displayUnit = 'g';
              displayPortion = ing.portionSize * 1000;
            } else {
              displayUnit = 'KG';
            }
          } else if (baseMatUnit === 'l' || baseMatUnit === 'liters') {
            if (ing.portionSize < 1 && ing.portionSize > 0) {
              displayUnit = 'ml';
              displayPortion = ing.portionSize * 1000;
            } else {
              displayUnit = 'L';
            }
          } else if (baseMatUnit === 'g' || baseMatUnit === 'grams') {
            if (ing.portionSize >= 1000) {
              displayUnit = 'KG';
              displayPortion = ing.portionSize / 1000;
            } else {
              displayUnit = 'g';
            }
          } else if (baseMatUnit === 'ml' || baseMatUnit === 'milliliters') {
            if (ing.portionSize >= 1000) {
              displayUnit = 'L';
              displayPortion = ing.portionSize / 1000;
            } else {
              displayUnit = 'ml';
            }
          }

          return {
            materialId: ing.materialId,
            portionSize: ing.portionSize,
            materialName: material.name,
            unit: material.unit,
            displayPortion: displayPortion,
            displayUnit: displayUnit
          };
        }).filter(Boolean) as any[];

        this.selectedIngredients.set(loadedIngredients);
      }
    });
  }

  selectMaterial(material: RawMaterial) {
    this.selectedMaterial.set(material);
    this.materialSearchQuery.set(material.name);
    this.isDropdownOpen.set(false);
    
    // Auto-select a default display unit
    const units = this.availableUnits();
    if (units.length > 0) {
      // Prefer larger units for UI if applicable, or just the first one
      this.selectedUnit.set(units.includes('KG') ? 'KG' : (units.includes('L') ? 'L' : units[0]));
    }
  }

  onUnitChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedUnit.set(select.value);
  }

  addIngredient() {
    if (this.ingredientForm.invalid || !this.selectedMaterial()) {
      this.ingredientForm.markAllAsTouched();
      return;
    }

    const { portionSize } = this.ingredientForm.value;
    const material = this.selectedMaterial()!;
    const displayUnit = this.selectedUnit();
    const displayPortion = parseFloat(portionSize);

    // Convert to backend base unit for storage
    let basePortionSize = displayPortion;
    const baseMatUnit = material.unit.toLowerCase();
    const uiUnit = displayUnit.toLowerCase();

    // From Grams to KG (Material is KG, UI is Grams)
    if ((uiUnit === 'g' || uiUnit === 'grams') && (baseMatUnit === 'kg' || baseMatUnit === 'kilograms')) {
      basePortionSize = displayPortion / 1000;
    }
    // From ML to Liters (Material is L, UI is ML)
    else if ((uiUnit === 'ml' || uiUnit === 'milliliters') && (baseMatUnit === 'l' || baseMatUnit === 'liters')) {
      basePortionSize = displayPortion / 1000;
    }
    // From KG to Grams (Material is G, UI is KG)
    else if ((uiUnit === 'kg' || uiUnit === 'kilograms') && (baseMatUnit === 'g' || baseMatUnit === 'grams')) {
      basePortionSize = displayPortion * 1000;
    }
    // From Liters to ML (Material is ML, UI is L)
    else if ((uiUnit === 'l' || uiUnit === 'liters') && (baseMatUnit === 'ml' || baseMatUnit === 'milliliters')) {
      basePortionSize = displayPortion * 1000;
    }

    const baseUnit = material.unit;

    const currentIngredients = this.selectedIngredients();
    const existingIndex = currentIngredients.findIndex(i => i.materialId === material.id);

    if (existingIndex > -1) {
      currentIngredients[existingIndex].portionSize += basePortionSize;
      currentIngredients[existingIndex].displayPortion += displayPortion;
      this.selectedIngredients.set([...currentIngredients]);
    } else {
      this.selectedIngredients.update(ings => [...ings, {
        materialId: material.id,
        portionSize: basePortionSize,
        materialName: material.name,
        unit: baseUnit,
        displayPortion: displayPortion,
        displayUnit: displayUnit
      }]);
    }

    // Reset ingredient form
    this.ingredientForm.reset();
    this.selectedMaterial.set(null);
    this.materialSearchQuery.set('');
  }

  removeIngredient(materialId: number) {
    this.selectedIngredients.update(ings => ings.filter(i => i.materialId !== materialId));
  }

  saveRecipe() {
    if (this.recipeForm.invalid) {
      this.recipeForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValues = this.recipeForm.value;
    
    const ingredientsToSave: RecipeIngredient[] = this.selectedIngredients().map(i => ({
      materialId: i.materialId,
      portionSize: i.portionSize
    }));

    const recipeData = {
      name: formValues.name,
      description: formValues.description,
      ingredients: ingredientsToSave
    };

    if (this.isEditMode() && this.editRecipeId()) {
      this.recipeService.updateRecipe(this.editRecipeId()!, recipeData).subscribe(() => {
        this.isSaving.set(false);
        this.router.navigate(['/recipes']);
      });
    } else {
      this.recipeService.addRecipe(recipeData).subscribe(() => {
        this.isSaving.set(false);
        this.router.navigate(['/recipes']);
      });
    }
  }
}
