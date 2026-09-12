import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotorService } from '../../services/motor';
import { MotorInterface } from '../../interfaces/motor-interface';

@Component({
  selector: 'app-motor-form-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './motor-form-modal.html',
  styleUrl: './motor-form-modal.css',
})
export class MotorFormModal {
  private fb = inject(FormBuilder);
  private motorService = inject(MotorService);

  // Emite evento para o componente pai quando o modal deve fechar ou quando o cadastro for concluído
  @Output() aoFechar = new EventEmitter<void>();
  @Output() aoSalvarSucesso = new EventEmitter<void>();

  salvando: boolean = false;
  mensagemErro: string = '';

  // Cnstrução do Formulário
  motorForm: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(20)]],
    modelo: ['', [Validators.required, Validators.maxLength(100)]],
    potencia_cv: [null, [Validators.required, Validators.min(0.1)]],
    tensao: ['', [Validators.required]],
    rotacao_rpm: [null, [Validators.required, Validators.min(1)]],
    preco: [null, [Validators.min(0)]],
    fabricante_id: [''],
    carcaca: [''],
    grau_protecao: [''],
    frequencia_hz: [null, [Validators.min(1)]],
    polos: [null, [Validators.min(1)]],
  });

  fecharModal(): void {
    this.aoFechar.emit();
  }

  salvarMotor(): void {
    if (this.motorForm.invalid) {
      this.motorForm.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.mensagemErro = '';

    const novoMotor: MotorInterface = this.motorForm.value;

    this.motorService.createMotor(novoMotor).subscribe({
      next: () => {
        this.salvando = false;
        this.aoSalvarSucesso.emit(); // Notifica o pai para recarregar a lista
      },
      error: (err) => {
        this.salvando = false;
        if (err.error && err.error.error) {
          this.mensagemErro = err.error.error;
        } else {
          this.mensagemErro = 'Ocorreu um erro ao salvar o motor. Tente novamente.';
        }
      },
    });
  }
}
