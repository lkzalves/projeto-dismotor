import { Component, OnInit, inject, signal } from '@angular/core';
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

  motores = signal<MotorInterface[]>([]);
  carregando = signal<boolean>(true);
  exibirModal = signal<boolean>(false);

  termoBusca: string = '';
  motorSelecionado = signal<MotorInterface | null>(null);

  ngOnInit(): void {
    this.carregarMotores();
  }

  carregarMotores(): void {
    this.carregando.set(true);
    this.motorService.getMotores(this.termoBusca).subscribe({
      next: (resposta: any) => {
        if (Array.isArray(resposta)) {
          this.motores.set(resposta);
        } else if (resposta && Array.isArray(resposta.data)) {
          this.motores.set(resposta.data);
        } else {
          this.motores.set([]);
        }
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar motores', err);
        this.carregando.set(false);
      },
    });
  }

  buscarMotores(): void {
    this.carregarMotores();
  }

  abrirModalParaCriar(): void {
    this.motorSelecionado.set(null);
    this.exibirModal.set(true);
  }

  abrirModalParaEditar(motor: MotorInterface): void {
    this.motorSelecionado.set(motor);
    this.exibirModal.set(true);
  }

  fecharModal(): void {
    this.exibirModal.set(false);
    this.motorSelecionado.set(null);
  }

  onMotorSalvo(): void {
    this.fecharModal();
    this.carregarMotores();
  }

  excluirMotor(motor: MotorInterface): void {
    const confirmacao = confirm(
      `Certeza que deseja excluir o motor "${motor.codigo} - ${motor.modelo}"?`,
    );

    if (confirmacao && motor.id) {
      this.motorService.deleteMotor(motor.id).subscribe({
        next: () => {
          this.carregarMotores();
        },
        error: (err) => {
          console.error('Erro ao excluir motor:', err);
          alert(err.error?.error || 'Não foi possível excluir o motor.');
        },
      });
    }
  }
}

