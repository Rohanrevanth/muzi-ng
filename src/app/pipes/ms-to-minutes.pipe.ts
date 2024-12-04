import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'msToMinutes',
  standalone: true, // Allows direct import if you're using standalone components
})
export class MsToMinutesPipe implements PipeTransform {
  transform(milliseconds: number | undefined): string {
    if (milliseconds === undefined || milliseconds === null) {
      return 'N/A'; // Default value if undefined
    }
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
