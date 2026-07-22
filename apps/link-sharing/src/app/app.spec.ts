import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-global-styles-test-host',
  styleUrl: '../styles.scss',
  template: '',
})
class GlobalStylesTestHost {}

describe('App', () => {
  const colorTokens = {
    white: '#ffffff',
    black: '#000000',
    'grey-950': '#1a1a1a',
    'grey-900': '#333333',
    'grey-500': '#737373',
    'grey-200': '#d9d9d9',
    'grey-100': '#eeeeee',
    'grey-50': '#fafafa',
    'blue-800': '#0330d1',
    'blue-500': '#2d68ff',
    'purple-950': '#302267',
    'purple-600': '#633cff',
    'purple-300': '#beadff',
    'red-550': '#ee3939',
    'red-500': '#ff3939',
    'pink-900': '#8a1a50',
    'pink-400': '#f4a28c',
    'orange-600': '#ec7100',
    'orange-500': '#eb4925',
  } as const;

  const typographyTokens = {
    '--font-size-32': '32px',
    '--font-size-24': '24px',
    '--font-size-16': '16px',
    '--font-size-12': '12px',
    '--line-height-150': '1.5',
    '--font-weight-regular': '400',
    '--font-weight-semibold': '600',
    '--font-weight-bold': '700',
  } as const;

  const typographyPresets = {
    '.typography__preset-1': {
      size: 'var(--font-size-32)',
      weight: 'var(--font-weight-bold)',
    },
    '.typography__preset-2': {
      size: 'var(--font-size-24)',
      weight: 'var(--font-weight-bold)',
    },
    '.typography__preset-3--bold': {
      size: 'var(--font-size-16)',
      weight: 'var(--font-weight-bold)',
    },
    '.typography__preset-3--semibold': {
      size: 'var(--font-size-16)',
      weight: 'var(--font-weight-semibold)',
    },
    '.typography__preset-3--regular': {
      size: 'var(--font-size-16)',
      weight: 'var(--font-weight-regular)',
    },
    '.typography__preset-4': {
      size: 'var(--font-size-12)',
      weight: 'var(--font-weight-regular)',
    },
  } as const;

  const spacingTokens = {
    0: '0px',
    100: '8px',
    200: '16px',
    300: '24px',
    400: '32px',
    500: '40px',
    600: '48px',
    700: '56px',
    800: '64px',
  } as const;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, GlobalStylesTestHost],
    }).compileComponents();

    TestBed.createComponent(GlobalStylesTestHost).detectChanges();
  });

  it('renders only the empty routing shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')).toBeNull();
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('exports the Figma color tokens as root custom properties', () => {
    const rootStyles = getComputedStyle(document.documentElement);

    for (const [token, value] of Object.entries(colorTokens)) {
      expect(rootStyles.getPropertyValue(`--color-${token}`).trim().toLowerCase()).toBe(
        value,
      );
    }
  });

  it('exports BEM text-color utilities backed by the color tokens', () => {
    const rules = Array.from(document.styleSheets).flatMap((styleSheet) =>
      Array.from(styleSheet.cssRules),
    );

    for (const token of Object.keys(colorTokens)) {
      const [family, shade] = token.split('-');
      const selector = shade ? `.color__${family}--${shade}` : `.color__${family}`;
      const rule = rules.find(
        (candidate): candidate is CSSStyleRule =>
          candidate instanceof CSSStyleRule && candidate.selectorText === selector,
      );

      expect(rule?.style.getPropertyValue('color')).toBe(`var(--color-${token})`);
    }
  });

  it('exports typography primitives as root custom properties', () => {
    const rootStyles = getComputedStyle(document.documentElement);

    for (const [token, value] of Object.entries(typographyTokens)) {
      expect(rootStyles.getPropertyValue(token).trim()).toBe(value);
    }
  });

  it('exports the Figma typography presets as BEM utilities', () => {
    const rules = Array.from(document.styleSheets).flatMap((styleSheet) =>
      Array.from(styleSheet.cssRules),
    );

    for (const [selector, preset] of Object.entries(typographyPresets)) {
      const rule = rules.find(
        (candidate): candidate is CSSStyleRule =>
          candidate instanceof CSSStyleRule && candidate.selectorText === selector,
      );

      expect(rule?.style.getPropertyValue('font-family')).toBe(
        '"Instrument Sans", sans-serif',
      );
      expect(rule?.style.getPropertyValue('font-size')).toBe(preset.size);
      expect(rule?.style.getPropertyValue('font-weight')).toBe(preset.weight);
      expect(rule?.style.getPropertyValue('line-height')).toBe(
        'var(--line-height-150)',
      );
      expect(rule?.style.getPropertyValue('letter-spacing')).toBe('0');
    }
  });

  it('loads Instrument Sans from Google Fonts WOFF2 sources', () => {
    const fontFaceRules = Array.from(document.styleSheets)
      .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
      .filter((rule) => rule.cssText.startsWith('@font-face'));

    expect(fontFaceRules).toHaveLength(2);
    for (const rule of fontFaceRules) {
      expect(rule.cssText).toContain('font-family: "Instrument Sans"');
      expect(rule.cssText).toContain('font-weight: 400 700');
      expect(rule.cssText).toContain('https://fonts.gstatic.com/');
      expect(rule.cssText).toContain('format("woff2")');
    }
  });

  it('exports the Figma spacing scale as root custom properties', () => {
    const rootStyles = getComputedStyle(document.documentElement);

    for (const [token, value] of Object.entries(spacingTokens)) {
      expect(rootStyles.getPropertyValue(`--spacing-${token}`).trim()).toBe(value);
    }
  });

  it('exports complete directional margin, padding, and gap utilities', () => {
    const rules = new Map(
      Array.from(document.styleSheets)
        .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
        .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
        .map((rule) => [rule.selectorText, rule.style]),
    );

    for (const token of Object.keys(spacingTokens)) {
      const value = `var(--spacing-${token})`;
      const directionalProperties = {
        all: [''],
        top: ['-top'],
        right: ['-right'],
        bottom: ['-bottom'],
        left: ['-left'],
        x: ['-right', '-left'],
        y: ['-top', '-bottom'],
      } as const;

      for (const block of ['margin', 'padding'] as const) {
        for (const [direction, suffixes] of Object.entries(directionalProperties)) {
          const style = rules.get(`.${block}__${direction}--${token}`);
          for (const suffix of suffixes) {
            expect(style?.getPropertyValue(`${block}${suffix}`)).toBe(value);
          }
        }
      }

      expect(rules.get(`.gap__all--${token}`)?.getPropertyValue('gap')).toBe(value);
      expect(rules.get(`.gap__row--${token}`)?.getPropertyValue('row-gap')).toBe(value);
      expect(rules.get(`.gap__column--${token}`)?.getPropertyValue('column-gap')).toBe(
        value,
      );
    }
  });

  it('exports flex display, direction, wrapping, justification, and alignment utilities', () => {
    const rules = new Map(
      Array.from(document.styleSheets)
        .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
        .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
        .map((rule) => [rule.selectorText, rule.style]),
    );
    const utilities = {
      '.flex': ['display', 'flex'],
      '.flex--inline': ['display', 'inline-flex'],
      '.flex__direction--row': ['flex-direction', 'row'],
      '.flex__direction--row-reverse': ['flex-direction', 'row-reverse'],
      '.flex__direction--column': ['flex-direction', 'column'],
      '.flex__direction--column-reverse': ['flex-direction', 'column-reverse'],
      '.flex__wrap--wrap': ['flex-wrap', 'wrap'],
      '.flex__wrap--nowrap': ['flex-wrap', 'nowrap'],
      '.flex__wrap--wrap-reverse': ['flex-wrap', 'wrap-reverse'],
      '.justify--start': ['justify-content', 'flex-start'],
      '.justify--center': ['justify-content', 'center'],
      '.justify--end': ['justify-content', 'flex-end'],
      '.justify--between': ['justify-content', 'space-between'],
      '.justify--around': ['justify-content', 'space-around'],
      '.justify--evenly': ['justify-content', 'space-evenly'],
      '.align-items--start': ['align-items', 'flex-start'],
      '.align-items--center': ['align-items', 'center'],
      '.align-items--end': ['align-items', 'flex-end'],
      '.align-items--baseline': ['align-items', 'baseline'],
      '.align-items--stretch': ['align-items', 'stretch'],
      '.align-content--start': ['align-content', 'flex-start'],
      '.align-content--center': ['align-content', 'center'],
      '.align-content--end': ['align-content', 'flex-end'],
      '.align-content--between': ['align-content', 'space-between'],
      '.align-content--around': ['align-content', 'space-around'],
      '.align-content--evenly': ['align-content', 'space-evenly'],
      '.align-content--stretch': ['align-content', 'stretch'],
      '.align-self--auto': ['align-self', 'auto'],
      '.align-self--start': ['align-self', 'flex-start'],
      '.align-self--center': ['align-self', 'center'],
      '.align-self--end': ['align-self', 'flex-end'],
      '.align-self--baseline': ['align-self', 'baseline'],
      '.align-self--stretch': ['align-self', 'stretch'],
    } as const;

    for (const [selector, [property, value]] of Object.entries(utilities)) {
      expect(rules.get(selector)?.getPropertyValue(property)).toBe(value);
    }

    expect(
      Array.from(rules.keys()).some(
        (selector) =>
          selector.startsWith('.flex__justify') || selector.startsWith('.flex__align'),
      ),
    ).toBe(false);
  });
});
