import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrevHistoryComponent } from './prev-history/prev-history.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
const routes: Routes = [
  { path: 'logout', component: LogoutComponent},
  { path: 'login', component: LoginComponent },
  { path: 'side-nav', component: SideNavComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: PrevHistoryComponent},
  { path: 'profile', component: UserProfileComponent},
  { path: 'signup', component: SignupComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetPlannerRoutingModule {}
