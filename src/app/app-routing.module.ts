import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';

import { AccessDeniedComponent }    from './access-denied/access-denied.component';
import { GuestbookComponent }       from './guestbook/guestbook.component';
import { HomeComponent }            from './home/home.component';
import { UserComponent }            from './user/user.component';
import { UserGuard }                from './user/user-guard.service';

const routes: Routes = [
    { path: 'guestbook/page/:number', component: GuestbookComponent },
    { path: 'guestbook', component: GuestbookComponent },
    { path: '403', component: AccessDeniedComponent },
    { path: 'user', component: UserComponent , canActivate: [UserGuard]},
    { path: '', component: HomeComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})

export class AppRoutingModule {}