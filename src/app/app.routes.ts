import { Routes } from '@angular/router';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { ErrorComponent } from './componentes/error/error.component';
import { PrincipalComponent } from './componentes/principal/principal.component';

export const routes: Routes = [
    {path:'principal',component:PrincipalComponent},

{ path:'', redirectTo: 'principal',pathMatch:'full' },//re direccionar a la pagina principal
{path: '**',component:ErrorComponent}



];
