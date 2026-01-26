import { provideZard } from '@/shared/core/provider/providezard';
import {
	provideHttpClient,
	withFetch,
	withInterceptors,
} from '@angular/common/http'
import {
	type ApplicationConfig,
	provideBrowserGlobalErrorListeners,
} from '@angular/core'
import { provideRouter } from '@angular/router'
import { authInterceptor } from '@core/interceptors/auth.interceptor'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(routes),
		provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
		provideZard(),
	],
}
