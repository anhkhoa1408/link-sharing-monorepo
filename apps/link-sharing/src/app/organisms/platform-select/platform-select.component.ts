import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { MatOption } from '@angular/material/core';
import {
  MatSelect,
  type MatSelectChange,
  MatSelectTrigger,
} from '@angular/material/select';
import {
  PLATFORM_VALUES,
  type Platform,
} from '@link-sharing/shared-models';

interface PlatformIconDefinition {
  readonly path: string;
  readonly viewBox: string;
}

interface PlatformPresentation {
  readonly icon: PlatformIconDefinition;
  readonly label: string;
}

interface PlatformOption extends PlatformPresentation {
  readonly value: Platform;
}

const PLATFORM_PRESENTATION = {
  GITHUB: {
    label: 'GitHub',
    icon: {
      viewBox: '0 0 15 15',
      path: 'M9.358 2.145a8.2 8.2 0 0 0-3.716 0c-.706-.433-1.245-.632-1.637-.716a2.2 2.2 0 0 0-.51-.053 1.3 1.3 0 0 0-.232.028l-.01.002-.004.002h-.003l.137.481-.137-.48a.5.5 0 0 0-.32.276 3.12 3.12 0 0 0-.159 2.101A3.35 3.35 0 0 0 2 5.93c0 1.553.458 2.597 1.239 3.268.547.47 1.211.72 1.877.863a2.3 2.3 0 0 0-.116.958v.598c-.407.085-.689.058-.89-.008-.251-.083-.444-.25-.629-.49a5 5 0 0 1-.27-.402l-.057-.093a9 9 0 0 0-.224-.354c-.19-.281-.472-.633-.928-.753l-.484-.127-.254.968.484.127c.08.02.184.095.355.346a7 7 0 0 1 .19.302l.068.11c.094.152.202.32.327.484.253.33.598.663 1.11.832.35.116.748.144 1.202.074V14.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-3.562c0-.316-.014-.605-.103-.874.663-.14 1.322-.39 1.866-.86.78-.676 1.237-1.73 1.237-3.292v-.001a3.35 3.35 0 0 0-.768-2.125 3.12 3.12 0 0 0-.159-2.1.5.5 0 0 0-.319-.277l-.137.48c.137-.48.136-.48.135-.48l-.002-.001-.004-.002-.009-.002-.075-.015a1 1 0 0 0-.158-.013 2.2 2.2 0 0 0-.51.053c-.391.084-.93.283-1.636.716',
    },
  },
  FRONTEND_MENTOR: {
    label: 'Frontend Mentor',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12.17 1.272a.73.73 0 0 0-.718.732v13.914a.73.73 0 0 0 .732.732.73.73 0 0 0 .732-.732V2.004a.73.73 0 0 0-.745-.732M23.246 5.44a.7.7 0 0 0-.277.063l-6.282 2.804a.733.733 0 0 0 0 1.336l6.282 2.814a.7.7 0 0 0 .3.064.732.732 0 0 0 .297-1.4L18.78 8.976l4.786-2.137a.734.734 0 0 0 .37-.966.73.73 0 0 0-.69-.433m-22.5 5.032a.732.732 0 0 0-.722.915c1.736 6.677 7.775 11.341 14.683 11.341a.732.732 0 0 0 0-1.464A13.706 13.706 0 0 1 1.44 11.02a.73.73 0 0 0-.694-.547',
    },
  },
  TWITTER: {
    label: 'Twitter',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23',
    },
  },
  LINKEDIN: {
    label: 'LinkedIn',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z',
    },
  },
  YOUTUBE: {
    label: 'YouTube',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38.945.266 1.687 1.04 1.938 2.022.4 1.56.45 4.602.456 5.339l.001.152v.174c-.007.737-.057 3.78-.457 5.339-.254.985-.997 1.76-1.938 2.022-.709.197-2.137.313-3.566.38l-.504.023c-1.42.056-2.756.07-3.29.072l-.235.001h-.255c-1.13-.007-5.856-.058-7.36-.476-.944-.266-1.687-1.04-1.938-2.022-.4-1.56-.45-4.602-.456-5.339v-.326c.006-.737.056-3.78.456-5.339.254-.985.997-1.76 1.939-2.021 1.503-.419 6.23-.47 7.36-.476zM9.999 8.5v7l6-3.5z',
    },
  },
  FACEBOOK: {
    label: 'Facebook',
    icon: {
      viewBox: '0 0 16 16',
      path: 'M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951',
    },
  },
  TWITCH: {
    label: 'Twitch',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2 3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z',
    },
  },
  DEV_TO: {
    label: 'Dev.to',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18M0 4.94v14.12h24V4.94zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3m5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z',
    },
  },
  CODEWARS: {
    label: 'Codewars',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M1.072.142A1.07 1.07 0 0 0 0 1.214v21.572a1.07 1.07 0 0 0 1.072 1.072h21.856A1.07 1.07 0 0 0 24 22.786V1.214A1.07 1.07 0 0 0 22.928.142zm9.736 1.818a.9.9 0 0 1 .828.539.784.784 0 0 1 1.274.493.64.64 0 0 1 .29-.06c.33.008.59.262.625.575a1.32 1.32 0 0 1 .624-.515 1.325 1.325 0 0 1 1.718.71 1.1 1.1 0 0 1 .306-.236 1.1 1.1 0 0 1 1.483.479 1.1 1.1 0 0 1 .12.47.994.994 0 0 1 1.322 1.214.904.904 0 0 1 .874 1.438.784.784 0 0 1 .176 1.356.64.64 0 0 1 .19.224.64.64 0 0 1-.011.613 1.3 1.3 0 0 1 .482.235 1.334 1.334 0 0 1 .258 1.842 1.1 1.1 0 0 1 .35.15 1.1 1.1 0 0 1 .337 1.516 1.1 1.1 0 0 1-.344.344.994.994 0 0 1 .228 1.318 1 1 0 0 1-.605.434.904.904 0 0 1-.803 1.482l-.008-.04a.784.784 0 0 1-1.075.873.64.64 0 0 1-.098.28.63.63 0 0 1-.43.288 1.3 1.3 0 0 1 .023.456 1.334 1.334 0 0 1-1.44 1.173 1.1 1.1 0 0 1 .054.377 1.1 1.1 0 0 1-1.128 1.072 1.1 1.1 0 0 1-.47-.12.994.994 0 0 1-1.696.583.904.904 0 0 1-1.685.075.784.784 0 0 1-1.274-.493.64.64 0 0 1-.29.064.64.64 0 0 1-.621-.58l.004-.007a1.33 1.33 0 0 1-.632.523 1.334 1.334 0 0 1-1.718-.706 1.1 1.1 0 0 1-.306.232 1.1 1.1 0 0 1-1.48-.478 1.1 1.1 0 0 1-.123-.471.994.994 0 0 1-1.318-1.21.904.904 0 0 1-.874-1.442.784.784 0 0 1-.176-1.356.64.64 0 0 1-.194-.224.64.64 0 0 1 .011-.61l.019.004a1.3 1.3 0 0 1-.497-.239 1.334 1.334 0 0 1-.262-1.845 1.1 1.1 0 0 1-.35-.146 1.1 1.1 0 0 1-.337-1.52 1.1 1.1 0 0 1 .347-.34A.994.994 0 0 1 2.88 9a.904.904 0 0 1 .803-1.48.784.784 0 0 1 1.083-.836.64.64 0 0 1 .098-.28.65.65 0 0 1 .433-.288 1.3 1.3 0 0 1-.026-.452A1.334 1.334 0 0 1 6.716 4.49a1.1 1.1 0 0 1-.06-.377 1.1 1.1 0 0 1 1.13-1.073 1.1 1.1 0 0 1 .47.115.994.994 0 0 1 1.696-.579.9.9 0 0 1 .857-.617zM3.683 7.519l.008.041-.004-.04zM17.502 19.61l-.002-.004h-.037z',
    },
  },
  CODEPEN: {
    label: 'CodePen',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M16.5 13.202 13 15.535v3.596L19.197 15zM14.697 12 12 10.202 9.303 12 12 13.798zM20 10.868 18.303 12 20 13.132zM19.197 9 13 4.869v3.596l3.5 2.333zM7.5 10.798 11 8.465V4.869L4.803 9zM4.803 15 11 19.131v-3.596l-3.5-2.333zM4 13.132 5.697 12 4 10.868zM2 9a1 1 0 0 1 .445-.832l9-6a1 1 0 0 1 1.11 0l9 6A1 1 0 0 1 22 9v6a1 1 0 0 1-.445.832l-9 6a1 1 0 0 1-1.11 0l-9-6A1 1 0 0 1 2 15z',
    },
  },
  FREE_CODE_CAMP: {
    label: 'freeCodeCamp',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M19.885 3.906a.62.62 0 0 0-.354.12c-.08.08-.161.196-.161.313 0 .2.236.474.673.923 1.822 1.754 2.738 3.903 2.732 6.494-.007 2.867-.97 5.17-2.844 6.954-.394.353-.556.63-.557.867 0 .116.08.237.16.353a.58.58 0 0 0 .353.162c.434 0 1.04-.512 1.833-1.509 1.542-1.89 2.24-3.978 2.279-6.824.036-2.847-.857-4.777-2.603-6.77-.63-.712-1.153-1.082-1.511-1.083m-15.769.002c-.358 0-.882.37-1.51 1.083C.858 6.984-.035 8.914.001 11.761c.04 2.846.737 4.933 2.28 6.824.791.997 1.398 1.51 1.832 1.509a.57.57 0 0 0 .352-.162c.08-.116.16-.237.16-.353 0-.237-.162-.514-.556-.866-1.873-1.785-2.837-4.087-2.844-6.955-.006-2.591.91-4.74 2.732-6.494.437-.449.674-.722.673-.923 0-.117-.08-.233-.161-.313a.62.62 0 0 0-.354-.12zm7.056.895s.655 2.081-2.649 6.727c-3.156 4.433 1.045 7.15 1.432 7.386-.281-.18-2.001-1.5.402-5.423.466-.77 1.076-1.47 1.834-3.041 0 0 .67.946.32 2.998-.523 3.101 2.271 2.214 2.314 2.257.976 1.15-.808 3.17-.917 3.233-.108.061 5.096-3.13 1.399-7.935-.253.253-.582 1.442-1.267 1.266-.684-.174 2.125-3.494-2.868-7.468M9.955 18.916q.036.024.038.024z',
    },
  },
  GITLAB: {
    label: 'GitLab',
    icon: {
      viewBox: '0 0 24 24',
      path: 'm21.663 9.987-.028-.072-2.719-7.094a.71.71 0 0 0-.706-.449.71.71 0 0 0-.654.522L15.72 8.52H8.282L6.443 2.895a.71.71 0 0 0-.652-.524.72.72 0 0 0-.707.45L2.362 9.925l-.028.07a5.06 5.06 0 0 0 1.674 5.838l.01.007.024.019 4.147 3.104 2.05 1.553 1.247.944a.84.84 0 0 0 1.016 0l1.247-.944 2.05-1.553 4.172-3.123.01-.008a5.055 5.055 0 0 0 1.682-5.845',
    },
  },
  HASHNODE: {
    label: 'Hashnode',
    icon: {
      viewBox: '0 0 512 512',
      path: 'M35.19 171.1c-46.91 46-46.91 122.9 0 169.8L171.1 476.8c46 46.9 122.9 46.9 169.8 0l135.9-135.9c46.9-46.9 46.9-123.8 0-169.8L340.9 35.19c-46.9-46.91-123.8-46.91-169.8 0zM315.5 315.5c-32.9 32.8-86.1 32.8-118.9 0-32.9-32.9-32.9-86.1 0-118.9 32.8-32.9 86-32.9 118.9 0 32.8 32.8 32.8 86 0 118.9',
    },
  },
  STACK_OVERFLOW: {
    label: 'Stack Overflow',
    icon: {
      viewBox: '0 0 32 32',
      path: 'M25.312 29.151v-8.536h2.849V32H2.458V20.615h2.839v8.536zM8.145 26.307h14.324v-2.848H8.145zm.35-6.468 13.975 2.916.599-2.76L9.1 17.083zm1.812-6.74 12.939 6.037 1.203-2.6-12.937-6.041-1.204 2.584zm3.62-6.38L24.88 15.86l1.813-2.163L15.74 4.562l-1.803 2.151zM21 0l-2.328 1.724 8.541 11.473 2.328-1.724z',
    },
  },
} satisfies Record<Platform, PlatformPresentation>;

