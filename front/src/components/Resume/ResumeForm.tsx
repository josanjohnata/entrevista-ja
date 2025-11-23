import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData, ResumeExperience, ResumeEducation, ResumeSkill, ResumeCertification, ResumeLanguage } from '../../domain/resume/types';
import { Button } from '../../presentation/components/Button';
import { Input } from '../../presentation/components/Input';
import { Label } from '../../presentation/components/Label';
import { Textarea } from '../../presentation/components/Textarea';
import { toast } from 'react-toastify';
import * as S from './styles';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  disabled?: boolean;
}

const formatDateInput = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) {
    return numbers;
  }
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 6)}`;
};

const convertToISODate = (formattedDate: string): string => {
  if (!formattedDate || formattedDate.length < 7) return '';
  const [month, year] = formattedDate.split('/');
  if (!month || !year || month.length !== 2 || year.length !== 4) return '';
  return `${year}-${month}`;
};

const convertFromISODate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month] = isoDate.split('-');
  if (!year || !month) return '';
  return `${month}/${year}`;
};

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, disabled = false }) => {
  const [dateInputs, setDateInputs] = React.useState<Record<string, string>>({});

  const updateField = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    onChange({ ...data, [field]: value });
  };

  const updateContact = (field: string, value: string) => {
    onChange({ ...data, contact: { ...data.contact, [field]: value } });
  };

  const handleDateChange = (
    id: string, 
    field: string, 
    value: string, 
    updateFn: (id: string, field: string, value: string) => void
  ) => {
    const key = `${id}-${field}`;
    const formatted = formatDateInput(value);
    
    setDateInputs(prev => ({ ...prev, [key]: formatted }));
    
    const isoDate = convertToISODate(formatted);
    updateFn(id, field, isoDate);
  };

  const getDateValue = (id: string, field: string, isoValue: string): string => {
    const key = `${id}-${field}`;
    if (dateInputs[key] !== undefined) {
      return dateInputs[key];
    }
    return convertFromISODate(isoValue);
  };

  const addExperience = () => {
    const newExp: ResumeExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      location: '',
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
    toast.success('Nova experiência adicionada');
  };

  const updateExperience = <K extends keyof ResumeExperience>(id: string, field: K, value: ResumeExperience[K]) => {
    const updated = data.experiences.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experiences: updated });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter((exp) => exp.id !== id) });
    toast.success('Experiência removida');
  };

  const addEducation = () => {
    const newEdu: ResumeEducation = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
    toast.success('Nova formação adicionada');
  };

  const updateEducation = (id: string, field: keyof ResumeEducation, value: string) => {
    const updated = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onChange({ ...data, education: updated });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((edu) => edu.id !== id) });
    toast.success('Formação removida');
  };

  const addSkill = () => {
    const newSkill: ResumeSkill = { id: Date.now().toString(), name: '' };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const updateSkill = (id: string, name: string) => {
    const updated = data.skills.map((skill) =>
      skill.id === id ? { ...skill, name } : skill
    );
    onChange({ ...data, skills: updated });
  };

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((skill) => skill.id !== id) });
  };

  const addLanguage = () => {
    const newLang: ResumeLanguage = { id: Date.now().toString(), name: '', level: 'Intermediário' };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const updateLanguage = (id: string, field: 'name' | 'level', value: string) => {
    const updated = data.languages.map((lang) =>
      lang.id === id ? { ...lang, [field]: value } : lang
    );
    onChange({ ...data, languages: updated });
  };

  const removeLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((lang) => lang.id !== id) });
  };

  const addCertification = () => {
    const newCert: ResumeCertification = { id: Date.now().toString(), name: '' };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const updateCertification = (id: string, name: string) => {
    const updated = data.certifications.map((cert) =>
      cert.id === id ? { ...cert, name } : cert
    );
    onChange({ ...data, certifications: updated });
  };

  const removeCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter((cert) => cert.id !== id) });
  };

  return (
    <S.ResumeFormContainer>
      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Informações Pessoais</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <S.FormField>
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Seu nome completo"
              disabled={disabled}
            />
          </S.FormField>
          <S.FormField>
            <Label htmlFor="title">Título Profissional</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: Software Engineer | React Developer"
              disabled={disabled}
            />
          </S.FormField>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Contato</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <S.FormGrid>
            <S.FormField>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                placeholder="seu@email.com"
                disabled={disabled}
              />
            </S.FormField>
            <S.FormField>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={data.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                placeholder="+55 (85) 99999-9999"
                disabled={disabled}
              />
            </S.FormField>
            <S.FormField>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={data.contact.linkedin}
                onChange={(e) => updateContact('linkedin', e.target.value)}
                placeholder="linkedin.com/in/seuperfil"
                disabled={disabled}
              />
            </S.FormField>
            <S.FormField>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={data.contact.github}
                onChange={(e) => updateContact('github', e.target.value)}
                placeholder="github.com/seuperfil"
                disabled={disabled}
              />
            </S.FormField>
            <S.FormField>
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={data.contact.location}
                onChange={(e) => updateContact('location', e.target.value)}
                placeholder="Cidade, Estado, País"
                disabled={disabled}
              />
            </S.FormField>
          </S.FormGrid>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Resumo Profissional</S.CardTitle>
        </S.CardHeader>
        <S.CardContent>
          <Textarea
            value={data.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            placeholder="Escreva um resumo sobre sua experiência e objetivos profissionais..."
            rows={6}
            disabled={disabled}
          />
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Habilidades</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addSkill} variant="outline" size="sm">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Adicionar
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.skills.map((skill) => (
              <S.ListItem key={skill.id}>
                <Input
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, e.target.value)}
                  placeholder="Ex: React Native, TypeScript"
                  disabled={disabled}
                />
                {!disabled && (
                  <S.IconButton onClick={() => removeSkill(skill.id)} type="button">
                    <Trash2 size={16} />
                  </S.IconButton>
                )}
              </S.ListItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Idiomas</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addLanguage} variant="outline" size="sm">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Adicionar
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.languages.map((lang) => (
              <S.ListItem key={lang.id}>
                <Input
                  value={lang.name}
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                  placeholder="Ex: Português"
                  disabled={disabled}
                />
                <Input
                  value={lang.level}
                  onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                  placeholder="Ex: Nativo"
                  disabled={disabled}
                />
                {!disabled && (
                  <S.IconButton onClick={() => removeLanguage(lang.id)} type="button">
                    <Trash2 size={16} />
                  </S.IconButton>
                )}
              </S.ListItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Certificações</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addCertification} variant="outline" size="sm">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Adicionar
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.certifications.map((cert) => (
              <S.ListItem key={cert.id}>
                <Input
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, e.target.value)}
                  placeholder="Nome da certificação"
                  disabled={disabled}
                />
                {!disabled && (
                  <S.IconButton onClick={() => removeCertification(cert.id)} type="button">
                    <Trash2 size={16} />
                  </S.IconButton>
                )}
              </S.ListItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Experiência Profissional</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addExperience} variant="outline" size="sm">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Adicionar
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.experiences.map((exp) => (
              <S.ExperienceItem key={exp.id}>
                <S.ExperienceHeader>
                  <h4>Experiência</h4>
                  {!disabled && (
                    <S.IconButton onClick={() => removeExperience(exp.id)} type="button">
                      <Trash2 size={16} />
                    </S.IconButton>
                  )}
                </S.ExperienceHeader>
                <S.FormGrid>
                  <S.FormField>
                    <Label>Empresa</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Nome da empresa"
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>Cargo</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      placeholder="Seu cargo"
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>Data de Início</Label>
                    <Input
                      type="text"
                      value={getDateValue(exp.id, 'startDate', exp.startDate)}
                      onChange={(e) => handleDateChange(exp.id, 'startDate', e.target.value, (id, _, val) => updateExperience(id, 'startDate', val))}
                      onBlur={() => {
                        const key = `${exp.id}-startDate`;
                        setDateInputs(prev => {
                          const newState = { ...prev };
                          delete newState[key];
                          return newState;
                        });
                      }}
                      placeholder="MM/AAAA"
                      maxLength={7}
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>Data de Término</Label>
                    <Input
                      type="text"
                      value={getDateValue(exp.id, 'endDate', exp.endDate)}
                      onChange={(e) => handleDateChange(exp.id, 'endDate', e.target.value, (id, _, val) => updateExperience(id, 'endDate', val))}
                      onBlur={() => {
                        const key = `${exp.id}-endDate`;
                        setDateInputs(prev => {
                          const newState = { ...prev };
                          delete newState[key];
                          return newState;
                        });
                      }}
                      placeholder="MM/AAAA"
                      maxLength={7}
                      disabled={exp.current || disabled}
                    />
                    <S.CheckboxContainer>
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        disabled={disabled}
                      />
                      <Label htmlFor={`current-${exp.id}`}>Trabalho aqui atualmente</Label>
                    </S.CheckboxContainer>
                  </S.FormField>
                  <S.FormFieldFullWidth>
                    <Label>Localização</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="Cidade, Estado, País"
                      disabled={disabled}
                    />
                  </S.FormFieldFullWidth>
                  <S.FormFieldFullWidth>
                    <Label>Descrição</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Descreva suas responsabilidades e conquistas..."
                      rows={4}
                      disabled={disabled}
                    />
                  </S.FormFieldFullWidth>
                </S.FormGrid>
              </S.ExperienceItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>

      <S.Card>
        <S.CardHeader>
          <S.CardTitle>Formação Acadêmica</S.CardTitle>
          {!disabled && (
            <Button type="button" onClick={addEducation} variant="outline" size="sm">
              <Plus size={16} style={{ marginRight: '0.5rem' }} />
              Adicionar
            </Button>
          )}
        </S.CardHeader>
        <S.CardContent>
          <S.ListContainer>
            {data.education.map((edu) => (
              <S.ExperienceItem key={edu.id}>
                <S.ExperienceHeader>
                  <h4>Formação</h4>
                  {!disabled && (
                    <S.IconButton onClick={() => removeEducation(edu.id)} type="button">
                      <Trash2 size={16} />
                    </S.IconButton>
                  )}
                </S.ExperienceHeader>
                <S.FormGrid>
                  <S.FormFieldFullWidth>
                    <Label>Instituição</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="Nome da instituição"
                      disabled={disabled}
                    />
                  </S.FormFieldFullWidth>
                  <S.FormField>
                    <Label>Grau</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Ex: Bacharelado, Pós-graduação"
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>Área de Estudo</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      placeholder="Ex: Ciência da Computação"
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>Data de Início</Label>
                    <Input
                      type="text"
                      value={getDateValue(edu.id, 'eduStartDate', edu.startDate)}
                      onChange={(e) => handleDateChange(edu.id, 'eduStartDate', e.target.value, (id, _, value) => updateEducation(id, 'startDate', value))}
                      onBlur={() => {
                        const key = `${edu.id}-eduStartDate`;
                        setDateInputs(prev => {
                          const newState = { ...prev };
                          delete newState[key];
                          return newState;
                        });
                      }}
                      placeholder="MM/AAAA"
                      maxLength={7}
                      disabled={disabled}
                    />
                  </S.FormField>
                  <S.FormField>
                    <Label>Data de Conclusão</Label>
                    <Input
                      type="text"
                      value={getDateValue(edu.id, 'eduEndDate', edu.endDate)}
                      onChange={(e) => handleDateChange(edu.id, 'eduEndDate', e.target.value, (id, _, value) => updateEducation(id, 'endDate', value))}
                      onBlur={() => {
                        const key = `${edu.id}-eduEndDate`;
                        setDateInputs(prev => {
                          const newState = { ...prev };
                          delete newState[key];
                          return newState;
                        });
                      }}
                      placeholder="MM/AAAA"
                      maxLength={7}
                      disabled={disabled}
                    />
                  </S.FormField>
                </S.FormGrid>
              </S.ExperienceItem>
            ))}
          </S.ListContainer>
        </S.CardContent>
      </S.Card>
    </S.ResumeFormContainer>
  );
};
