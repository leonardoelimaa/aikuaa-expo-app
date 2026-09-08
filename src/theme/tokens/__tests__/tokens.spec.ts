import { colors, typography, spacing, radius, shadows, animations } from '../';

describe('theme tokens', () => {
  describe('colors', () => {
    it('has verified cream and navy palette keys with non-empty values', () => {
      expect(colors.cream[50]).toBe('#faf9f6');
      expect(colors.cream[100]).toBe('#f5f3ed');
      expect(colors.cream[200]).toBe('#ebe8df');
      expect(colors.navy[950]).toBe('#0a1628');
      expect(colors.navy[900]).toBe('#0f1f38');
      expect(colors.navy[800]).toBe('#162b4a');
      expect(colors.navy[700]).toBe('#1e3a61');
      expect(colors.navy[600]).toBe('#2a4d7a');
      expect(colors.navy[500]).toBe('#4a6b96');
      expect(colors.navy[400]).toBe('#7a96b8');
      expect(colors.navy[300]).toBe('#a8bdd4');
      expect(colors.white).toBe('#ffffff');
    });

    it('has semantic light and dark mappings with non-empty values', () => {
      expect(colors.semantic.light.paper).toBe(colors.cream[50]);
      expect(colors.semantic.light.surface).toBe(colors.white);
      expect(colors.semantic.light.ink).toBe(colors.navy[950]);
      expect(colors.semantic.light.muted).toBe(colors.navy[500]);
      expect(colors.semantic.light.line).toBe(colors.cream[200]);
      expect(colors.semantic.light.proof).toBe(colors.navy[900]);
      expect(colors.semantic.light.navyText).toBe(colors.navy[500]);
      expect(colors.semantic.light.headerBg.color).toBe(colors.cream[50]);
      expect(colors.semantic.light.headerBg.opacity).toBeGreaterThan(0);
      expect(colors.semantic.light.focus).toBe(colors.navy[900]);

      expect(colors.semantic.dark.paper).toBe(colors.navy[900]);
      expect(colors.semantic.dark.surface).toBe(colors.navy[800]);
      expect(colors.semantic.dark.ink).toBe(colors.cream[50]);
      expect(colors.semantic.dark.muted).toBe(colors.cream[100]);
      expect(colors.semantic.dark.line).toBe(colors.navy[700]);
      expect(colors.semantic.dark.proof).toBe(colors.navy[800]);
      expect(colors.semantic.dark.navyText).toBe(colors.cream[100]);
      expect(colors.semantic.dark.headerBg.color).toBe(colors.navy[900]);
      expect(colors.semantic.dark.focus).toBe(colors.cream[50]);
    });
  });

  describe('typography', () => {
    it('has family, weight, size, lineHeight and letterSpacing groups', () => {
      expect(typography.family.display).toBeTruthy();
      expect(typography.family.body).toBeTruthy();
      expect(typography.family.mono).toBeTruthy();
      expect(typography.weight.regular).toBe(400);
      expect(typography.weight.semibold).toBe(600);
      expect(typography.weight.bold).toBe(700);
      expect(Object.keys(typography.size).length).toBeGreaterThan(0);
      expect(Object.keys(typography.lineHeight).length).toBeGreaterThan(0);
      expect(Object.keys(typography.letterSpacing).length).toBeGreaterThan(0);
    });
  });

  describe('spacing', () => {
    it('has a non-empty scale', () => {
      expect(Object.keys(spacing).length).toBeGreaterThan(0);
      expect(spacing[4]).toBe(16);
    });
  });

  describe('radius', () => {
    it('has a non-empty scale', () => {
      expect(Object.keys(radius).length).toBeGreaterThan(0);
      expect(radius.full).toBe(9999);
    });
  });

  describe('shadows', () => {
    it('has a non-empty scale', () => {
      expect(Object.keys(shadows).length).toBeGreaterThan(0);
      expect(shadows.sm.color).toBe(colors.navy[950]);
    });
  });

  describe('animations', () => {
    it('has duration and easing groups', () => {
      expect(Object.keys(animations.duration).length).toBeGreaterThan(0);
      expect(Object.keys(animations.easing).length).toBeGreaterThan(0);
    });
  });
});
