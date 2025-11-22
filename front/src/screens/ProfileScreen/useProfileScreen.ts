/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import type { UserProfile, Experience, Education, Language } from './types';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatMonthYear } from '../../utils/dateFormatter';

export function useProfileScreen() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFirstAccess, setIsFirstAccess] = useState(location.state?.isFirstAccess || false);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [displayName, setDisplayName] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [location_, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  
  const [about, setAbout] = useState('');
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    const analysisData = location.state?.analysisData;
    if (analysisData && analysisData.resumoOtimizado) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const updatedFields: string[] = [];
      
      setAbout(analysisData.resumoOtimizado);
      updatedFields.push('Resumo Profissional');
      
      if (analysisData.palavrasChave && analysisData.palavrasChave.length > 0) {
        const keywords = analysisData.palavrasChave;
        
        setExperiences(prevExperiences => {
          if (prevExperiences.length > 0) {
            updatedFields.push('Experiências');
            return prevExperiences.map((exp, index) => {
              if (exp.description) {
                const relevantKeywords = keywords.slice(index * 3, (index + 1) * 3);
                if (relevantKeywords.length > 0) {
                  const keywordsText = `\n\n${relevantKeywords.join(', ')}`;
                  return {
                    ...exp,
                    description: exp.description + keywordsText
                  };
                }
              }
              return exp;
            });
          }
          return prevExperiences;
        });
      }
      
      if (analysisData.sugestoesMelhoriaTexto) {
        const sugestoesTexto = analysisData.sugestoesMelhoriaTexto;
        const sugestoesLower = sugestoesTexto.toLowerCase();
        
        const tituloPatterns = [
          /título.*?:?\s*["']?([^"'\n.]{5,50})["']?/i,
          /posição.*?:?\s*["']?([^"'\n.]{5,50})["']?/i,
          /cargo.*?:?\s*["']?([^"'\n.]{5,50})["']?/i
        ];
        
        for (const pattern of tituloPatterns) {
          const match = sugestoesTexto.match(pattern);
          if (match && match[1] && !professionalTitle.trim()) {
            const titulo = match[1].trim();
            if (titulo.length > 5 && titulo.length < 50) {
              setProfessionalTitle(titulo);
              updatedFields.push('Título Profissional');
              break;
            }
          }
        }
        
        const certificacoesPattern = /certificaç(?:ão|ões)|curso|formação/i;
        if (certificacoesPattern.test(sugestoesTexto)) {
          setEducation(prevEducation => {
            if (prevEducation.length > 0) {
              updatedFields.push('Formação (sugestões adicionadas)');
              return prevEducation.map((edu, index) => {
                if (index === prevEducation.length - 1) {
                  return {
                    ...edu,
                    institution: edu.institution
                  };
                }
                return edu;
              });
            }
            return prevEducation;
          });
        }
        
        const idiomaPatterns = ['inglês', 'espanhol', 'francês', 'alemão', 'mandarim', 'japonês'];
        const idiomasMencionados = idiomaPatterns.filter(idioma => 
          sugestoesLower.includes(idioma)
        );
        
        if (idiomasMencionados.length > 0 && languages.length === 0) {
          const novosIdiomas: Language[] = idiomasMencionados.map((idioma, index) => ({
            id: `analysis-${Date.now()}-${index}`,
            language: idioma.charAt(0).toUpperCase() + idioma.slice(1),
            proficiency: 'intermediate' as const
          }));
          setLanguages(novosIdiomas);
          updatedFields.push('Idiomas');
        }
        
        const locationPatterns = [
          /localização.*?:?\s*["']?([^"'\n.]{3,40})["']?/i,
          /cidade.*?:?\s*["']?([^"'\n.]{3,40})["']?/i,
          /(?:em|de)\s+([A-Z][a-zà-ú]+(?:\s+[A-Z][a-zà-ú]+)?)\s*,?\s*([A-Z]{2})?/
        ];
        
        for (const pattern of locationPatterns) {
          const match = sugestoesTexto.match(pattern);
          if (match && match[1] && !location_.trim()) {
            const loc = match[1].trim();
            if (loc.length > 3 && loc.length < 40) {
              setLocation(loc);
              updatedFields.push('Localização');
              break;
            }
          }
        }
      }
      
      setIsEditing(true);
      
      setMessage({ 
        type: 'success', 
        text: `${updatedFields.length} campo(s) atualizado(s): ${updatedFields.join(', ')}. Revise todas as alterações antes de salvar!` 
      });
      
      window.history.replaceState({}, document.title);
    }
  }, [languages.length, location.state, location_, professionalTitle]);

  useEffect(() => {
    let isMounted = true;

    const clearAllData = () => {
      if (isMounted) {
        setProfile(null);
        setDisplayName('');
        setProfessionalTitle('');
        setPhone('');
        setLocation('');
        setLinkedin('');
        setGithub('');
        setAbout('');
        setExperiences([]);
        setEducation([]);
        setLanguages([]);
        setResumeFile(null);
        setLoading(false);
      }
    };

    if (!currentUser) {
      clearAllData();
      return;
    }

    const fetchProfile = async () => {
      try {
        if (!db) {
          if (isMounted) {
            setDisplayName(currentUser.displayName || '');
            setLoading(false);
          }
          return;
        }

        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (isMounted) {
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            const profileData: UserProfile = {
              ...data,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
              profileCompleted: data.profileCompleted || false,
            } as UserProfile;
            
            setProfile(profileData);
            setDisplayName(profileData.displayName || '');
            setProfessionalTitle(profileData.professionalTitle || '');
            setPhone(profileData.phone || '');
            setLocation(profileData.location || '');
            setLinkedin(profileData.linkedin || '');
            setGithub(profileData.github || '');
            setAbout(profileData.about || '');
            setExperiences(profileData.experiences || []);
            setEducation(profileData.education || []);
            setLanguages(profileData.languages || []);
            
            if (profileData.profileCompleted) {
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          } else {
            setProfile(null);
            setDisplayName(currentUser.displayName || '');
            setProfessionalTitle('');
            setPhone('');
            setLocation('');
            setLinkedin('');
            setGithub('');
            setAbout('');
            setExperiences([]);
            setEducation([]);
            setLanguages([]);
            setIsEditing(true);
          }
        }
      } catch (error) {
        if (isMounted) {
          setProfile(null);
          setDisplayName(currentUser.displayName || '');
          setProfessionalTitle('');
          setPhone('');
          setLocation('');
          setLinkedin('');
          setGithub('');
          setAbout('');
          setExperiences([]);
          setEducation([]);
          setLanguages([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
      setProfile(null);
      setDisplayName('');
      setProfessionalTitle('');
      setPhone('');
      setLocation('');
      setLinkedin('');
      setGithub('');
      setAbout('');
      setExperiences([]);
      setEducation([]);
      setLanguages([]);
      setResumeFile(null);
    };
  }, [currentUser]);

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    setExperiences([...experiences, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    if ((field === 'startDate' || field === 'endDate') && typeof value === 'string') {
      value = formatMonthYear(value);
    }
    
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
    };
    setEducation([...education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    if ((field === 'startDate' || field === 'endDate') && typeof value === 'string') {
      value = formatMonthYear(value);
    }
    
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'basic',
    };
    setLanguages([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const uploadResume = async (file: File): Promise<{ url: string; name: string }> => {
    if (!storage) {
      throw new Error('Storage não está configurado');
    }
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `resume_${currentUser!.uid}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `resumes/${currentUser!.uid}/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return { url: downloadURL, name: file.name };
  };

  const deleteOldResume = async (resumeURL: string) => {
    try {
      if (!storage) {
        return;
      }
      
      const url = new URL(resumeURL);
      const pathMatch = url.pathname.match(/\/o\/(.+?)(?:\?|$)/);
      const path = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
      
      if (path) {
        const oldResumeRef = ref(storage, path);
        await deleteObject(oldResumeRef);
      }
    } catch (error) {
      console.error('Erro ao deletar arquivo antigo:', error);
    }
  };

  const validateForm = (): boolean => {
    if (isFirstAccess) {
      if (!displayName.trim()) {
        setMessage({ type: 'error', text: 'Nome completo é obrigatório.' });
        return false;
      }
      
      if (!about.trim()) {
        setMessage({ type: 'error', text: 'Resumo profissional é obrigatório.' });
        return false;
      }

      const hasValidExperience = experiences.length > 0 && experiences.some(exp => 
        exp.company.trim() && exp.position.trim() && exp.startDate.trim()
      );
      
      if (!hasValidExperience) {
        setMessage({ type: 'error', text: 'Adicione pelo menos uma experiência profissional com empresa, cargo e data de início.' });
        return false;
      }

      const hasValidEducation = education.length > 0 && education.some(edu => 
        edu.institution.trim()
      );
      
      if (!hasValidEducation) {
        setMessage({ type: 'error', text: 'Adicione pelo menos uma formação acadêmica com instituição.' });
        return false;
      }

    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Usuário não autenticado.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      let resumeData = {
        resumeURL: profile?.resumeURL,
        resumeName: profile?.resumeName,
      };

      if (resumeFile) {
        setUploadingFile(true);
        
        if (profile?.resumeURL) {
          await deleteOldResume(profile.resumeURL);
        }
        
        const { url, name } = await uploadResume(resumeFile);
        resumeData = { resumeURL: url, resumeName: name };
        setUploadingFile(false);
      }

      const profileData: Record<string, any> = {
        uid: currentUser.uid,
        displayName: displayName.trim() || currentUser.displayName || '',
        email: currentUser.email!,
        professionalTitle: professionalTitle.trim(),
        phone: phone.trim(),
        location: location_.trim(),
        linkedin: linkedin.trim(),
        github: github.trim(),
        about: about.trim(),
        experiences: experiences.filter(exp => exp.company.trim() || exp.position.trim()),
        education: education.filter(edu => edu.institution.trim()),
        languages: languages.filter(lang => lang.language.trim()),
        profileCompleted: true,
        updatedAt: Timestamp.now(),
      };

      if (currentUser.photoURL) {
        profileData.photoURL = currentUser.photoURL;
      }

      if (resumeData.resumeURL) {
        profileData.resumeURL = resumeData.resumeURL;
      }

      if (resumeData.resumeName) {
        profileData.resumeName = resumeData.resumeName;
      }

      if (!db) {
        throw new Error('Firestore não está configurado');
      }

      const profileRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(profileRef, profileData, { merge: true });

      const updatedProfile: UserProfile = {
        uid: profileData.uid,
        displayName: profileData.displayName,
        email: profileData.email,
        photoURL: profileData.photoURL,
        professionalTitle: profileData.professionalTitle,
        phone: profileData.phone,
        location: profileData.location,
        linkedin: profileData.linkedin,
        github: profileData.github,
        about: profileData.about,
        experiences: profileData.experiences,
        education: profileData.education,
        languages: profileData.languages,
        resumeURL: profileData.resumeURL,
        resumeName: profileData.resumeName,
        profileCompleted: true,
        updatedAt: new Date(),
      };

      setProfile(updatedProfile);
      setResumeFile(null);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      const wasUpdatedFromAnalysis = location.state?.analysisData;
      
      if (isFirstAccess) {
        setIsFirstAccess(false);
        setMessage({ type: 'success', text: 'Perfil criado com sucesso! Redirecionando...' });
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 2000);
      } else {
        setIsEditing(false);
        
        if (wasUpdatedFromAnalysis) {
          setMessage({ 
            type: 'success', 
            text: 'Perfil atualizado! Agora vá para Home e clique em "Recarregar do Perfil Atualizado" para fazer uma nova análise com as melhorias aplicadas.' 
          });
        } else {
          setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      const errorCode = error && typeof error === 'object' && 'code' in error ? (error as any).code : '';
      
      if (errorCode === 'permission-denied' || errorMessage.includes('Missing or insufficient permissions')) {
        
        setMessage({ 
          type: 'error', 
          text: 'Erro de permissão do Firestore. Você precisa configurar as regras de segurança no Firebase Console. Verifique o console do navegador (F12) para instruções.' 
        });
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        setMessage({ type: 'error', text: 'Erro de conexão. Verifique sua internet.' });
      } else {
        setMessage({ type: 'error', text: `Erro ao salvar perfil: ${errorMessage}` });
      }
    } finally {
      setSaving(false);
      setUploadingFile(false);
    }
  };

  const dismissMessage = () => {
    setMessage(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!profile?.profileCompleted) {
      return;
    }
    
    if (profile) {
      setDisplayName(profile.displayName || '');
      setProfessionalTitle(profile.professionalTitle || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setLinkedin(profile.linkedin || '');
      setGithub(profile.github || '');
      setAbout(profile.about || '');
      setExperiences(profile.experiences || []);
      setEducation(profile.education || []);
      setLanguages(profile.languages || []);
      setResumeFile(null);
    }
    
    setIsEditing(false);
    setMessage(null);
  };

  const handleDownloadResume = () => {
    if (!profile) return;

    const resumeText = formatResumeText(profile);
    
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `curriculo_${displayName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setMessage({ type: 'success', text: 'Currículo baixado com sucesso!' });
  };

  const formatResumeText = (profileData: UserProfile): string => {
    let text = '';
    
    text += `${profileData.displayName}\n`;
    if (profileData.professionalTitle) text += `${profileData.professionalTitle}\n`;
    text += `\n`;
    
    if (currentUser?.email) text += `Email: ${currentUser.email}\n`;
    if (profileData.phone) text += `Telefone: ${profileData.phone}\n`;
    if (profileData.location) text += `Localização: ${profileData.location}\n`;
    if (profileData.linkedin) text += `LinkedIn: ${profileData.linkedin}\n`;
    if (profileData.github) text += `GitHub: ${profileData.github}\n`;
    text += `\n`;
    
    if (profileData.about) {
      text += `RESUMO PROFISSIONAL\n`;
      text += `${'='.repeat(50)}\n`;
      text += `${profileData.about}\n\n`;
    }
    
    if (profileData.experiences && profileData.experiences.length > 0) {
      text += `EXPERIÊNCIA PROFISSIONAL\n`;
      text += `${'='.repeat(50)}\n`;
      profileData.experiences.forEach((exp) => {
        text += `\n${exp.position} - ${exp.company}\n`;
        if (exp.location) text += `${exp.location}\n`;
        const endDate = exp.isCurrent ? 'Atual' : exp.endDate;
        text += `${exp.startDate} - ${endDate}\n`;
        if (exp.description) text += `\n${exp.description}\n`;
        text += `\n`;
      });
    }
    
    if (profileData.education && profileData.education.length > 0) {
      text += `FORMAÇÃO ACADÊMICA\n`;
      text += `${'='.repeat(50)}\n`;
      profileData.education.forEach((edu) => {
        text += `\n${edu.degree} - ${edu.fieldOfStudy}\n`;
        text += `${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.endDate}\n\n`;
      });
    }
    
    if (profileData.languages && profileData.languages.length > 0) {
      text += `IDIOMAS\n`;
      text += `${'='.repeat(50)}\n`;
      profileData.languages.forEach((lang) => {
        text += `${lang.language}: ${lang.proficiency}\n`;
      });
    }
    
    return text;
  };

  return {
    currentUser,
    profile,
    loading,
    saving,
    uploadingFile,
    message,
    isFirstAccess,
    
    displayName,
    setDisplayName,
    professionalTitle,
    setProfessionalTitle,
    phone,
    setPhone,
    location: location_,
    setLocation,
    linkedin,
    setLinkedin,
    github,
    setGithub,
    
    about,
    setAbout,
    
    experiences,
    addExperience,
    updateExperience,
    removeExperience,
    
    education,
    addEducation,
    updateEducation,
    removeEducation,
    
    languages,
    addLanguage,
    updateLanguage,
    removeLanguage,
    
    handleSubmit,
    dismissMessage,
    
    isEditing,
    handleEdit,
    handleCancelEdit,
    handleDownloadResume,
  };
}
