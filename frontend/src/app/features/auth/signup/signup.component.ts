import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { emailValidator } from '../../../core/validators/email.validator';
import { validateImageFile } from '../../../core/validators/upload.validator';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  signupError = '';
  signupSuccess = '';
  selectedFile: File | null = null;

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, emailValidator]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get username() { return this.form.get('username')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  get strengthLevel(): number {
  const val = this.password.value;
  if (!val || val.length < 6) return 0;

  const hasLetter = /[a-zA-Z]/.test(val);
  const hasNumber = /[0-9]/.test(val);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':",./<>?]/.test(val);

  const typesCount = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
  const isMixed = typesCount >= 2;

  if (!isMixed) return 1;
  if (isMixed && val.length >= 12) return 3;
  return 2;
}

  get strengthConfig(): { label: string; color: string; bars: number } {
    switch (this.strengthLevel) {
      case 1: return { label: 'Weak',   color: 'bg-rose-400',   bars: 1 };
      case 2: return { label: 'Good',   color: 'bg-yellow-400', bars: 2 };
      case 3: return { label: 'Strong', color: 'bg-green-400',  bars: 3 };
      default: return { label: '',      color: '',               bars: 0 };
    }
  }

  get labelColor(): string {
    switch (this.strengthLevel) {
      case 1: return 'text-rose-400';
      case 2: return 'text-yellow-400';
      case 3: return 'text-green-400';
      default: return '';
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      this.signupError = error;
      input.value = '';
      setTimeout(() => this.signupError = '', 2500);
      return;
    }

    this.selectedFile = file;
  }

  onSignUp(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = new FormData();
    formData.append('username', this.form.value.username);
    formData.append('email', this.form.value.email);
    formData.append('password', this.form.value.password);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.authService.signup(formData).subscribe({
      next: (res) => {
        this.signupSuccess = res.message;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.signupError = err.error?.message || 'Signup failed';
        setTimeout(() => this.signupError = '', 2500);
      }
    });
  }

  onCancel(): void {
    this.form.reset();
    this.selectedFile = null;
    this.signupError = '';
    this.signupSuccess = '';
  }
}