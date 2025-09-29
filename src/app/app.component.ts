import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./menu/menu.component";
import { ChatBurbujaComponent } from './componentes/chat-burbuja/chat-burbuja.component';

@Component({
  selector: 'app-root', 
  imports: [RouterOutlet, MenuComponent, ChatBurbujaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ALED3';
}
