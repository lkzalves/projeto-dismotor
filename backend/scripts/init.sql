CREATE DATABASE IF NOT EXISTS motores_db;
USE motores_db;

CREATE TABLE IF NOT EXISTS fabricantes (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nome   VARCHAR(80) NOT NULL,
  UNIQUE KEY uk_fabricante_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS motores (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  codigo         VARCHAR(30)   NOT NULL,
  modelo         VARCHAR(80)   NOT NULL,
  fabricante_id  INT           NOT NULL,
  potencia_cv    DECIMAL(8,2)  NOT NULL,
  tensao         VARCHAR(30)   NOT NULL,
  frequencia_hz  SMALLINT      NOT NULL,
  polos          TINYINT       NOT NULL,
  rotacao_rpm    INT           NOT NULL,
  carcaca        VARCHAR(20)   NULL,
  grau_protecao  VARCHAR(10)   NULL,
  preco          DECIMAL(12,2) NULL,
  criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_motor_codigo (codigo),
  CONSTRAINT fk_motor_fabricante
    FOREIGN KEY (fabricante_id) REFERENCES fabricantes (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO fabricantes (id, nome) VALUES 
(1, 'WEG'),
(2, 'Siemens'),
(3, 'Eberle')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO motores (codigo, modelo, fabricante_id, potencia_cv, tensao, frequencia_hz, polos, rotacao_rpm, carcaca, grau_protecao, preco) VALUES
('1', 'W22 Premium', 1, 10.00, '220/380V', 60, 4, 1750, '132M', 'IP55', 2500.00),
('2', '1LE1001 High Efficiency', 2, 5.50, '220/380V', 60, 2, 3500, '112M', 'IP55', 1800.50),
('3', 'Eberle Standard 2P', 3, 2.00, '220V', 60, 2, 3450, '90S', 'IP21', 850.00),
('4', 'W21 IR3 High Efficiency', 1, 15.00, '380/660V', 60, 4, 1770, '160M', 'IP55', 4100.00),
('5', 'SIMOTICS SD', 2, 50.00, '380/660V', 50, 6, 980, '225S/M', 'IP56', 12300.00),
('6', 'W22 Washdown', 1, 3.00, '220/380V', 60, 4, 1720, '100L', 'IP66', 2900.00),
('7', 'Eberle Industrial 4P', 3, 7.50, '220/380V', 60, 4, 1730, '132S', 'IP55', 2100.00),
('8', 'W22 Mining Severe Duty', 1, 20.00, '380/660V', 60, 4, 1780, '180M', 'IP66', 6500.00),
('9', 'SIMOTICS GP', 2, 1.00, '220/380V', 50, 2, 2850, '80M', 'IP55', 950.00),
('10', 'W01 Parafuso Compacto', 1, 0.50, '220V', 60, 2, 3400, '63', 'IP21', 450.00)
ON DUPLICATE KEY UPDATE codigo=codigo;