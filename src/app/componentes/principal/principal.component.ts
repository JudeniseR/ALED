import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-principal',
  imports: [MenuComponent,RouterModule,FormsModule],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
