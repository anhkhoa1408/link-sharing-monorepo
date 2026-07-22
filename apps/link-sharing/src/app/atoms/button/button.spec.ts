import { Component, ViewEncapsulation } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <app-button>Save</app-button>
    <app-button variant="secondary">Cancel</app-button>
    <app-button [disabled]="true">Delete</app-button>
  `,
})
class ButtonTestHost {}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-button-global-styles-test-host',
  styleUrl: '../../../styles.scss',
  template: '',
})
class GlobalStylesTestHost {}

describe('Button', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonTestHost, GlobalStylesTestHost],
    }).compileComponents();

    TestBed.createComponent(GlobalStylesTestHost).detectChanges();
  });

  it('uses primary filled appearance by default and projects its label', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Save' }));

    expect(await button.getAppearance()).toBe('filled');
    expect(await button.getText()).toBe('Save');
    expect(await button.host().then((host) => host.hasClass('button--primary'))).toBe(
      true,
    );
  });

  it('maps secondary variant to outlined Material appearance', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Cancel' }));

    expect(await button.getAppearance()).toBe('outlined');
    expect(await button.host().then((host) => host.hasClass('button--secondary'))).toBe(
      true,
    );
  });

  it('passes disabled state to Material button', async () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const button = await loader.getHarness(MatButtonHarness.with({ text: 'Delete' }));

    expect(await button.isDisabled()).toBe(true);
  });

  it('fills the available host width', () => {
    const fixture = TestBed.createComponent(ButtonTestHost);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('app-button') as HTMLElement;
    const button = host.querySelector('button') as HTMLButtonElement;

    expect(getComputedStyle(host).display).toBe('block');
    expect(getComputedStyle(host).width).toBe('100%');
    expect(getComputedStyle(button).width).toBe('100%');
  });
});
