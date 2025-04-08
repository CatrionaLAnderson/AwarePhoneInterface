import levenshtein from "fast-levenshtein";
import { drunkCorrections } from "@/constants/drunkCorrections";

// Find the closest correct word based on Levenshtein Distance
export const fuzzyCorrectWord = (word: string): string => {
  let minDistance = 2; // Threshold to catch small typos
  let closestMatch = word; // Default to the original word

  // Iterate through the drunk corrections dictionary
  Object.keys(drunkCorrections).forEach((key) => {
    const distance = levenshtein.get(word.toLowerCase(), key); // Calculate Levenshtein distance

    if (distance <= minDistance) {
      closestMatch = drunkCorrections[key]; // Replace with the correct word
      minDistance = distance; // Update the minimum distance
    }
  });

  // Preserve capitalization of the original word
  if (word[0] === word[0].toUpperCase()) {
    return closestMatch.charAt(0).toUpperCase() + closestMatch.slice(1);
  }
  return closestMatch; // Return the corrected word
};