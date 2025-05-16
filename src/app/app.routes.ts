import { Routes } from '@angular/router';
import { DashboardComponent } from './component-homes/dashboard/dashboard.component';
import { LoginComponent } from './component-homes/login/login.component';
import { MainComponent } from './component-homes/main/main.component';

import { authGuard } from './auth.guard';
import { RegisterComponent } from './component-homes/register/register.component';
import { UserprofileComponent } from './component-system/user/profiles/userprofile.component';
import { EdituserComponent } from './component-system/user/edituser.component';
import { UserComponent } from './component-system/user/user.component';
import { JenisbahanComponent } from './component-masters/jenisbahan/jenisbahan.component';
import { InputjenisbahanComponent } from './component-masters/jenisbahan/inputjenisbahan.component';
import { BahanComponent } from './component-masters/bahan/bahan.component';
import { InputbahanComponent } from './component-masters/bahan/inputbahan.component';
import { ForbiddenComponent } from './component-homes/forbidden/forbidden.component';
import { ProjekComponent } from './component-trans/projek/projek.component';
import { InputprojekComponent } from './component-trans/projek/inputprojek.component';
import { DetailprojekComponent } from './component-trans/projek/detail/detailprojek.component';
import { InvoiceReportComponent } from './component-trans/surat/invoice.component';
import { SuratPenawaranComponent } from './component-trans/surat/penawaran.component';
import { HomeComponent } from './component-homes/home/home.component';


export const routes: Routes = [
  //{ path: 'login', component: LoginComponent },
  //{ path: 'register', component: RegisterComponent },
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
      { path: 'projek', component: ProjekComponent},
      { path: 'inputprojek', component: InputprojekComponent},
      { path: 'detailprojek/:id', component: DetailprojekComponent},
      { path: 'user', component: UserComponent},
      { path: 'edituser', component: EdituserComponent},
      { path: 'userprofile', component: UserprofileComponent},
      // report
      { path: 'invoice', component: InvoiceReportComponent},
      { path: 'penawaran/:id', component: SuratPenawaranComponent},
   
      ],
  },
  { path: 'home', component: HomeComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];
