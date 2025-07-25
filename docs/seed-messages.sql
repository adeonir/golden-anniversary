-- Script to insert 18 sample messages
-- Execute this script in Supabase SQL Editor

INSERT INTO "messages" ("name", "message", "status", "createdAt") VALUES
-- Approved messages (12)
('Maria Silva', 'Parabéns pelos 50 anos! Que venham muitos mais anos de alegria e saúde!', 'approved', NOW() - INTERVAL '10 days'),
('João Santos', 'Feliz aniversário! Que Deus continue abençoando sua vida com muita felicidade.', 'approved', NOW() - INTERVAL '9 days'),
('Ana Costa', 'Parabéns! Que este novo ano de vida seja repleto de realizações e momentos especiais.', 'approved', NOW() - INTERVAL '8 days'),
('Pedro Oliveira', 'Feliz aniversário! Que você continue sendo essa pessoa incrível que é.', 'approved', NOW() - INTERVAL '7 days'),
('Lucia Ferreira', 'Parabéns pelos 50 anos! Que venham muitas outras primaveras!', 'approved', NOW() - INTERVAL '6 days'),
('Carlos Lima', 'Feliz aniversário! Que este novo ciclo seja cheio de conquistas e alegrias.', 'approved', NOW() - INTERVAL '5 days'),
('Fernanda Rocha', 'Parabéns! Que você continue inspirando todos ao seu redor com sua bondade.', 'approved', NOW() - INTERVAL '4 days'),
('Roberto Alves', 'Feliz aniversário! Que Deus continue te abençoando com saúde e paz.', 'approved', NOW() - INTERVAL '3 days'),
('Patricia Souza', 'Parabéns pelos 50 anos! Que venham muitos momentos especiais pela frente.', 'approved', NOW() - INTERVAL '2 days'),
('Marcelo Dias', 'Feliz aniversário! Que este novo ano seja repleto de realizações.', 'approved', NOW() - INTERVAL '1 day'),
('Cristina Martins', 'Parabéns! Que você continue sendo essa pessoa maravilhosa que é.', 'approved', NOW() - INTERVAL '12 hours'),
('Ricardo Nunes', 'Feliz aniversário! Que venham muitos anos de felicidade e saúde!', 'approved', NOW() - INTERVAL '6 hours'),

-- Pending messages (3)
('Sofia Mendes', 'Parabéns pelos 50 anos! Que venham muitas outras primaveras cheias de alegria!', 'pending', NOW() - INTERVAL '4 hours'),
('Gabriel Torres', 'Feliz aniversário! Que este novo ciclo seja repleto de conquistas e momentos especiais.', 'pending', NOW() - INTERVAL '2 hours'),
('Isabela Cardoso', 'Parabéns! Que Deus continue te abençoando com saúde, paz e muita felicidade.', 'pending', NOW() - INTERVAL '1 hour'),

-- Rejected messages (3)
('Lucas Barbosa', 'Parabéns pelos 50 anos! Que venham muitos mais anos de alegria!', 'rejected', NOW() - INTERVAL '8 hours'),
('Amanda Silva', 'Feliz aniversário! Que este novo ano seja cheio de realizações e momentos especiais.', 'rejected', NOW() - INTERVAL '5 hours'),
('Thiago Costa', 'Parabéns! Que você continue sendo essa pessoa incrível que é.', 'rejected', NOW() - INTERVAL '3 hours');

-- Check distribution
SELECT
  status,
  COUNT(*) as quantidade
FROM "messages"
GROUP BY status
ORDER BY status;
