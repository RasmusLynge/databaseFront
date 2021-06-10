import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from "../interfaces/classes";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';





@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor( private http: HttpClient, private _snackBar: MatSnackBar) { }


  
private baseUrl = 'http://localhost:8081/';  // URL to web api

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


getLogs():  Observable<any> {
  return this.http.get(this.baseUrl+"getUserRoleLog", this.httpOptions).pipe(
    tap(_ => console.log('YEEEW')),
    catchError(this.handleError("oops! Noget gik galt ved hentning af alle film."))
  );
}

getRecMovie(session: string): Observable<any> {

  let httpOptionsWithSession = {
    headers: new HttpHeaders({ 'sessionID': session, 'Content-Type': 'application/json' })
  };

  return this.http.get(this.baseUrl+"getMovieReccomendations", httpOptionsWithSession).pipe(
    tap(_ => console.log('YEEEW')),
    catchError(this.handleError("oops! Noget gik galt ved hentning af alle film."))
  );
}


getAllMovies(): Observable<any> {
  return this.http.get(this.baseUrl+"getAllMovies", this.httpOptions).pipe(
    tap(_ => console.log('YEEEW')),
    catchError(this.handleError("oops! Noget gik galt ved hentning af alle film."))
  );
}

getTopFollowers(): Observable<any> {
  return this.http.get(this.baseUrl+"user/top/followed", this.httpOptions).pipe(
    tap(_ => console.log('YEEEW')),
    catchError(this.handleError("oops! Noget gik galt ved hentning af top listen af brugere."))
  );
}


getTopMovieWeek(): Observable<any> {
  return this.http.get(this.baseUrl+"movie/top/month", this.httpOptions).pipe(
    tap(_ => console.log('YEEEW')),
    catchError(this.handleError("oops! Noget gik galt ved hentning af top listen af film."))
  );
}

getSession(session: string): any {
  console.log(session)

  let httpOptionsWithSession = {
    headers: new HttpHeaders({ 'sessionID': session, 'Content-Type': 'application/json' })
  };

  return this.http.get(this.baseUrl+"session", httpOptionsWithSession).pipe(
    tap(data => console.log(data)),
    catchError(this.handleError("oops! Noget gik galt ved hentning af top listen af film."))
  );
}

login(username: string, password: string): any {
  return this.http.post(this.baseUrl+"session/start",{"username": username, "password": password} , this.httpOptions).pipe(
    tap(data => console.log('YEEEW:')),
    catchError(this.handleError("oops! Noget gik galt ved log ind."))
  );
}

likeMovie(title: string, session: string): any{

  let httpOptionsWithSession = {
    headers: new HttpHeaders({ 'sessionID': session, 'Content-Type': 'application/json' })
  };

  return this.http.post(this.baseUrl+"like",{"movie": title} , httpOptionsWithSession).pipe(
    tap(data =>  this.openSnackBar("film liket 👍")),
    catchError(this.handleError("oops! Noget gik galt ved log ind."))
  );
}

private openSnackBar(message: string) {
  this._snackBar.open(message, "x" ,{
    duration:  3000, 
    horizontalPosition: "center",
      verticalPosition: "top",
  });
}


private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    sessionStorage.removeItem("session");
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
    this.openSnackBar(operation);
    // TODO: better job of transforming error for user consumption
  

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}

}
