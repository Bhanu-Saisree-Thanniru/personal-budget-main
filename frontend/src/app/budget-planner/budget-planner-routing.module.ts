import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrevHistoryComponent } from './prev-history/prev-history.component';
import { LogoutPopupComponent } from './logout-popup/logout-popup.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'side-nav', component: SideNavComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: PrevHistoryComponent},
  { path: 'logout', component: LogoutPopupComponent},
  { path: 'profile', component: UserProfileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BudgetPlannerRoutingModule {}
