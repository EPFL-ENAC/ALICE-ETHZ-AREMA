export function toDatetimeString(at: string | undefined) {
  if (!at) return '-';
  const date = new Date(at);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export function isDatetimeBefore(at1: string | undefined, at2: string | undefined) {
  if (!at1 && !at2) return undefined;
  if (at1 === undefined) return false;
  if (at2 === undefined) return true;
  const date1 = new Date(at1);
  const date2 = new Date(at2);
  return date1.getTime() < date2.getTime();
}
