import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputField } from '../../../ui/input-field/input-field';
import { TableComponent, TableColumn } from '../../../ui/table/table';
import { Button } from '../../../ui/button/button';
import { MatIconModule } from '@angular/material/icon';
import { RecipeService, Recipe } from '../../../services/recipe.service';

@Component({
  selector: 'app-recipe-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InputField, TableComponent, MatIconModule, Button],
  templateUrl: './recipe-dashboard.html',
  styleUrl: './recipe-dashboard.css',
})
export class RecipeDashboard implements OnInit {
  recipes = signal<Recipe[]>([]);
  searchQuery = signal<string>('');
  isLoading = signal<boolean>(true);

  filteredRecipes = computed(() => {
    const query = this.searchQuery();
    const allRecipes = this.recipes();
    
    if (!query) {
      return allRecipes;
    }

    return allRecipes.filter(r => 
      r.name.toLowerCase().includes(query) || 
      r.description.toLowerCase().includes(query)
    );
  });

  columns: TableColumn[] = [
    { key: 'name', label: 'Recipe Name' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created At' },
    {
      key: 'actions',
      label: 'Actions',
      type: 'button',
      buttonText: 'View',
      onClick: (row: any) => this.viewRecipe(row.id)
    }
  ];

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes.set(data);
      this.isLoading.set(false);
    });
  }

  onSearch(query: string) {
    this.searchQuery.set(query.toLowerCase());
  }

  viewRecipe(id: number) {
    this.router.navigate(['/recipes/recipe', id]);
  }
}
