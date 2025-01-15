import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';

import { authGuard } from './auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { UserprofileComponent } from './components/user/userprofile.component';
import { EdituserComponent } from './components/user/edituser.component';
import { UserComponent } from './components/user/user.component';
import { JenisbahanComponent } from './components/jenisbahan/jenisbahan.component';
import { InputjenisbahanComponent } from './components/jenisbahan/inputjenisbahan.component';
import { BahanComponent } from './components/bahan/bahan.component';
import { InputbahanComponent } from './components/bahan/inputbahan.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      /*
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 4, 5, 6, 7, 8] } },
      { path: 'jenisbahan', component: JenisbahanComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 5] } },
      { path: 'inputjenisbahan', component: InputjenisbahanComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 5] } },
      { path: 'bahan', component: BahanComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 4, 5, 6, 7, 8] } },
      { path: 'inputbahan', component: InputbahanComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 4, 5] } },
      { path: 'user', component: UserComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 5] } },
      { path: 'edituser', component: EdituserComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 5] } },
      { path: 'userprofile', component: UserprofileComponent, canActivate: [authGuard], data: { allowedRoles: [1, 2, 3, 4, 5, 6, 7, 8] } },
      */
      { path: 'dashboard', component: DashboardComponent},
      { path: 'jenisbahan', component: JenisbahanComponent},
      { path: 'inputjenisbahan', component: InputjenisbahanComponent},
      { path: 'bahan', component: BahanComponent},
      { path: 'inputbahan', component: InputbahanComponent},
      { path: 'user', component: UserComponent},
      { path: 'edituser', component: EdituserComponent},
      { path: 'userprofile', component: UserprofileComponent},
      ],
  },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
