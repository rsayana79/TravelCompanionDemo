import { PresenceService } from './presence.service';
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
  public token : any;
  currentUser$ = this.currentUserSource.asObservable();
  loggedIn : boolean;
  userName :string;
  newMessagesCount : number;
  registeredUser: User;
  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model:any){
    this.userName = model.loginId;
    return this.http.post(this.baseUrl + "/accounts/login", model).pipe(
      map((user:User)=>{
        if(user){
          this.newMessagesCount = user.newMessagesCount;
          this.setCurrentUser(user);
          this.presenceService.createHubConnection(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }

  getHeader(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    });
    return headers;
  }

  register(model: any) {
    return this.http.post(this.baseUrl + "/accounts/register", model).pipe(
      map((user: User) => {
        if (user) {
          //this.setCurrentUser(user);
          this.registeredUser = user;
          console.log(`registered user is ${user}`);
          /*           this.presenceService.createHubConnection(user);
                    localStorage.setItem('user', JSON.stringify(user)); */
        }
        return user;
      })
    )
  }

  validatePin(validationPin: string) {
    //var userToValidate: User;
    //this.currentUser$.pipe(take(1)).subscribe(user => userToValidate = user);
    console.log(`code from user is ${this.registeredUser.validationCode} and code entered is ${validationPin}`)
    if (this.registeredUser.validationCode == validationPin) {
      console.log(`key matched`)
      return this.http.post(this.baseUrl + "/accounts/validateemail", this.registeredUser).subscribe(response => {
        if (response == true) {
          console.log(`return response from API is ${response}`);
          return true;
        }
        else {
          console.log(`resturned response from API is ${response}`);
          return false;
        }
      })
    }
    else {
      return false;
    }
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
    this.token = user?.token;
  }

  getcurrentUserId(): number {
    let id;
    this.currentUser$.subscribe(user => {
      if (user) {
        id = user.id;
      }
    });
    return id;
  }

  getcurrentUserName(): string {
    let userName;
    this.currentUser$.subscribe(user => {
      if (user) {
        userName = user.userName;
      }
    });
    return userName;
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.token = null;
    this.presenceService?.stopHubConnection();
  }
}
