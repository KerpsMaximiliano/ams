import { EnvironmentService } from './environment.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { KeycloackResponse } from '../models/keyCloackResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticatedEvent:EventEmitter<boolean> = new EventEmitter<boolean>(false);
  public authenticated: boolean = false;

  constructor(private router: Router,
              private http: HttpClient,
              private environmentService: EnvironmentService) {                
                if (this.getToken() !== ""){
                  this.authenticated = true;
                  this.authenticatedEvent.next(true)
                }
               }

  public loginKeycloak(username: string, password: string) {
		const headers = new HttpHeaders ({
			'Content-Type': 'application/x-www-form-urlencoded'
		});

		const body = new HttpParams()
			.set('client_id', 'PLANESAPI') //TODO: Consultar a hernan si se va a crear un client_id especifico para planes
			.set('grant_type', 'password')
			.set('username', username)
			.set('password', password);

      return this.http.post<any>(`${this.environmentService.baseUrlKeycloak}/auth/realms/sancorsalud/protocol/openid-connect/token`, body.toString(), { headers: headers })
			.pipe(
				map((res: KeycloackResponse) => {
          localStorage.setItem('token_keycloak', res.access_token);
          this.authenticatedEvent.next(true);
          this.authenticated = true;
				})
			)
	}

  public getToken(){
    let response;
    try {
      response = localStorage.getItem("token_keycloak");
    } catch (error) {
      return ""
    }
    return response;
  }

  public isAuthenticated() {
    return this.authenticatedEvent.asObservable();
  }

  public logout(){
    localStorage.removeItem("token_keycloack");
    this.authenticatedEvent.next(false);
    this.authenticated = false;
    this.router.navigate(["login"])
  }
}
