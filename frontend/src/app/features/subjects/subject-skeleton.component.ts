import { Component } from '@angular/core';

@Component({
  selector: 'app-subject-skeleton',
  template: `
    <div class="bg-white dark:bg-[#13131f] rounded-2xl overflow-hidden border border-[#e8e8f0] dark:border-[#1e1e2e]">
      <div class="aspect-video bg-[#e8e8f0] dark:bg-[#1e1e2e] animate-pulse"></div>
      <div class="px-4 py-4">
        <div class="flex items-center justify-between mb-3">
          <div class="h-4 w-2/3 bg-[#e8e8f0] dark:bg-[#1e1e2e] rounded-full animate-pulse"></div>
          <div class="h-4 w-4 bg-[#e8e8f0] dark:bg-[#1e1e2e] rounded-full animate-pulse"></div>
        </div>
        <div class="h-3 w-full bg-[#e8e8f0] dark:bg-[#1e1e2e] rounded-full animate-pulse mb-2"></div>
        <div class="h-3 w-4/5 bg-[#e8e8f0] dark:bg-[#1e1e2e] rounded-full animate-pulse"></div>
      </div>
    </div>
  `
})
export class SubjectSkeletonComponent {}