import { Component, OnInit, inject } from '@angular/core';
import { MotorService } from '../../services/motor';
import { MotorInterface } from '../../interfaces/motor-interface';
import { MotorFormModal } from '../motor-form-modal/motor-form-modal';

@Component({
  selector: 'app-motores',
  standalone: true,
  imports: [MotorFormModal], // Sem necessidade de imports extras por enquanto
  templateUrl: './motores.html',
  styleUrl: './motores.css',
})
export class MotoresComponent implements OnInit {
  private motorService = inject(MotorService);

  motores: MotorInterface[] = [];
  carregando: boolean = true;
  exibirModal: boolean = false;

  ngOnInit(): void {
    this.carregarMotores();
  }

  carregarMotores(): void {
    this.carregando = true;
    this.motorService.getMotores().subscribe({
      next: (dados) => {
        this.motores = dados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar motores:', err);
        this.carregando = false;
      },
    });
  }

  abrirModal(): void {
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
  }

  // Chamado automaticamente quando o formulário salva com sucesso
  onMotorSalvo(): void {
    this.exibirModal = false;
    this.carregarMotores(); // Recarrega a tabela com o novo registro inserido
  }
}
