import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-side-login',
    imports: [CommonModule, RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
    templateUrl: './side-login.component.html'
})
export class AppSideLoginComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router, private auth: AuthService, private alert: AlertService) { }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) return;
    const uname = this.form.value.uname || '';
    const password = this.form.value.password || '';

    this.auth.login(uname, password).subscribe({
      next: () => {
        this.router.navigate(['/dashboards/dashboard1']);
      },
      error: () => {},
    });
  }
}
