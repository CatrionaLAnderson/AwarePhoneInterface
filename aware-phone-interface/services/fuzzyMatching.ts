import levenshtein from "fast-levenshtein";
import { drunkCorrections } from "@/constants/drunkCorrections";

// Find the closest correct word based on Levenshtein Distance
export const fuzzyCorrectWord = (word: string): string => {
  const lowerWord = word.toLowerCase();
  const whitelist = ["to", "no", "so", "on", "go", "do", "up", "it", "i", "me", "we", "he", "us", "at", "of"];
  if (whitelist.includes(lowerWord)) return word;

  let minDistance = Math.max(2, Math.floor(word.length * 0.4));
  let closestMatch = word;

  Object.keys(drunkCorrections).forEach((key) => {
    const distance = levenshtein.get(lowerWord, key);
    if (distance <= minDistance) {
      closestMatch = drunkCorrections[key];
      minDistance = distance;
    }
  });

  // Only apply correction if it's not the same and significantly better
  if (
    closestMatch !== word &&
    levenshtein.get(lowerWord, closestMatch.toLowerCase()) < word.length / 2
  ) {
    return word[0] === word[0].toUpperCase()
      ? closestMatch.charAt(0).toUpperCase() + closestMatch.slice(1)
      : closestMatch;
  }

  return word;
};