import * as fs from 'fs';
import * as path from 'path';

let patchData: any = null;

try {
  const patchPath = path.join(__dirname, 'seed-data-patch.json');
  if (fs.existsSync(patchPath)) {
    patchData = JSON.parse(fs.readFileSync(patchPath, 'utf8'));
  }
} catch (e) {
  console.warn('⚠️ Could not load seed-data-patch.json');
}

export function getSeedPosterUrl(title: string, defaultUrl: string): string {
  if (patchData && patchData.posters && patchData.posters[title]) {
    return patchData.posters[title];
  }
  return defaultUrl;
}

export function getSeedTrailerUrl(title: string, currentUrl: string): string {
  if (patchData && patchData.trailers && patchData.trailers[title]) {
    return patchData.trailers[title];
  }
  return currentUrl;
}

export function getSeedReleaseData(title: string, index: number, movieDate: Date) {
  // If we have exact mapping from current DB, use it
  if (patchData && patchData.releases && patchData.releases[title]) {
    return patchData.releases[title];
  }

  // Fallback to dynamic logic (mix of Now Showing/Upcoming)
  const today = new Date();
  let startDate, endDate, note;

  if (index % 3 === 0) {
    // Now Showing
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 10);
    endDate = new Date(today);
    endDate.setDate(today.getDate() + 20);
    note = 'Now Showing - Seeded dynamic';
  } else if (index % 3 === 1) {
    // Upcoming
    startDate = new Date(today);
    startDate.setDate(today.getDate() + 5);
    endDate = new Date(today);
    endDate.setDate(today.getDate() + 35);
    note = 'Upcoming - Seeded dynamic';
  } else {
    // Recent Release
    startDate = new Date(today);
    startDate.setDate(today.getDate() - 25);
    endDate = new Date(today);
    endDate.setDate(today.getDate() + 15);
    note = 'Recent Release - Seeded dynamic';
  }

  return [{
    startDate,
    endDate,
    note
  }];
}
