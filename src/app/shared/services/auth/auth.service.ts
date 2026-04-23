import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequest, LoginResponse, AuthState } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isLoggedIn: this.checkStoredAuth(),
    token: localStorage.getItem('auth_token'),
    userId: localStorage.getItem('user_id'),
    email: localStorage.getItem('user_email')
  });

  public authState$ = this.authState.asObservable();
  private apiUrl = environment.baseAPIURL + environment.loginEndpoint;

  constructor(private router: Router, private http: HttpClient) { }

  /**
   * Login with email and password via API
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const body = new HttpParams()
      .set('usr', credentials.email)
      .set('pwd', credentials.password)
      .toString();

    return this.http.post<any>(this.apiUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }),
      withCredentials: true
    }).pipe(
      map((response) => {
        const isSuccess = !response?.exc_type && !!response?.message;
        return {
          success: isSuccess,
          message: response?.message || (isSuccess ? 'Logged In' : 'Login failed')
        } as LoginResponse;
      }),
      switchMap((response) => {
        if (!response.success) {
          return of(response);
        }

        return this.fetchLoggedInUserAndRoles(credentials.email).pipe(
          map(({ userId, roles }) => ({
            ...response,
            userId,
            userData: {
              roles
            }
          } as LoginResponse)),
          catchError(() => of({
            ...response,
            userId: credentials.email,
            userData: {
              roles: ['Authenticated User']
            }
          } as LoginResponse))
        );
      }),
      switchMap((response) => {
        if (!response.success) {
          return of(response);
        }

        return this.verifyProtectedRoleApi().pipe(
          map((roleApiStatus) => ({
            ...response,
            userData: {
              ...(response.userData || {}),
              roleApiStatus
            }
          } as LoginResponse)),
          catchError(() => of({
            ...response,
            userData: {
              ...(response.userData || {}),
              roleApiStatus: 'unknown'
            }
          } as LoginResponse))
        );
      }),
      tap(response => {
        if (response.success) {
          const roles = response?.userData?.roles || ['Authenticated User'];
          const user = response.userId || credentials.email;
          const roleApiStatus = response?.userData?.roleApiStatus || 'unknown';

          // Store authentication data
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('user_email', credentials.email);
          
          if (response.token) {
            localStorage.setItem('auth_token', response.token);
          }
          if (response.userId) {
            localStorage.setItem('user_id', response.userId.toString());
          }

          // Update auth state
          this.authState.next({
            isLoggedIn: true,
            token: response.token || null,
            userId: response.userId || null,
            email: credentials.email
          });

          console.warn('LOGIN SUCCESS', {
            user,
            roles,
            roleApiStatus
          });

          sessionStorage.setItem('login_audit', JSON.stringify({
            user,
            roles,
            roleApiStatus,
            at: new Date().toISOString()
          }));

          // Navigate to home
          this.router.navigate(['/']);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        // Extract error message from response
        let errorMessage = 'Login failed. Please try again.';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.status === 0) {
          errorMessage = 'Unable to connect to server.';
        } else if (error?.status === 401) {
          errorMessage = error?.error?.message || 'Invalid username or password.';
        } else if (error?.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        }
        return throwError(() => ({
          error: {
            message: errorMessage
          },
          status: error?.status
        }));
      })
    );
  }

  private fetchLoggedInUserAndRoles(defaultUser: string): Observable<{ userId: string; roles: string[] }> {
    return this.http.get<any>(`${environment.baseAPIURL}api/method/frappe.auth.get_logged_user`, {
      withCredentials: true
    }).pipe(
      map((res) => ({
        userId: String(res?.message || defaultUser),
        roles: ['Authenticated User']
      })),
      catchError(() => of({
        userId: defaultUser,
        roles: ['Authenticated User']
      }))
    );
  }

  private verifyProtectedRoleApi(): Observable<'ok' | 'forbidden' | 'unauthorized' | 'error'> {
    const params = new HttpParams().set('limit_page_length', '1');

    return this.http.get<any>(`${environment.baseAPIURL}api/resource/Role`, {
      params,
      withCredentials: true
    }).pipe(
      map(() => 'ok' as const),
      catchError((error) => {
        if (error?.status === 403) {
          return of('forbidden' as const);
        }
        if (error?.status === 401) {
          return of('unauthorized' as const);
        }
        return of('error' as const);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('isLogged');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');

    this.authState.next({
      isLoggedIn: false,
      token: null,
      userId: null,
      email: null
    });

    this.router.navigate(['/login']);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('isLogged');
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return localStorage.getItem('user_id');
  }

  /**
   * Get current user email
   */
  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  /**
   * Check if there's stored authentication data
   */
  private checkStoredAuth(): boolean {
    return !!localStorage.getItem('isLogged');
  }
}
