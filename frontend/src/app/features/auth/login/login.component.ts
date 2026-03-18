import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { emailValidator } from '../../../core/validators/email.validator';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginError = '';
  showPassword = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, emailValidator]],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  get email() {
    return this.form.get('email')!;
  }
  get password() {
    return this.form.get('password')!;
  }

  onLogin(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password, rememberMe } = this.form.value;
    this.authService.login(email, password).subscribe({
      next: (res) => {
        this.authService.setSession(res.data.token, res.data.user, rememberMe);
        this.router.navigate(['/subjects']);
      },
      error: (err) => {
        this.loginError = err.error?.message || 'Invalid email or password';
        setTimeout(() => (this.loginError = ''), 2500);
      },
    });
  }

  onCancel(): void {
    this.form.reset();
    this.loginError = '';
  }
}
