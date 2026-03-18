export const IMAGE_VALIDATION = {
  maxSizeBytes: 3 * 1024 * 1024,
  maxSizeLabel: '3MB',
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedTypesLabel: 'JPEG, PNG, WebP or GIF',
};

export const VIDEO_VALIDATION = {
  maxSizeBytes: 10 * 1024 * 1024,
  maxSizeLabel: '10MB',
  allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  allowedTypesLabel: 'MP4, WebM or OGG',
};

export function validateImageFile(file: File): string | null {
  if (!IMAGE_VALIDATION.allowedTypes.includes(file.type)) {
    return `Only image files are allowed (${IMAGE_VALIDATION.allowedTypesLabel})`;
  }
  if (file.size > IMAGE_VALIDATION.maxSizeBytes) {
    return `Image must be ${IMAGE_VALIDATION.maxSizeLabel} or smaller`;
  }
  return null;
}

export function validateVideoFile(file: File): string | null {
  if (!VIDEO_VALIDATION.allowedTypes.includes(file.type)) {
    return `Only video files are allowed (${VIDEO_VALIDATION.allowedTypesLabel})`;
  }
  if (file.size > VIDEO_VALIDATION.maxSizeBytes) {
    return `Video must be ${VIDEO_VALIDATION.maxSizeLabel} or smaller`;
  }
  return null;
}