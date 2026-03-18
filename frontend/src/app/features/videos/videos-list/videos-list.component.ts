import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VideosCardComponent } from '../videos-card/videos-card.component';
import { Video } from '../../../core/models/video.model';
import { Subject } from '../../../core/models/subject.model';
import { DataService, VideoPayload } from '../../../core/services/data.service';
import { UploadService } from '../../../core/services/upload.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { validateImageFile, validateVideoFile } from '../../../core/validators/upload.validator';
import { switchMap, finalize, of } from 'rxjs';

@Component({
  selector: 'app-videos-list',
  imports: [VideosCardComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.css']
})
export class VideosListComponent implements OnInit {
  videos: Video[] = [];
  subjectName!: string;
  currentSubject: Subject | null = null;
  isLoading = true;

  showModal = false;
  isEditMode = false;
  isDeleteMode = false;
  isSaving = false;
  errorMessage = '';
  selectedVideo: Video | null = null;

  form: VideoPayload = { title: '', bannerUrl: '', url: '' };
  bannerUploading = false;
  videoUploading = false;

  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private uploadService = inject(UploadService);

  get isUploading(): boolean { return this.bannerUploading || this.videoUploading; }

  get modalTitle(): string {
    if (this.isDeleteMode) return 'Delete Video';
    return this.isEditMode ? 'Edit Video' : 'New Video';
  }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.subjectName = name;
      this.loadVideos(name);
    }
  }

  loadVideos(subjectName: string): void {
    this.isLoading = true;
    this.dataService.getSubjects().pipe(
      switchMap(subjects => {
        const subject = subjects.find(s => s.title === subjectName) ?? null;
        this.currentSubject = subject;
        if (!subject) return of([]);
        return this.dataService.getVideosBySubjectId(subject.id);
      }),
      finalize(() => { this.isLoading = false; })
    ).subscribe({
      next: (videos) => { this.videos = videos; },
      error: (err) => { console.error('Failed to load videos:', err); }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.selectedVideo = null;
    this.errorMessage = '';
    this.resetForm();
    this.showModal = true;
  }

  onEditVideo(video: Video): void {
    this.isEditMode = true;
    this.isDeleteMode = false;
    this.selectedVideo = video;
    this.errorMessage = '';
    this.form = { title: video.title, bannerUrl: video.bannerUrl, url: video.url, subjectId: video.subjectId };
    this.showModal = true;
  }

  onDeleteVideo(video: Video): void {
    this.isDeleteMode = true;
    this.isEditMode = false;
    this.selectedVideo = video;
    this.errorMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.isDeleteMode = false;
    this.selectedVideo = null;
    this.errorMessage = '';
    this.resetForm();
  }

  resetForm(): void {
    this.form = { title: '', bannerUrl: '', url: '' };
    this.bannerUploading = false;
    this.videoUploading = false;
  }

  confirmDelete(): void {
    if (!this.selectedVideo) return;
    this.isSaving = true;
    this.dataService.deleteVideo(this.selectedVideo.id).subscribe({
      next: () => {
        this.videos = this.videos.filter(v => v.id !== this.selectedVideo!.id);
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

    if (this.isEditMode && this.selectedVideo) {
      this.dataService.updateVideo(this.selectedVideo.id, this.form).subscribe({
        next: (updated) => {
          this.videos = this.videos.map(v => v.id === this.selectedVideo!.id ? updated : v);
          this.closeModal();
        },
        error: (err) => { this.errorMessage = err.error?.message ?? 'Update failed.'; this.isSaving = false; },
        complete: () => { this.isSaving = false; }
      });
    } else {
      const payload: VideoPayload = { ...this.form, subjectId: this.currentSubject?.id };
      this.dataService.createVideo(payload).subscribe({
        next: (created) => { this.videos = [...this.videos, created]; this.closeModal(); },
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
      const res = await this.uploadService.uploadVideoThumbnail(file);
      this.form.bannerUrl = res.url;
    } catch { this.errorMessage = 'Thumbnail upload failed.'; }
    finally { this.bannerUploading = false; }
  }

  async onVideoFileSelected(event: any): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const error = validateVideoFile(file);
    if (error) { this.errorMessage = error; return; }
    this.videoUploading = true;
    try {
      const res = await this.uploadService.uploadVideo(file);
      this.form.url = res.url;
    } catch { this.errorMessage = 'Video upload failed.'; }
    finally { this.videoUploading = false; }
  }
}