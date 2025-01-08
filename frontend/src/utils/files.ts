import { cdnUrl } from 'src/boot/api';
import { Document, FileItem } from 'src/models';

export function getImageUrls(row: Document) {
  const images = row.files
    ? row.files
        .filter(
          (fileRef) =>
            fileRef.ref && fileRef.ref.mime_type?.startsWith('image'),
        )
        .map((fileRef) => `${cdnUrl}/${fileRef.ref?.path}`)
    : [];
  return images;
}

export function isImage(file: FileItem) {
  const name = file.url ? file.url : file.ref?.name;
  return ['.png', '.jpg', '.jpeg', '.webp'].find(
    (suffix) => name && name.toLowerCase().endsWith(suffix),
  );
}

export function isVideo(file: FileItem) {
  return (
    file.url?.includes('youtube.com') ||
    file.url?.includes('vimeo.com') ||
    file.url?.includes('srf.ch/play/tv') ||
    file.url?.includes('rts.ch/play/tv')
  );
}

export function isPDF(file: FileItem) {
  return file.ref?.mime_type === 'application/pdf';
}

export function toFileUrl(file: FileItem) {
  if (file.url) {
    return toEmbededVideoUrl(file.url);
  }
  return `${cdnUrl}/${file.ref?.path}`;
}

export function toEmbededVideoUrl(url: string) {
  if (url) {
    return url
      .replace('youtube.com/watch?v=', 'youtube.com/embed/')
      .replace('youtu.be', 'youtube.com/embed')
      .replace('vimeo.com', 'player.vimeo.com/video');
  }
  return '';
}
