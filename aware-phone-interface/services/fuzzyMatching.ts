import levenshtein from "fast-levenshtein";
import { drunkCorrections } from "@/constants/drunkCorrections";

// Whitelist of short valid words (skip correcting these)
const whitelist = ["to", "no", "so", "on", "go", "do", "up", "it", "i", "me", "we", "he", "us", "at", "of"];

/**
 * Normalize repeated letters (e.g., "drunnnkkk" → "drunkk")
 */
const normalizeRepeats = (word: string): string =>
  word.replace(/(\w)\1{2,}/g, "$1$1");

/**
 * Preprocess the word by lowercasing and normalizing repeats
 */
const preprocessWord = (word: string): string =>
  normalizeRepeats(word.toLowerCase());

/**
 * Fuzzy correct drunk typos using Levenshtein distance with improvements
 */
export const fuzzyCorrectWord = (word: string): string => {
  const originalWord = word;
  const lowerWord = word.toLowerCase();

  // Don't correct whitelisted words
  if (whitelist.includes(lowerWord)) return word;

  // Preprocess input word
  const processedWord = preprocessWord(lowerWord);

  // Direct lookup first (important for short words like "r" → "are")
  if (drunkCorrections[processedWord]) {
    return preserveCapitalization(originalWord, drunkCorrections[processedWord]);
  }

  let bestMatch = word;
  let bestScore = Infinity;

  // Filter candidate correction keys by length difference
  const candidateKeys = Object.keys(drunkCorrections).filter(
    (key) => Math.abs(key.length - processedWord.length) <= 2
  );

  for (const key of candidateKeys) {
    const distance = levenshtein.get(processedWord, key);
    const threshold = Math.floor(Math.min(processedWord.length, key.length) * 0.4) || 1;

    if (distance > threshold) continue;

    const score = distance + 0.1 * Math.abs(key.length - processedWord.length);

    if (score < bestScore) {
      bestScore = score;
      bestMatch = drunkCorrections[key];

      if (distance === 0) break; // Early exit on perfect match
    }
  }

  // Only apply correction if it’s significantly better
  if (
    bestMatch !== word &&
    levenshtein.get(processedWord, bestMatch.toLowerCase()) < processedWord.length / 2
  ) {
    return preserveCapitalization(originalWord, bestMatch);
  }

  return word;
};

/**
 * Preserve capitalization of the original word
 */
const preserveCapitalization = (original: string, corrected: string): string =>
  original[0] === original[0].toUpperCase()
    ? corrected.charAt(0).toUpperCase() + corrected.slice(1)
    : corrected;