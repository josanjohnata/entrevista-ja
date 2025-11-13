import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

import { Button } from '../../../../vaga-turbo-bot/src/presentation/components/Button';
import { Card } from '../../../../vaga-turbo-bot/src/presentation/components/Card';
import { Input } from '../../../../vaga-turbo-bot/src/presentation/components/Input';
import { Label } from '../../../../vaga-turbo-bot/src/presentation/components/Label';
import { Container, Page } from '../../../../vaga-turbo-bot/src/presentation/components/Layout';
import { theme } from '../../../../vaga-turbo-bot/src/styles/theme';
import { GlobalStyles } from '../../../../vaga-turbo-bot/src/styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { HeaderHome } from '../../components/HeaderHome/HeaderHome';
import { ToastContainer } from 'react-toastify';

import * as S from './styles';

interface DeveloperFormValues {
  tab: 'jobs' | 'content';
  tech: string;
  seniority?: string;
  skip?: number;
  exclude?: string;
}

const seniorityMap: Record<string, string> = {
  'Estágio': '1',
  'Junior': '2',
  'Pleno': '3,4',
  'Senior': '5,6',
};

export const LinkedInSearchScreen: React.FC = () => {
  const { handleSubmit, control, watch, reset } = useForm<DeveloperFormValues>({
    defaultValues: {
      tab: 'jobs',
      tech: '',
      seniority: 'Junior',
      skip: 0,
      exclude: '',
    },
  });

  const values = watch();

  const onSubmit = (data: DeveloperFormValues) => {
    let url = '';
    
    if (data.tab === 'jobs') {
      const keywords = data.exclude 
        ? `${data.tech} NOT (${data.exclude})`
        : data.tech;
      
      const experienceLevel = data.seniority ? seniorityMap[data.seniority] : '';
      const skipValue = data.skip || 0;
      
      url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=Brasil&f_AL=true${
        experienceLevel ? `&f_E=${experienceLevel}` : ''
      }&start=${skipValue}`;
    } else {
      const keywords = data.exclude 
        ? `${data.tech} NOT (${data.exclude})`
        : data.tech;
      
      url = `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(keywords)}`;
    }

    window.open(url, '_blank');
    toast.success('Pesquisa aberta em nova aba do LinkedIn!');
  };

  const handleClear = () => {
    reset({
      tab: values.tab,
      tech: '',
      seniority: 'Junior',
      skip: 0,
      exclude: '',
    });
  };

  const isFormFilled = values.tab && values.tech?.trim() && values.skip !== undefined;

  return (
    <>
      <HeaderHome />
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Page>
        <S.Hero>
          <Container>
            <S.HeroBadge>
              <Sparkles size={16} />
              <span>Filtro Inteligente</span>
            </S.HeroBadge>
            <S.HeroTitle>Filtrar Vagas no LinkedIn</S.HeroTitle>
            <S.HeroSubtitle>
              Encontre as vagas perfeitas com filtros avançados e personalizados
            </S.HeroSubtitle>
          </Container>
        </S.Hero>

        <S.MainContent>
          <Container>
            <Card>
              <form onSubmit={handleSubmit(onSubmit)}>
                <S.FormGroup>
                  <Label htmlFor="tech">Palavras Chave *</Label>
                  <Controller
                    name="tech"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="tech"
                        placeholder="Engenheiro de Software, Scrum Master, Financeiro, etc."
                        required
                      />
                    )}
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <Label htmlFor="exclude">Excluir palavras chave</Label>
                  <Controller
                    name="exclude"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="exclude"
                        placeholder="Ex: estágio, júnior, 5 anos de experiência, etc."
                      />
                    )}
                  />
                </S.FormGroup>

                {values.tab === 'jobs' && (
                  <>
                    <S.FormGroup>
                      <Label htmlFor="seniority">Senioridade:</Label>
                      <Controller
                        name="seniority"
                        control={control}
                        render={({ field }) => (
                          <S.Select {...field} id="seniority">
                            <option value="Estágio">Estágio</option>
                            <option value="Junior">Junior</option>
                            <option value="Pleno">Pleno</option>
                            <option value="Senior">Senior</option>
                          </S.Select>
                        )}
                      />
                    </S.FormGroup>

                    <S.FormGroup>
                      <Label htmlFor="skip">Página de Pesquisa</Label>
                      <Controller
                        name="skip"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="skip"
                            type="number"
                            placeholder="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        )}
                      />
                    </S.FormGroup>
                  </>
                )}

                <S.ButtonGroup>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!isFormFilled}
                    fullWidth
                  >
                    Buscar no LinkedIn
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClear}
                    variant="outline"
                    fullWidth
                  >
                    Limpar Filtros
                  </Button>
                </S.ButtonGroup>
              </form>
            </Card>
          </Container>
        </S.MainContent>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        </Page>
      </ThemeProvider>
    </>
  );
};


