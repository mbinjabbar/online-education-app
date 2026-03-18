import { Routes } from '@angular/router';
import { SubjectsListComponent } from './features/subjects/subjects-list/subjects-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { VideosListComponent } from './features/videos/videos-list/videos-list.component';
import { authGuard } from './core/guards/auth.guard';
import { loginGuard } from './core/guards/login.guard';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ProfileComponent } from './features/profile/profile.component';
import { subjectGuard } from './core/guards/subject.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [loginGuard] },
    { path: 'subjects', component: SubjectsListComponent, canActivate: [authGuard] },
    { path: 'subjects/:name', component: VideosListComponent, canActivate: [authGuard, subjectGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];