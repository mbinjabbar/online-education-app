import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Video } from '../../../core/models/video.model';

@Component({
  selector: 'app-videos-card',
  imports: [CommonModule],
  templateUrl: './videos-card.component.html',
  styleUrl: './videos-card.component.css'
})
export class VideosCardComponent {
  @Input() video!: Video;
  @Input() lecNumber!: number;
  @Output() editVideo = new EventEmitter<Video>();
  @Output() deleteVideo = new EventEmitter<Video>();

  selectedVideo: Video | null = null;
  isModalOpen = false;

  openModal(video: Video): void {
    this.selectedVideo = video;
    this.isModalOpen = true;
    setTimeout(() => this.onModalOpen(), 50);
  }

  closeModal(): void {
    this.pauseVideo();
    this.isModalOpen = false;
    this.selectedVideo = null;
  }

  onEdit(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editVideo.emit(this.video);
  }

  onDelete(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteVideo.emit(this.video);
  }

  @ViewChild('videoPlayer') videoRef!: ElementRef<HTMLVideoElement>;

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;

  togglePlay() {
    const video = this.videoRef.nativeElement;
    if (video.paused) { video.play(); this.isPlaying = true; }
    else { video.pause(); this.isPlaying = false; }
  }

  skip(seconds: number) { this.videoRef.nativeElement.currentTime += seconds; }
  updateProgress() { this.currentTime = this.videoRef.nativeElement.currentTime; }
  setDuration() { this.duration = this.videoRef.nativeElement.duration; }
  seek(event: any) { this.videoRef.nativeElement.currentTime = event.target.value; }
  changeVolume(event: any) { this.volume = event.target.value; this.videoRef.nativeElement.volume = this.volume; }

  pauseVideo() {
    if (this.videoRef?.nativeElement) { this.videoRef.nativeElement.pause(); this.isPlaying = false; }
  }

  onModalOpen() {
    const video = this.videoRef?.nativeElement;
    if (!video) return;
    video.play().then(() => { this.isPlaying = true; }).catch(() => { this.isPlaying = false; });
  }

  toggleFullScreen() {
    const video = this.videoRef.nativeElement;
    if (!document.fullscreenElement) { video.requestFullscreen(); }
    else { document.exitFullscreen(); }
  }
}