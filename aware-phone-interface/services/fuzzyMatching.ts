import levenshtein from "fast-levenshtein";
import { drunkCorrections } from "@/constants/drunkCorrections";

// Function to find the closest correct word based on Levenshtein Distance
export const fuzzyCorrectWord = (word: string): string => {
  let minDistance = 2; // Adjust this threshold to catch small typos
  let closestMatch = word;

  Object.keys(drunkCorrections).forEach((key) => {
    const distance = levenshtein.get(word.toLowerCase(), key);
    
    if (distance <= minDistance) {
      closestMatch = drunkCorrections[key]; // Replace with the correct word
      minDistance = distance;
    }
  });

  if (word[0] === word[0].toUpperCase()) {
    return closestMatch.charAt(0).toUpperCase() + closestMatch.slice(1);
  }
  return closestMatch;
};