export class Competition {
    id:                  number;
    tournament_id:       number;
    season_id:           number;
    title:               string;
    stated:              boolean;
    active:              boolean;
    ended:               boolean;
    participants:        number;
    players_in_group:    number;
    first_playoff_stage: number;
    number_in_season:    number;
    active_round:        number;
    winners:             Array<any>;
    number_of_teams:     number;
}