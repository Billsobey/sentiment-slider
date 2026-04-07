import { getSentimentText, getSpectacularBackground } from './sentimentUtils';

describe('sentimentUtils', () => {
  describe('getSentimentText', () => {
    it('returns Negative for values < 20', () => {
      expect(getSentimentText(0)).toBe('Negative');
      expect(getSentimentText(19)).toBe('Negative');
    });

    it('returns Somewhat Negative for values 20 to 39', () => {
      expect(getSentimentText(20)).toBe('Somewhat Negative');
      expect(getSentimentText(39)).toBe('Somewhat Negative');
    });

    it('returns Slightly Negative for values 40 to 47', () => {
      expect(getSentimentText(40)).toBe('Slightly Negative');
      expect(getSentimentText(47)).toBe('Slightly Negative');
    });

    it('returns Neutral for values 48 to 52', () => {
      expect(getSentimentText(48)).toBe('Neutral');
      expect(getSentimentText(50)).toBe('Neutral');
      expect(getSentimentText(52)).toBe('Neutral');
    });

    it('returns Slightly Positive for values 53 to 60', () => {
      expect(getSentimentText(53)).toBe('Slightly Positive');
      expect(getSentimentText(60)).toBe('Slightly Positive');
    });

    it('returns Somewhat Positive for values 61 to 80', () => {
      expect(getSentimentText(61)).toBe('Somewhat Positive');
      expect(getSentimentText(80)).toBe('Somewhat Positive');
    });

    it('returns Positive for values > 80', () => {
      expect(getSentimentText(81)).toBe('Positive');
      expect(getSentimentText(100)).toBe('Positive');
    });
  });

  describe('getSpectacularBackground', () => {
    it('returns a linear-gradient for 0 (reddish)', () => {
      const bg = getSpectacularBackground(0);
      expect(bg).toBe('linear-gradient(90deg, hsl(0,85%,50%), hsl(20,85%,50%))');
    });

    it('returns a linear-gradient for 50 (yellowish)', () => {
      const bg = getSpectacularBackground(50);
      // (50 / 100) * 120 = 60
      // 60 + 20 = 80
      expect(bg).toBe('linear-gradient(90deg, hsl(60,85%,50%), hsl(80,85%,50%))');
    });

    it('returns a linear-gradient for 100 (greenish)', () => {
      const bg = getSpectacularBackground(100);
      // (100 / 100) * 120 = 120
      // Math.min(120, 120 + 20) = 120
      expect(bg).toBe('linear-gradient(90deg, hsl(120,85%,50%), hsl(120,85%,50%))');
    });

    it('returns a linear-gradient for 25', () => {
      const bg = getSpectacularBackground(25);
      // (25 / 100) * 120 = 30
      // 30 + 20 = 50
      expect(bg).toBe('linear-gradient(90deg, hsl(30,85%,50%), hsl(50,85%,50%))');
    });

    it('returns a linear-gradient for 75', () => {
      const bg = getSpectacularBackground(75);
      // (75 / 100) * 120 = 90
      // 90 + 20 = 110
      expect(bg).toBe('linear-gradient(90deg, hsl(90,85%,50%), hsl(110,85%,50%))');
    });
  });
});
