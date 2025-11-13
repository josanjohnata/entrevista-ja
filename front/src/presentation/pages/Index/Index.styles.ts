import styled from 'styled-components';

export const Hero = styled.header`
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.md};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing['2xl']} ${({ theme }) => theme.spacing.md};
  }
`;

export const HeroTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['5xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['6xl']};
  }
`;

export const HeroSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  opacity: 0.9;
  margin-bottom: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

export const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  max-width: ${({ theme }) => theme.breakpoints.lg};
  margin: 0 auto;
`;

export const FeatureCard = styled.div`
  text-align: center;
`;

export const FeatureIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background-color: ${({ theme }) => theme.colors.primary.main}15;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const FeatureTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const FeatureDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0;
`;

export const MainContent = styled.main`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
  }
`;

export const FormContainer = styled.div`
  max-width: ${({ theme }) => theme.breakpoints.lg};
  margin: 0 auto;
  animation: fadeIn ${({ theme }) => theme.transitions.normal} ${({ theme }) => theme.transitions.ease};
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const FileUploadContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

export const LoadingIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

