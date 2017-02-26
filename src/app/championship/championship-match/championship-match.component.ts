import { Component, OnInit }              from '@angular/core';
import { ActivatedRoute, Params }         from '@angular/router';

import { API_IMAGE_CLUBS }                from '../../shared/app.settings';
import { ChampionshipMatchService }       from '../shared/championship-match.service';
import { ChampionshipMatch }              from '../shared/championship-match.model';
import { HelperService }                  from '../../shared/helper.service';
import { UserService }                    from '../../shared/user.service';

@Component({
  selector: 'app-championship-match',
  templateUrl: './championship-match.component.html',
  styleUrls: ['./championship-match.component.css']
})
export class ChampionshipMatchComponent implements OnInit {

    constructor(
        private championshipMatchService: ChampionshipMatchService,
        private activatedRoute: ActivatedRoute,
        public helperService: HelperService,
        private userService: UserService,
    ) {}

    spinner: boolean = false;
    match: ChampionshipMatch;
    error: string;
    clubsImagesUrl: string = API_IMAGE_CLUBS;
    authenticatedUser: any;
  
    ngOnInit(){
        this.authenticatedUser = this.userService.sharedUser;
        this.spinner = true;
        this.activatedRoute.params.forEach((params: Params) => {
            let id = +params['id'];
            this.championshipMatchService.getWithPredicts(id).subscribe(
                response => {
                    this.match = response;
                    this.spinner = false;
                },
                error => {
                    this.error = error;
                    this.spinner = false;
                }
            );
        })
    }
}
