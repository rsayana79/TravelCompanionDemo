import { ServerErrorComponent } from './error/server-error/server-error.component';
import { AuthGuard } from './_guards/auth.guard';
import { ErrorComponent } from './error/error.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AiportsListComponent } from './aiports-list/aiports-list.component';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { MessagesComponent } from './messages/messages.component';
import { BookingsDataComponent } from './bookings-data/bookings-data.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatepostingComponent } from './createposting/createposting.component';
import { NotFoundComponent } from './error/not-found/not-found.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {
    path: '',
    runGuardsAndResolvers : 'always',
    canActivate : [AuthGuard],
    children :[
      {path: 'viewbookings', component: BookingsDataComponent},
      {path: 'createposting', component: CreatepostingComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'country', component: CountriesListComponent},
      {path: 'airports', component: AiportsListComponent},
      {path: 'notifications', component: NotificationsComponent}
    ]
  },
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch:'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
