import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MotorService } from '../../services/motor';
import { MotorInterface } from '../../interfaces/motor-interface';
import { MotorFormModal } from '../motor-form-modal/motor-form-modal';

@Component({
  selector: 'app-motores',
  standalone: true,
  imports: [CommonModule, FormsModule, MotorFormModal],
  templateUrl: './motores.html',
  styleUrl: './motores.css',
})
export class MotoresComponent implements OnInit {
  private motorService = inject(MotorService);

  motores: MotorInterface[] = [];
  carregando: boolean = true;
  exibirModal: boolean = false;

  termoBusca: string = '';
  motorSelecionado: MotorInterface | null = null;

  ngOnInit(): void {
    this.carregarMotores();
  }

  carregarMotores(): void {
    this.carregando = true;
    this.motorService.getMotores(this.termoBusca).subscribe({
      next: (dados) => {
        this.motores = dados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar motores', err);
        this.carregando = false;
      },
    });
  }

  buscarMotores(): void {
    this.carregarMotores();
  }

  abrirModalParaCriar(): void {
    this.motorSelecionado = null;
    this.exibirModal = true;
  }

  abrirModalParaEditar(motor: MotorInterface): void {
    this.motorSelecionado = motor;
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.motorSelecionado = null;
  }

  onMotorSalvo(): void {
    this.fecharModal();
    this.carregarMotores(); // Recarrega a tabela
  }

  excluirMotor(id: number): void {
    if (confirm('Tem certeza que deseja excluir este motor?')) {
      this.motorService.deleteMotor(id).subscribe({
        next: () => this.carregarMotores(),
        error: (err) => alert('Erro ao excluir motor.'),
      });
    }
  }
}
