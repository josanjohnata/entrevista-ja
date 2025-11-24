import React, { useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button } from '../../presentation/components/Button';
import { Card } from '../../presentation/components/Card';
import { Input } from '../../presentation/components/Input';
import { Label } from '../../presentation/components/Label';
import { Container, Page } from '../../presentation/components/Layout';
import { theme } from '../../styles/theme';
import { GlobalStyles } from '../../styles/GlobalStyles';
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
  location?: string;
}

const reverseSeniorityMap: Record<string, string> = {
  'Estágio': '1',
  'Junior': '2',
  'Pleno': '3,4',
  'Senior': '5,6',
};

const buildQuery = (data: DeveloperFormValues, isJobsTab: boolean) => {
  let query = data.tech;
  
  if (data.exclude && data.exclude.trim()) {
    const excludeTerms = data.exclude
      .split(',')
      .map(term => term.trim())
      .filter(Boolean);
    
    if (isJobsTab) {
      const notClauses = excludeTerms.map(term => `NOT "${term}"`).join(' ');
      query = `${data.tech} ${notClauses}`;
    } else {
      const notClauses = excludeTerms.map(term => `NOT (${term})`).join(' ');
      query = `${data.tech} ${notClauses}`;
    }
  }
  
  return query;
};

export const LinkedInSearchScreen: React.FC = () => {
  const { handleSubmit, control, watch, reset } = useForm<DeveloperFormValues>({
    defaultValues: {
      tab: 'jobs',
      tech: '',
      seniority: 'Junior',
      skip: 1,
      exclude: '',
      location: '',
    },
  });

  const values = watch();

  const onSubmit = useCallback((data: DeveloperFormValues) => {
    const isJobsTab = data.tab === 'jobs';
    const keywords = buildQuery(data, isJobsTab);
    
    const pageNumber = data.skip || 1;
    const startIndex = (pageNumber - 1) * 25;
    
    let url = '';
    
    if (isJobsTab) {
      const experienceLevel = data.seniority ? reverseSeniorityMap[data.seniority] : '';
      const locationParam = data.location && data.location.trim() ? `&location=${encodeURIComponent(data.location)}` : '';
      url = `https://www.linkedin.com/jobs/search/?geoId=92000000&keywords=${encodeURIComponent(keywords)}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true${
        experienceLevel ? `&f_E=${experienceLevel}` : ''
      }${locationParam}&start=${startIndex}`;
    } else {
      url = `https://www.linkedin.com/search/results/CONTENT/?keywords=${encodeURIComponent(keywords)}&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=true`;
    }

    window.open(url, '_blank');
    toast.success('Pesquisa aberta em nova aba do LinkedIn!');
  }, []);

  const handleClear = useCallback(() => {
    reset({
      tab: values.tab,
      tech: '',
      seniority: 'Junior',
      skip: 1,
      exclude: '',
      location: '',
    });
  }, [reset, values.tab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleSubmit(onSubmit)();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit, handleClear, onSubmit]);

  const isFormFilled = values.tab && values.tech?.trim() && values.skip !== undefined && values.skip >= 1;

  return (
    <>
      <HeaderHome />
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Page>
        <S.Hero>
          <Container>
            <S.HeroBadge>
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
                  <Label htmlFor="tab">Buscar em:</Label>
                  <Controller
                    name="tab"
                    control={control}
                    render={({ field }) => (
                      <S.Select {...field} id="tab">
                        <option value="jobs">Vagas</option>
                        <option value="content">Publicações</option>
                      </S.Select>
                    )}
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <Label htmlFor="tech">Palavras Chave (separadas por vírgula):</Label>
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
                  <Label htmlFor="exclude">Excluir palavras chave (separadas por vírgula):</Label>
                  <Controller
                    name="exclude"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="exclude"
                        placeholder="Ex: senior, estágio, 5 anos de experiência"
                      />
                    )}
                  />
                </S.FormGroup>

                {values.tab === 'jobs' && (
                  <>
                    <S.FormGroup>
                      <Label htmlFor="location">Localização:</Label>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="location"
                            placeholder="Ex: Brasil, São Paulo, Remoto, etc."
                          />
                        )}
                      />
                    </S.FormGroup>

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
                            min="1"
                            placeholder="1"
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              field.onChange(value < 1 ? 1 : value);
                            }}
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


