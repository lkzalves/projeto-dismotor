import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotorInterface } from '../interfaces/motor-interface';

@Injectable({
  providedIn: 'root',
})
export class MotorService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/motores';

  getMotores(): Observable<MotorInterface[]> {
    return this.http.get<MotorInterface[]>(this.apiUrl);
  }
  createMotor(motor: MotorInterface): Observable<MotorInterface> {
    return this.http.post<MotorInterface>(this.apiUrl, motor);
  }
  updateMotor(id: number, motor: MotorInterface): Observable<MotorInterface> {
    return this.http.put<MotorInterface>(`${this.apiUrl}/${id}`, motor);
  }
}
