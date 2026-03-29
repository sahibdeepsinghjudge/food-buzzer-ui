import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-403',
  imports: [RouterModule],
  template: `
    <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-100 font-sans">
      <div class="relative flex justify-center items-center">
        <h1 class="text-[12rem] font-extrabold tracking-tighter text-amber-500/20 dark:text-amber-500/10">403</h1>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-amber-500 to-yellow-600 dark:from-amber-400 dark:to-yellow-500 drop-shadow-sm">403</span>
            <div class="mt-2 bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 dark:border-amber-400/20 px-3 py-1 text-sm rounded-full text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
                Access Denied
            </div>
        </div>
      </div>
      <p class="mt-4 text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 max-w-md text-center px-4">Sorry, you don't have permission to view this page. Please contact your administrator if you believe this is an error.</p>
      
      <a routerLink="/" class="mt-10 group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 ease-in-out bg-amber-500 border border-transparent rounded-full shadow-md hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:focus:ring-offset-zinc-950 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30">
        <span class="relative flex items-center gap-2">
            <span class="material-icons-outlined text-xl">arrow_back</span>
            Go Back Safe
        </span>
      </a>
    </div>
  `
})
export class Error403 {}
