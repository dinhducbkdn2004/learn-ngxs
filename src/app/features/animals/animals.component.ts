import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddAnimal, RemoveAnimal } from './../../store/animals/animals.actions';
import { AnimalsState } from './../../store/animals/animals.state';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-animals',
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: './animals.component.html',
})
export class AnimalsComponent {
  animals$: Observable<string[]>;
  newAnimal = '';

  constructor(private store: Store) {
    this.animals$ = this.store.select(AnimalsState.getAnimals);
  }

  add() {
    if (this.newAnimal.trim()) {
      this.store.dispatch(new AddAnimal(this.newAnimal));
      this.newAnimal = '';
    }
  }

  remove(name: string) {
    this.store.dispatch(new RemoveAnimal(name));
  }
}
