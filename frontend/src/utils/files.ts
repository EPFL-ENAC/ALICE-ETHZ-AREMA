import { cdnUrl } from 'src/boot/api';
import { Document, FileItem } from 'src/models';

export function getImageUrls(row: Document) {
  const images = row.files
    ? row.files
        .filter((fileRef) => isImage(fileRef))
        .map((fileRef) => (fileRef.url ? fileRef.url : `${cdnUrl}/${fileRef.ref?.path}`))
    : [];
  return images;
}

export function isImage(file: FileItem) {
  const name = file.url ? file.url : file.ref?.name;
  return ['.png', '.jpg', '.jpeg', '.webp', '.svg'].find((suffix) => name && name.toLowerCase().endsWith(suffix));
}

export function isVideo(file: FileItem) {
  return (
    file.url?.includes('youtube.com') ||
    file.url?.includes('youtu.be') ||
    file.url?.includes('vimeo.com') ||
    file.url?.includes('srf.ch/play/tv') ||
    file.url?.includes('rts.ch/play/tv')
  );
}

export function isPDF(file: FileItem) {
  const name = file.url ? file.url : file.ref?.name;
  return ['.pdf'].some((suffix) => name && name.toLowerCase().endsWith(suffix));
}

export function toFileUrl(file: FileItem) {
  if (file.url) {
    return isVideo(file) ? toEmbededVideoUrl(file.url) : file.url;
  }
  return `${cdnUrl}/${file.ref?.path}`;
}

export function toEmbededVideoUrl(url: string) {
  if (url) {
    return url
      .replace('youtube.com/watch?v=', 'youtube.com/embed/')
      .replace('youtu.be/', 'youtube.com/embed/')
      .replace('youtu.be', 'youtube.com/embed')
      .replace('vimeo.com', 'player.vimeo.com/video');
  }
  return '';
}
