import { getSentimentText, getBackgroundColor, getSpectacularBackground } from './sentimentUtils';

describe('sentimentUtils', () => {
  describe('getSentimentText', () => {
    test('returns correct text for various values', () => {
      expect(getSentimentText(10)).toBe('Negative');
      expect(getSentimentText(30)).toBe('Somewhat Negative');
      expect(getSentimentText(45)).toBe('Slightly Negative');
      expect(getSentimentText(50)).toBe('Neutral');
      expect(getSentimentText(55)).toBe('Slightly Positive');
      expect(getSentimentText(70)).toBe('Somewhat Positive');
      expect(getSentimentText(90)).toBe('Positive');
    });
  });

  describe('getBackgroundColor', () => {
    test('returns correct rgb for negative sentiments', () => {
      // 0 should be full red
      expect(getBackgroundColor(0)).toBe('rgb(255, 50, 0)');
    });

    test('returns gold for neutral 50', () => {
      expect(getBackgroundColor(50)).toBe('rgb(255, 215, 0)');
    });

    test('returns correct rgb for positive sentiments', () => {
      // 100 should be rich green
      expect(getBackgroundColor(100)).toBe('rgb(120, 220, 24)');
    });
  });

  describe('getSpectacularBackground', () => {
    test('returns linear gradient string', () => {
      const bg = getSpectacularBackground(50);
      expect(bg).toContain('linear-gradient');
      expect(bg).toContain('hsl(60,85%,50%)');
    });
  });
});
