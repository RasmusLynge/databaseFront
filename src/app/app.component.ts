import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'bmx-map';

  constructor(private dataService: DataService) {}
  ngOnInit(){
    if(!isDevMode()){
     
    } else {
      console.log("DEVMODE")
    }
    
  }
}
