-- Usar o banco de dados existente
USE webdenuncia_db;

-- Criar tabela de denúncias se não existir
CREATE TABLE IF NOT EXISTS denuncias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  protocolo VARCHAR(10) NOT NULL UNIQUE,
  local VARCHAR(255),
  cep VARCHAR(8),
  logradouro VARCHAR(255),
  numero VARCHAR(20),
  complemento VARCHAR(255),
  bairro VARCHAR(255),
  cidade VARCHAR(255),
  uf VARCHAR(2),
  detalhes TEXT,
  nome_denunciado VARCHAR(255),
  apelido_denunciado VARCHAR(255),
  idade_denunciado VARCHAR(50),
  caracteristicas_denunciado TEXT,
  nome_vitima VARCHAR(255),
  idade_vitima VARCHAR(50),
  relacionamento_vitima VARCHAR(255),
  status ENUM('Em análise inicial', 'Encaminhada para investigação', 'Em investigação', 'Aguardando informações adicionais', 'Concluída') DEFAULT 'Em análise inicial',
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar tabela de arquivos se não existir
CREATE TABLE IF NOT EXISTS arquivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  denuncia_id INT NOT NULL,
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo ENUM('image', 'audio') NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  conteudo LONGBLOB NOT NULL,
  data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_denuncias_protocolo ON denuncias(protocolo);
CREATE INDEX IF NOT EXISTS idx_arquivos_denuncia ON arquivos(denuncia_id);
