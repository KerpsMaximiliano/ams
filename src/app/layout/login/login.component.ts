import { Component } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public formGroup: UntypedFormGroup;
  public showError: boolean = false;
  public showPass: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setUpForm();
  }

  private setUpForm(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.formGroup.valueChanges.subscribe((value: any) => {
      this.showError = false;
    })
  }

  public login() {
    let username = this.formGroup.get('username')?.value;
    let password = this.formGroup.get('password')?.value;
    this.authService.loginKeycloak(username, password).subscribe({
      next: () => {
        this.authService.authenticated ?
        this.router.navigateByUrl('')
        : this.showError = true;
      }
    });
  }

}
