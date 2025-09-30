import { Routes } from '@angular/router';
import { errorContext } from 'rxjs/internal/util/errorContext';
import { ErrorComponent } from './componentes/error/error.component';
import { PrincipalComponent } from './componentes/principal/principal.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { AdministrarUsuariosComponent } from './componentes/administrar-usuarios/administrar-usuarios.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { GestionarProductosComponent } from './componentes/gestionar-productos/gestionar-productos.component';
import { CrearProductoComponent } from './componentes/crear-producto/crear-producto.component';
import { EditarProductoComponent } from './componentes/editar-producto/editar-producto.component';
import { FacturaComponent } from './componentes/factura/factura.component';
import { SeleccionarProductosComponent } from './componentes/seleccionar-productos/seleccionar-productos.component';
import { ReportesComponent } from './componentes/reportes/reportes.component';


export const routes: Routes = [
  { path: 'principal', component: PrincipalComponent },
  { path: 'login', component: LoginComponent },
  { path: 'editar-usuario', component: EditarUsuarioComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'gestionar-productos', component: GestionarProductosComponent },
  { path: 'editar-producto', component: EditarProductoComponent },
  { path: 'crear-producto', component: CrearProductoComponent },
  { path: 'administrar-usuarios', component: AdministrarUsuariosComponent },
  { path: 'seleccionar-productos', component: SeleccionarProductosComponent },
  { path: 'factura', component: FacturaComponent },

  
  { path: 'reportes', component: ReportesComponent },

  { path: '', redirectTo: 'principal', pathMatch: 'full' },
  { path: '**', component: ErrorComponent },
];