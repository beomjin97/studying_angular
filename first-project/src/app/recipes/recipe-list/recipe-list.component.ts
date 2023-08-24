import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://getbootstrap.kr/docs/5.0/assets/brand/bootstrap-logo.svg'
    ),
    new Recipe(
      'Another Test Recipe',
      'This is simply a test',
      'https://getbootstrap.kr/docs/5.0/assets/brand/bootstrap-logo.svg'
    ),
  ];
  constructor() {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