const PLATFORM_OPTIONS: readonly PlatformOption[] = PLATFORM_VALUES.map(
  (value) => ({ value, ...PLATFORM_PRESENTATION[value] }),
);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatOption, MatSelect, MatSelectTrigger],
  selector: 'app-platform-select',
  template: `
    <div class="platform-select">
      <mat-select
        class="platform-select__control"
        panelWidth="auto"
        [attr.aria-invalid]="invalid()"
        [aria-label]="ariaLabel()"
        [canSelectNullableOptions]="true"
        [disabled]="disabled()"
        [disableRipple]="true"
        [disableOptionCentering]="true"
        [hideSingleSelectionIndicator]="true"
        [panelClass]="'platform-select-panel'"
        [required]="required()"
        [value]="value()"
        (blur)="touch.emit()"
        (openedChange)="isOpen.set($event)"
        (selectionChange)="onSelectionChange($event)"
      >
        <mat-select-trigger>
          <span class="platform-select__visual">
            @if (selectedOption(); as selected) {
              <svg
                aria-hidden="true"
                class="platform-select__icon"
                [attr.viewBox]="selected.icon.viewBox"
              >
                <path [attr.d]="selected.icon.path" fill="currentColor" />
              </svg>
              <span class="platform-select__label">{{ selected.label }}</span>
            } @else {
              <svg
                aria-hidden="true"
                class="platform-select__icon"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6.114 10.829 5.17 11.77a2.667 2.667 0 0 1-3.771-3.77l1.885-1.886a2.667 2.667 0 0 1 3.772 0M9.886 5.171l.943-.942A2.667 2.667 0 0 1 14.6 8l-1.885 1.886a2.667 2.667 0 0 1-3.772 0M5.643 10.357l4.714-4.714"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.75"
                />
              </svg>
              <span class="platform-select__label">{{ placeholder() }}</span>
            }

            <svg
              aria-hidden="true"
              class="platform-select__chevron"
              [class.platform-select__chevron--open]="isOpen()"
              fill="none"
              viewBox="0 0 12 6"
            >
              <path
                d="m1 1 5 4 5-4"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </span>
        </mat-select-trigger>

        <mat-option
          class="platform-select-option platform-select-option--placeholder"
          [value]="null"
          disabled
        >
          {{ placeholder() }}
        </mat-option>

        @for (option of options; track option.value) {
          <mat-option
            class="platform-select-option"
            [value]="option.value"
          >
            <span class="platform-select-option__content">
              <svg
                aria-hidden="true"
                class="platform-select-option__icon"
                [attr.viewBox]="option.icon.viewBox"
              >
                <path [attr.d]="option.icon.path" fill="currentColor" />
              </svg>
              <span class="platform-select-option__label">
                {{ option.label }}
              </span>
            </span>
          </mat-option>
        }
      </mat-select>
    </div>
  `,
  styles: `
    .platform-select {
      position: relative;
      width: 100%;

      &__control.mat-mdc-select {
        width: 100%;
        min-height: 58px;
        padding: var(--spacing-200);
        overflow: hidden;
        border: 1px solid var(--color-grey-200);
        border-radius: 8px;
        background: var(--color-white);
        color: var(--color-grey-900);

        &:focus-within,
        &.mat-mdc-select-open {
          border-color: var(--color-purple-600);
          outline: 0;
          box-shadow: 0 0 32px rgb(99 60 255 / 25%);
        }

        &[aria-disabled='true'] {
          opacity: 0.5;
        }

        .mat-mdc-select-trigger {
          min-height: 24px;
        }

        .mat-mdc-select-arrow-wrapper {
          display: none;
        }
      }

      &__visual {
        display: flex;
        width: 100%;
        min-width: 0;
        align-items: center;
        gap: var(--spacing-200);
        color: var(--color-grey-900);
        font-family: 'Instrument Sans', sans-serif;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-150);
      }

      &__label {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__icon {
        width: 16px;
        height: 16px;
        flex: 0 0 16px;
        color: var(--color-grey-500);
      }

      &__chevron {
        width: 12px;
        height: 6px;
        flex: 0 0 12px;
        color: var(--color-purple-600);
        transition: transform 120ms ease;

        &--open {
          transform: rotate(180deg);
        }
      }
    }

    .platform-select-panel.mat-mdc-select-panel {
      display: flex;
      max-height: min(798px, calc(100vh - 32px));
      flex-direction: column;
      padding: var(--spacing-200);
      overflow-y: auto;
      border: 1px solid var(--color-grey-200);
      border-radius: 8px;
      background: var(--color-white);
      box-shadow: 0 0 32px rgb(0 0 0 / 10%);

      .mat-mdc-option.platform-select-option {
        min-height: 24px;
        padding: 0;
        background: var(--color-white);
        color: var(--color-grey-900);
        font-family: 'Instrument Sans', sans-serif;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-150);

        &:not(:last-child) {
          padding-bottom: var(--spacing-200);
          margin-bottom: var(--spacing-200);
          border-bottom: 1px solid var(--color-grey-200);
        }

        &:hover,
        &.mdc-list-item--selected {
          background: var(--color-white);
        }

        &.mat-mdc-option-active:not(.mdc-list-item--selected) {
          outline: 2px solid var(--color-purple-600);
          outline-offset: -2px;
          background: var(--color-grey-50);
        }

        &.mdc-list-item--selected {
          color: var(--color-purple-600);
        }

        .mat-pseudo-checkbox,
        .mat-mdc-option-ripple {
          display: none;
        }
      }

      .platform-select-option {
        &--placeholder {
          display: none;
        }

        &__content {
          display: flex;
          width: 100%;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        &__icon {
          width: 16px;
          height: 16px;
          flex: 0 0 16px;
          color: var(--color-grey-500);
        }

        &__label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .mat-mdc-option.platform-select-option.mdc-list-item--selected
        .platform-select-option__icon {
        color: var(--color-purple-600);
      }
    }
  `,
})
export class PlatformSelectComponent
  implements FormValueControl<Platform | null>
{
  private readonly select = viewChild.required(MatSelect);

  public readonly value = model.required<Platform | null>();
  public readonly ariaLabel = input.required<string>();
  public readonly placeholder = input('Select a platform');
  public readonly disabled = input(false);
  public readonly required = input(false);
  public readonly invalid = input(false);
  public readonly touch = output<void>();

  protected readonly options = PLATFORM_OPTIONS;
  protected readonly isOpen = signal(false);
  protected readonly selectedOption = computed(() => {
    const value = this.value();
    return value === null ? null : PLATFORM_PRESENTATION[value];
  });

  public focus(options?: FocusOptions): void {
    this.select().focus(options);
  }

  protected onSelectionChange(
    event: MatSelectChange<Platform | null>,
  ): void {
    this.value.set(event.value);
  }
}
