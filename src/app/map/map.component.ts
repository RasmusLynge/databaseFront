import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from "../data.service";

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/interfaces/classes';

import * as moment from 'moment';
import { timeout } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class MapComponent implements OnInit {

  constructor(public dialog: MatDialog, public dataService: DataService) { }

  windowWidth: number = 500;
  windowHeight: number = 500;

  loggedIn: boolean = false;
  routeQueryParams: Subscription;

  emailFormControl = new FormControl('', [
    Validators.required,
    //Validators.email,
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  cityFormControl = new FormControl('', [
    Validators.required,
  ]);

  videoFormControl = new FormControl('', []);
  aboutFormControl = new FormControl('', [
    Validators.required,
  ]);

  movieRec: string[] = [];
  topMoviesWeek: string[] = [];
  topFollowers: string[] = [];
  logs: string[] = [];


  displayedColumns: string[] = ['title', 'tagline', 'released', 'like'];
  movieSource = [];

  user: User = null;

  isLoading: boolean = false;
  sendMessage: string = "";


  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    let session = sessionStorage.getItem("session")
    if (session) {
      this.loggedIn = true;
      this.getSession(session);
    }

    this.getMovies()
    this.getTopMovieWeek();


    setTimeout(() => {
      this.getTopFollowers();
    }, 500)
  }

  getDate(unix): string {
    return moment(unix, "x").format("DD/MM-YYYY");
  }


  getSession(session: string) {
    this.dataService.getSession(session).subscribe(userData => {
      this.user = userData;
      if(userData.role_type === 'admin') {
        this.dataService.getLogs().subscribe(data => {
          this.logs = data;
          
        });
      }

        this.dataService.getRecMovie(session).subscribe(movies => {
          console.log("HALLO ", movies)
          movies.forEach(movie => {
            this.movieRec.push(movie.title)
          });
          
        })
    })
  }

  logout(): void {
    this.loggedIn = false;
    sessionStorage.removeItem("session");
    this.movieRec = [];
  }


  getTopMovieWeek() {
    this.dataService.getTopMovieWeek().subscribe(movies => {
      movies.forEach(movie => {
        this.topMoviesWeek.push(movie.title + " - " + movie.score);
      });
    })
  }

  getTopFollowers() {

    this.dataService.getTopFollowers().subscribe(users => {
      users.reverse();
      users.forEach(user => {
        this.topFollowers.push(user.id);
      });
    })
  }

  getMovies() {
    this.dataService.getAllMovies().subscribe(movies => {

      this.movieSource = movies
    })
  }

 



  ngOnDestroy() {
    this.routeQueryParams.unsubscribe();
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  onResize(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }


  chooseDialogHeight(): string {
    const maxHeight = 800
    if (window.innerHeight - 20 > maxHeight) return "800px"
    else return window.innerHeight - 20 + "px"
  }

  likeMovie(title: string): void {

    let session = sessionStorage.getItem("session");
    if (session) this.dataService.likeMovie(title, session).subscribe(ok => console.log(ok))


  }



  sendRequest(email, password): void {

    if (password !== "" && email !== "") {
      this.isLoading = true;

      this.dataService.login(email, password).subscribe(data => {

        if (data?.sessionID) {
          console.log(data)
          sessionStorage.setItem("session", data?.sessionID);
          this.loggedIn = true;
          this.isLoading = false;
          this.getSession(data?.sessionID);
        }
      })
    }

  }








  /*
    openVideoListDialog(team: string): void {
      const dialogRef = this.dialog.open(VideolistDialogComponent, {
        width: "1200px",
        height: this.chooseDialogHeight(),
        autoFocus: false,
        data: {
          team: team,
        }
      });
  
  
      dialogRef.afterClosed().subscribe(res => {
        this.router.navigate([''], { relativeTo: this.route });
      });
  
    }
  */

}

