import { User } from './../_models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = "https://localhost:5001/api";
  private currentUserSource = new ReplaySubject<User>(1);
  private token : any;
  currentUser$ = this.currentUserSource.asObservable();
  loggedIn : boolean;
  userName :string;  
  constructor(private http: HttpClient) { }

  login(model:any){
    this.userName = model.loginId;
    return this.http.post(this.baseUrl + "/accounts/login", model).pipe(
      map((user:User)=>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.token = user.token;                 
        }
      })
    );
  }

  getHeader(){
    const headers =  new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`      
    });  
    return headers;
  }

  register(model:any){
    return this.http.post(this.baseUrl + "/accounts/register", model).pipe(
      map((user:User)=>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.token = user.token;                
        }
        return user;
      })
    )
  }

  setCurrentUser(user: User){
    this.currentUserSource.next(user);
    this.token = user?.token;
  }

  getcurrentUserId() : number{
    let id;
    this.currentUser$.subscribe(user => {
        if (user) {
          id = user.id;}
      });
      return id;
  }

  getcurrentUserName() : string{
    let userName;
    this.currentUser$.subscribe(user => {
        if (user) {
          userName = user.userName;}
      });
      return userName;
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.token = null;
  }
}
