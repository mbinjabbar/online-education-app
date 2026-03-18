import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';
import { emailValidator } from '../../core/validators/email.validator';
import { validateImageFile } from '../../core/validators/upload.validator';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  user: User | null = null;
  isEditing = false;
  showDeleteModal = false;
  selectedImage: File | null = null;
  previewUrl: string | null = null;
  successMessage = '';
  errorMessage = '';

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [
      Validators.required,
      emailValidator
    ]]
  });

  get usernameControl() { return this.form.get('username')!; }
  get emailControl() { return this.form.get('email')!; }

  get userImage(): string | null {
    if (this.previewUrl) return this.previewUrl;
    if (!this.user?.image) return null;
    return `${environment.api.baseUrl}/uploads/${this.user.image}`;
  }

  get firstName(): string {
    return this.user?.username?.split(' ')[0] || '';
  }

  isLoading = true;

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (user: User) => {
        this.user = user;
        this.authService.updateUser(user);
        this.form.patchValue({
          username: user.username,
          email: user.email
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load profile';
      }
    });
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      this.errorMessage = error;
      input.value = '';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    this.selectedImage = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  onEdit(): void {
    this.isEditing = true;
    this.previewUrl = null;
    this.selectedImage = null;
  }

  onCancel(): void {
    this.isEditing = false;
    this.previewUrl = null;
    this.selectedImage = null;
    
    this.form.patchValue({
      username: this.user?.username || '',
      email: this.user?.email || ''
    });
  }

  onSave(): void {
    const formData = new FormData();
    formData.append('username', this.form.value.username);
    formData.append('email', this.form.value.email);
    if (this.selectedImage) formData.append('image', this.selectedImage);

    this.userService.updateProfile(this.user!.id, formData).subscribe({
      next: (user: User) => {
        this.authService.updateUser(user);
        this.user = user;
        this.isEditing = false;
        this.previewUrl = null;
        this.successMessage = 'Profile updated successfully';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Update failed';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  onDeleteConfirm(): void {
    this.userService.deleteAccount(this.user!.id).subscribe({
      next: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showDeleteModal = false;
        this.errorMessage = err.error?.message || 'Delete failed';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}