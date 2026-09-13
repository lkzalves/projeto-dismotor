export interface MotorInterface {
  id?: number;
  codigo: string;
  modelo: string;
  fabricante_nome?: string;
  potencia_cv: number;
  tensao: string | number;
  frequencia_hz?: number;
  polos?: number;
  rotacao_rpm: number;
  carcaca?: string;
  grau_protecao?: string;
  preco?: number;
  criado_em?: string;
}
