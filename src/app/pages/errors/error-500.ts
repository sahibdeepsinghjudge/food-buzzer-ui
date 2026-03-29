import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-500',
  imports: [RouterModule],
  template: `
    <div class="h-screen w-full flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-gray-100 font-sans">
      <div class="relative flex justify-center items-center">
        <h1 class="text-[12rem] font-extrabold tracking-tighter text-rose-600/20 dark:text-rose-500/10">500</h1>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-rose-500 to-orange-500 dark:from-rose-400 dark:to-orange-400 drop-shadow-sm">500</span>
            <div class="mt-2 bg-rose-600/10 dark:bg-rose-500/10 border border-rose-500/20 dark:border-rose-400/20 px-3 py-1 text-sm rounded-full text-rose-700 dark:text-rose-400 font-semibold uppercase tracking-wider">
                Internal Server Error
            </div>
        </div>
      </div>
      <p class="mt-4 text-lg md:text-xl font-medium text-gray-600 dark:text-gray-400 max-w-md text-center px-4">Oops! Something went wrong on our servers. Our team has been notified and is working on it.</p>
      
      <a routerLink="/" class="mt-10 group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 ease-in-out bg-rose-600 border border-transparent rounded-full shadow-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 dark:focus:ring-offset-zinc-950 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/30">
        <span class="relative flex items-center gap-2">
            <span class="material-icons-outlined text-xl">refresh</span>
            Try Again
        </span>
      </a>
    </div>
  `
})
export class Error500 {}
