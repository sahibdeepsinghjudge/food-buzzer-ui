import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  accessLevel: number;
  status: 'Active' | 'Inactive';
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private members: TeamMember[] = [
    { id: 1, name: 'Sahib Singh', email: 'sahib@foodbuzzer.com', accessLevel: 5, status: 'Active' },
    { id: 2, name: 'Alice Smith', email: 'alice@foodbuzzer.com', accessLevel: 3, status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@foodbuzzer.com', accessLevel: 1, status: 'Inactive' },
    { id: 4, name: 'Charlie Brown', email: 'charlie@foodbuzzer.com', accessLevel: 2, status: 'Active' },
    { id: 5, name: 'Diana Prince', email: 'diana@foodbuzzer.com', accessLevel: 4, status: 'Active' }
  ];

  constructor() {}

  getMembers(): Observable<TeamMember[]> {
    return of([...this.members]).pipe(delay(300));
  }

  getMemberById(id: number): Observable<TeamMember | undefined> {
    const member = this.members.find(m => m.id === id);
    return of(member ? { ...member } : undefined).pipe(delay(200));
  }

  updateMember(id: number, updates: Partial<TeamMember>): Observable<TeamMember> {
    const index = this.members.findIndex(m => m.id === id);
    if (index !== -1) {
      this.members[index] = { ...this.members[index], ...updates };
      return of({ ...this.members[index] }).pipe(delay(400));
    }
    throw new Error('Member not found');
  }
}
