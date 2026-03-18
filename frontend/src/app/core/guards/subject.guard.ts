import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../services/data.service';
import { map } from 'rxjs/operators';

export const subjectGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const dataService = inject(DataService);
  const router = inject(Router);
  const name = route.paramMap.get('name')?.toLowerCase();

  return dataService.getSubjects().pipe(
    map(subjects => {
      const exists = subjects.some(s => s.title.toLowerCase() === name);
      if (exists) return true;
      return router.createUrlTree(['/subjects']);
    })
  );
};