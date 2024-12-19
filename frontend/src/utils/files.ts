import { cdnUrl } from 'src/boot/api';
import { Document, FileItem } from 'src/models';

export function getImageUrls(row: Document) {
  const images = row.files
    ? row.files
        .filter((fileRef) => fileRef.ref.mime_type?.startsWith('image'))
        .map((fileRef) => `${cdnUrl}/${fileRef.ref.path}`)
    : [];
  return images;
}

export function isImage(file: FileItem) {
  return file.ref.mime_type.startsWith('image');
}

export function isPDF(file: FileItem) {
  return file.ref.mime_type === 'application/pdf';
}

export function toFileUrl(file: FileItem) {
  return `${cdnUrl}/${file.ref.path}`;
}
