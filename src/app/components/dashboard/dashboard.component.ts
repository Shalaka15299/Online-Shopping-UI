import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user:any= [];
  public fullName:string="";

  constructor(private api:ApiService,private router:Router,private auth:AuthService, private userStore:UserStoreService) { }

  ngOnInit() {
    this.api.getAllUsers()
    .subscribe(res=>{
        this.user= res;
        console.log(res);      
    });

    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      let fulNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fulNameFromToken;
    });
  }

  signOut(){
    this.auth.signOut();
    this.router.navigate(['login']);
  }
}
