import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
export class MotorFormModal implements OnInit {
  private fb = inject(FormBuilder);
  private motorService = inject(MotorService);

  // Recebe o motor se for Edição. Se for criação, vem null ou undefined.
  @Input() motorParaEditar: MotorInterface | null = null;

  @Output() aoFechar = new EventEmitter<void>();
  @Output() aoSalvarSucesso = new EventEmitter<void>();

  salvando: boolean = false;
  mensagemErro: string = '';

  // Construção do Formulário alinhado às regras do contrato do teste
  motorForm: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(30)]],
    modelo: ['', [Validators.required, Validators.maxLength(80)]],
    fabricante_id: [null, [Validators.required]],
    potencia_cv: [null, [Validators.required, Validators.min(0.01)]],
    tensao: ['', [Validators.required]],
    frequencia_hz: [60, [Validators.required, Validators.pattern(/^(50|60)$/)]],
    polos: [4, [Validators.required, Validators.pattern(/^(2|4|6|8)$/)]],
    rotacao_rpm: [null, [Validators.required, Validators.min(1)]],
    carcaca: [''],
    grau_protecao: [''],
    preco: [null, [Validators.min(0)]],
  });

  ngOnInit(): void {
    // Se recebeu um motor para edição, preenche o formulário automaticamente
    if (this.motorParaEditar) {
      this.motorForm.patchValue(this.motorParaEditar);
    }
  }

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

    const dadosMotor: MotorInterface = this.motorForm.value;

    // Se temos motorParaEditar com ID -> Executa PUT. Caso contrário -> Executa POST.
    if (this.motorParaEditar && this.motorParaEditar.id) {
      this.motorService.updateMotor(this.motorParaEditar.id, dadosMotor).subscribe({
        next: () => {
          this.salvando = false;
          this.aoSalvarSucesso.emit();
        },
        error: (err) => this.tratarErro(err),
      });
    } else {
      this.motorService.createMotor(dadosMotor).subscribe({
        next: () => {
          this.salvando = false;
          this.aoSalvarSucesso.emit();
        },
        error: (err) => this.tratarErro(err),
      });
    }
  }

  private tratarErro(err: any): void {
    this.salvando = false;
    if (err.error && err.error.error) {
      // Se a API retornar a estrutura { error: "...", details: [...] }
      const detalhes = err.error.details ? `: ${err.error.details.join(', ')}` : '';
      this.mensagemErro = `${err.error.error}${detalhes}`;
    } else {
      this.mensagemErro = 'Ocorreu um erro ao salvar o motor. Tente novamente.';
    }
  }
}
