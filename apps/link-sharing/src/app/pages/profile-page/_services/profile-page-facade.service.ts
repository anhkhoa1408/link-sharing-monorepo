import { httpResource } from '@angular/common/http';
import {
  computed,
  effect,
  inject,
  Injectable,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import type { ProfilePage } from '@link-sharing/shared-models';
import { ProfilePageApiService } from '../../../api/profile-page-api.service';
import { AuthService } from '../../../core/auth.service';

@Injectable()
export class ProfilePageFacadeService {
  private readonly api = inject(ProfilePageApiService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routeData = toSignal(this.route.data, {
    initialValue: this.route.snapshot.data,
  });
  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  private readonly requestUrl = computed(() => {
    if (this.isOwnerPreview()) {
      return this.api.currentUrl();
    }

    const userId = this.routeParams().get('userId');

    return userId ? this.api.publicUrl(userId) : undefined;
  });

  public readonly isOwnerPreview = computed(
    () => this.routeData()['ownerPreview'] === true,
  );
  public readonly profilePage = httpResource<ProfilePage>(
    () => this.requestUrl(),
    { debugName: 'profile-page' },
  );
  public readonly isPublicNotFound = computed(
    () =>
      !this.isOwnerPreview() &&
      [400, 404].includes(this.profilePage.statusCode() ?? 0),
  );

  public constructor() {
    effect(() => {
      if (
        this.isOwnerPreview() &&
        this.profilePage.statusCode() === 401
      ) {
        this.auth.logout();
        void this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }

  public reload(): void {
    this.profilePage.reload();
  }
}
