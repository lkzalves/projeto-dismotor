import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotorInterface } from '../interfaces/motor-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MotorService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/motores`;

  getMotores(search?: string): Observable<MotorInterface[]> {
    let params = new HttpParams();
    if (search && search.trim() !== '') {
      params = params.set('search', search.trim());
    }
    return this.http.get<MotorInterface[]>(this.apiUrl, { params });
  }

  createMotor(motor: MotorInterface): Observable<MotorInterface> {
    return this.http.post<MotorInterface>(this.apiUrl, motor);
  }

  updateMotor(id: number, motor: MotorInterface): Observable<MotorInterface> {
    return this.http.put<MotorInterface>(`${this.apiUrl}/${id}`, motor);
  }

  deleteMotor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
