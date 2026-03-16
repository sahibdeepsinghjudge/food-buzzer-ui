import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RecipeService, Recipe } from '../../../services/recipe.service';
import { InventoryService, RawMaterial } from '../../inventory/inventory-service';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../ui/button/button';

interface EnrichedIngredient {
  materialName: string;
  portionSize: number;
  unit: string;
}

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, Button],
  templateUrl: './view-recipe.html',
  styleUrls: ['./view-recipe.css']
})
export class ViewRecipe implements OnInit {
  recipe = signal<Recipe | null>(null);
  enrichedIngredients = signal<EnrichedIngredient[]>([]);
  isLoading = signal<boolean>(true);
  isDeleting = signal<boolean>(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.loadRecipe(parseInt(idStr, 10));
      } else {
        this.router.navigate(['/recipes']);
      }
    });
  }

  loadRecipe(id: number) {
    this.isLoading.set(true);
    this.recipeService.getRecipeById(id).subscribe(recipe => {
      if (!recipe) {
        this.router.navigate(['/recipes']);
        return;
      }
      this.recipe.set(recipe);

      // Enrich ingredients with raw material names and units
      this.inventoryService.getRawMaterials().subscribe(materials => {
        const enriched = recipe.ingredients.map(ing => {
          const material = materials.find(m => m.id === ing.materialId);
          let displayPortion = ing.portionSize;
          let displayUnit = material?.unit || '';

          if (material) {
             if (material.unit.toLowerCase() === 'kg' || material.unit.toLowerCase() === 'kilograms') {
                displayUnit = 'KG';
                displayPortion = ing.portionSize / 1000;
             } else if (material.unit.toLowerCase() === 'l' || material.unit.toLowerCase() === 'liters') {
                displayUnit = 'L';
                displayPortion = ing.portionSize / 1000;
             }
          }

          return {
            materialName: material ? material.name : 'Unknown Material',
            portionSize: displayPortion,
            unit: displayUnit
          };
        });
        this.enrichedIngredients.set(enriched);
        this.isLoading.set(false);
      });
    });
  }

  editRecipe() {
    const current = this.recipe();
    if (current) {
      this.router.navigate(['/recipes/edit-recipe', current.id]);
    }
  }

  deleteRecipe() {
    const current = this.recipe();
    if (!current) return;
    
    if (confirm(`Are you sure you want to delete "${current.name}"? This action cannot be undone.`)) {
      this.isDeleting.set(true);
      this.recipeService.deleteRecipe(current.id).subscribe(success => {
        this.isDeleting.set(false);
        if (success) {
          this.router.navigate(['/recipes']);
        }
      });
    }
  }
}
