import { TodoState } from '../../store/todo/todo.state';
import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddTodo, RemoveTodo, ToggleTodo } from '../../store/todo/todo.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent {
  private readonly store = inject(Store);
  todos$ = this.store.select(TodoState.getState);
  newTodoTitle = '';

  addTodo() {
    if (this.newTodoTitle.trim()) {
      this.store.dispatch(new AddTodo(this.newTodoTitle));
      this.newTodoTitle = '';
    }
  }

  removeTodo(id: number) {
    this.store.dispatch(new RemoveTodo(id));
  }

  toggleTodo(id: number) {
    this.store.dispatch(new ToggleTodo(id));
  }
}
