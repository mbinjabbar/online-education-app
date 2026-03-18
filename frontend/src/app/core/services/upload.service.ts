import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  url: string;
  path: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.key,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }

  private async upload(bucket: string, file: File, folder: string): Promise<UploadResponse> {
    const ext = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36)}.${ext}`;

    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, file, { upsert: false });

    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return { url: urlData.publicUrl, path: data.path };
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);
    if (error) throw error;
  }

  uploadBanner(file: File): Promise<UploadResponse> {
    return this.upload('banners', file, 'subjects');
  }

  uploadVideoThumbnail(file: File): Promise<UploadResponse> {
    return this.upload('banners', file, 'videos');
  }

  uploadVideo(file: File): Promise<UploadResponse> {
    return this.upload('videos', file, 'lectures');
  }
}