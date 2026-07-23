export interface PlatformIconDefinition {
  readonly path: string;
  readonly viewBox: string;
}

export interface PlatformPresentation {
  readonly icon: PlatformIconDefinition;
  readonly label: string;
}
