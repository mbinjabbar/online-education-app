import { inject, Injectable } from '@angular/core';
import { Subject } from '../models/subject.model';
import { Video } from '../models/video.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs'; // tap used in subject mutations
import { environment } from '../../../environments/environment';

export interface SubjectPayload {
  title: string;
  description: string;
  bannerUrl: string;
}

export interface VideoPayload {
  title: string;
  bannerUrl: string;
  url: string;
  subjectId?: number;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  subjectsUrl = environment.api.subjects;
  videosUrl = environment.api.videos;
  private http = inject(HttpClient);

  private subjectsCache$: Observable<Subject[]> | null = null;

  getSubjects(): Observable<Subject[]> {
    if (!this.subjectsCache$) {
      this.subjectsCache$ = this.http.get<{ data: { subjects: Subject[] } }>(this.subjectsUrl).pipe(
        map(res => res.data.subjects),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.subjectsCache$;
  }

  clearCache(): void {
    this.subjectsCache$ = null;
  }

getVideosBySubjectId(subjectId: number): Observable<Video[]> {
    return this.http.get<{ data: { videos: Video[] } }>(`${this.videosUrl}?subjectId=${subjectId}`).pipe(
      map(res => res.data.videos)
    );
  }

  createSubject(payload: SubjectPayload): Observable<Subject> {
    return this.http.post<{ data: { subject: Subject } }>(this.subjectsUrl, payload).pipe(
      map(res => res.data.subject),
      tap(() => this.clearCache())
    );
  }

  updateSubject(id: number, payload: SubjectPayload): Observable<Subject> {
    return this.http.put<{ data: { subject: Subject } }>(`${this.subjectsUrl}/${id}`, payload).pipe(
      map(res => res.data.subject),
      tap(() => this.clearCache())
    );
  }

  deleteSubject(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.subjectsUrl}/${id}`).pipe(
      map(res => ({ message: res.message })),
      tap(() => this.clearCache())
    );
  }

  createVideo(payload: VideoPayload): Observable<Video> {
    return this.http.post<{ data: { video: Video } }>(this.videosUrl, payload).pipe(
      map(res => res.data.video)
    );
  }

  updateVideo(id: number, payload: VideoPayload): Observable<Video> {
    return this.http.put<{ data: { video: Video } }>(`${this.videosUrl}/${id}`, payload).pipe(
      map(res => res.data.video)
    );
  }

  deleteVideo(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.videosUrl}/${id}`).pipe(
      map(res => ({ message: res.message }))
    );
  }
}