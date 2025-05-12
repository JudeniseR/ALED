import { Routes } from '@angular/router';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { ErrorComponent } from './componentes/error/error.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AdministrarUsuariosComponent } from './componentes/administrar-usuarios/administrar-usuarios.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';

export const routes: Routes = [
    {path:'principal',component:PrincipalComponent},
    { path: 'login', component:LoginComponent},
    { path: 'editar-usuario', component: EditarUsuarioComponent },
  
  { path: 'registro', component:RegistroComponent},
  { path: 'administrar-usuarios', component:AdministrarUsuariosComponent },

{ path:'', redirectTo: 'principal',pathMatch:'full' },//re direccionar a la pagina principal
{path: '**',component:ErrorComponent}



];
