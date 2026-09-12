import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MotoresComponent } from './components/motores/motores';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MotoresComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
