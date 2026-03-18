import { Component, inject, OnInit } from '@angular/core';
import { Subject } from '../../../core/models/subject.model';
import { DataService, SubjectPayload } from '../../../core/services/data.service';
import { UploadService } from '../../../core/services/upload.service';
import { SubjectsCardComponent } from '../subjects-card/subjects-card.component';
import { SubjectSkeletonComponent } from '../subject-skeleton.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { validateImageFile } from '../../../core/validators/upload.validator';

type SortOption = 'default' | 'a-z' | 'z-a' | 'newest';

@Component({
  selector: 'app-subjects-list',
  imports: [SubjectsCardComponent, SubjectSkeletonComponent, CommonModule, FormsModule],
  templateUrl: './subjects-list.component.html',
  styleUrl: './subjects-list.component.css'
})
export class SubjectsListComponent implements OnInit {
  private dataService = inject(DataService);
  private uploadService = inject(UploadService);

  allSubjects: Subject[] = [];
  isLoading = true;
  activeSort: SortOption = 'default';
  searchQuery = '';

  showModal = false;
  isEditMode = false;
  isDeleteMode = false;
  isSaving = false;
  errorMessage = '';
  selectedSubject: Subject | null = null;
  form: SubjectPayload = { title: '', description: '', bannerUrl: '' };
  bannerUploading = false;

  readonly sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'a-z',     label: 'A → Z'   },
    { value: 'z-a',     label: 'Z → A'   },
    { value: 'newest',  label: 'Newest'  },
  ];

  get subjects(): Subject[] {
    let list = this.searchQuery.trim()
      ? this.allSubjects.filter(s =>
          s.title.toLowerCase().includes(this.searchQuery.toLowerCase().trim())
        )
      : [...this.allSubjects];

    switch (this.activeSort) {
      case 'a-z':    return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'z-a':    return list.sort((a, b) => b.title.localeCompare(a.title));
      case 'newest': return list.sort((a, b) => b.id - a.id);
      default:       return list;
    }
  }

  get isUploading(): boolean {
    return this.bannerUploading;
  }

  get modalTitle(): string {
    if (this.isDeleteMode) return 'Delete Subject';
    return this.isEditMode ? 'Edit Subject' : 'New Subject';
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.isLoading = true;
    this.dataService.getSubjects().subscribe({
      next: (subjects) => { this.allSubjects = subjects; this.isLoading = false; },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  setSort(option: SortOption): void { this.activeSort = option; }
  clearSearch(): void { this.searchQuery = ''; }

  openCreateModal(): void {
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.selectedSubject = null;
    this.errorMessage = '';
    this.resetForm();
    this.showModal = true;
  }

  onEditSubject(subject: Subject): void {
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.selectedSubject = subject;
    this.errorMessage = '';
    this.form = { title: subject.title, description: subject.description, bannerUrl: subject.bannerUrl };
    this.showModal = true;
  }

  onDeleteSubject(subject: Subject): void {
    this.isDeleteMode = true;
    this.isEditMode = false;
    this.selectedSubject = subject;
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.selectedSubject = null;
    this.errorMessage = '';
    this.resetForm();
  }

  resetForm(): void {
    this.form = { title: '', description: '', bannerUrl: '' };
    this.bannerUploading = false;
  }

  confirmDelete(): void {
    if (!this.selectedSubject) return;
    this.isSaving = true;
    this.dataService.deleteSubject(this.selectedSubject.id).subscribe({
      next: () => {
        this.allSubjects = this.allSubjects.filter(s => s.id !== this.selectedSubject!.id);
        this.closeModal();
      },
      error: (err) => { this.errorMessage = err.error?.message ?? 'Failed to delete.'; this.isSaving = false; },
      complete: () => { this.isSaving = false; }
    });
  }

  onSubmit(): void {
    if (!this.form.title.trim() || this.isUploading) return;
    this.isSaving = true;
    this.errorMessage = '';

    if (this.isEditMode && this.selectedSubject) {
      this.dataService.updateSubject(this.selectedSubject.id, this.form).subscribe({
        next: (updated) => {
          this.allSubjects = this.allSubjects.map(s => s.id === this.selectedSubject!.id ? updated : s);
          this.closeModal();
        },
        error: (err) => { this.errorMessage = err.error?.message ?? 'Update failed.'; this.isSaving = false; },
        complete: () => { this.isSaving = false; }
      });
    } else {
      this.dataService.createSubject(this.form).subscribe({
        next: (created) => { this.allSubjects = [...this.allSubjects, created]; this.closeModal(); },
        error: (err) => { this.errorMessage = err.error?.message ?? 'Create failed.'; this.isSaving = false; },
        complete: () => { this.isSaving = false; }
      });
    }
  }

  async onBannerFileSelected(event: any): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) { this.errorMessage = error; return; }
    this.bannerUploading = true;
    try {
      const res = await this.uploadService.uploadBanner(file);
      this.form.bannerUrl = res.url;
    } catch { this.errorMessage = 'Banner upload failed.'; }
    finally { this.bannerUploading = false; }
  }
}