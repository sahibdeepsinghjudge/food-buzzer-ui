import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl } from './constants';

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  accessLevel: number; // For backward compatibility with the UI. Role string -> number.
  role?: string; 
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const userId = localStorage.getItem("userId");
    if (userId) {
      headers = headers.append("X-User-Id", userId);
      headers = headers.append('ngrok-skip-browser-warning', 'true');
    }
    return headers;
  }

  // Maps backend user to UI TeamMember interface.
  // Assumes backend User object has { id, fullName, email, phone, role }
  private mapToTeamMember(user: any): TeamMember {
    // Attempt parse role numbering or fallback.
    let parsedAccessLevel = 1;
    if (user.role && !isNaN(parseInt(user.role, 10))) {
      parsedAccessLevel = parseInt(user.role, 10);
    }

    return {
      id: user.id || user.userId,
      name: user.fullName || user.userName || '',
      email: user.email || '',
      phone: user.phone || '',
      accessLevel: parsedAccessLevel,
      role: user.role || '1',
      status: user.status || 'Active'
    };
  }

  getMembers(): Observable<TeamMember[]> {
    return this.http.get<any[]>(baseUrl + '/team/team-list', { headers: this.getHeaders() }).pipe(
      map(res => {
        // Handle if response is wrapped in { data: [...] } or just an array list
        const list = res || [];
        return (Array.isArray(list) ? list : (list as any).data || []).map((u: any) => this.mapToTeamMember(u));
      })
    );
  }

  getMemberById(id: number): Observable<TeamMember | undefined> {
    // No explicit getById backend endpoint defined, so we filter from list
    return this.getMembers().pipe(
      map(members => members.find(m => m.id === id))
    );
  }

  addMember(payload: any): Observable<TeamMember> {
    // Expects payload properly formatted TeamAddRequestDTO
    return this.http.post<any>(baseUrl + '/team/team-add', payload, { headers: this.getHeaders() }).pipe(
      map((res: any) => {
        const data = res.data || res;
        if (!data.userId && !data.id && data.message) {
          throw new Error(data.message);
        }
        return this.mapToTeamMember(data);
      })
    );
  }

  updateMember(id: number, updates: Partial<TeamMember>): Observable<TeamMember> {
    // updates from the UI generally only pass accessLevel -> newRole
    const newRole = updates.accessLevel !== undefined ? updates.accessLevel.toString() : updates.role;
    const updatePayload = {
      id,
      newRole: newRole || '1'
    };
    return this.http.put<any>(baseUrl + '/team/team-update', updatePayload, { headers: this.getHeaders() }).pipe(
      map(res => this.mapToTeamMember(res.data || res))
    );
  }

  deleteMember(id: number): Observable<any> {
    const deletePayload = { id };
    return this.http.put<any>(baseUrl + '/team/team-delete', deletePayload, { headers: this.getHeaders() });
  }
}
