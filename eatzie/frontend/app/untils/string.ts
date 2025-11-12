export function toTiltleCase(str: string): string {
  return str
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLocaleLowerCase())
    .join(" ");
}
