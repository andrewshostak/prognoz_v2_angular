import { Injectable }                            from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable()
export class ManageClubGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router
    ) {}

    canActivate() {
        return this.checkRole();
    }

    canActivateChild(){
        return this.checkRole();
    }

    /**
     * Check if user have acceptable roles to edit news
     *
     * @returns {boolean}
     */
    checkRole(): boolean {
        if (!!localStorage.getItem('roles') && !!localStorage.getItem('auth_token')) {
            let userRoles = JSON.parse(localStorage.getItem('roles'));
            let allowedRoles = ['admin', 'clubs_editor'];
            for (let role in userRoles) {
                if (allowedRoles.indexOf(userRoles[role]) > -1) {
                    return true;
                }
            }
        }
        this.router.navigate(['/403']);
        return false;
    }
}