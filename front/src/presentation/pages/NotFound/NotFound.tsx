import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

import { Button } from '@/presentation/components/Button';

import * as S from './NotFound.styles';

export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <S.NotFoundContainer>
      <S.ErrorCode>404</S.ErrorCode>
      <S.ErrorTitle>Página Não Encontrada</S.ErrorTitle>
      <S.ErrorMessage>
        Desculpe, a página que você está procurando não existe ou foi movida.
      </S.ErrorMessage>
      <S.ButtonContainer>
        <Button onClick={() => navigate('/')} size="lg">
          <Home size={20} />
          Voltar para Home
        </Button>
      </S.ButtonContainer>
    </S.NotFoundContainer>
  );
};

