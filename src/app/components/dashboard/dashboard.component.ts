import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user:any= [];

  constructor(private api:ApiService,private router:Router,private auth:AuthService) { }

  ngOnInit() {
    this.api.getAllUsers()
    .subscribe(res=>{
        this.user= res;
        console.log(res);      
    })
  }

  signOut(){
    this.auth.signOut();
    this.router.navigate(['login']);
  }
}
