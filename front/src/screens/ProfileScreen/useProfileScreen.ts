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
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        if (!db) {
          console.warn('Firestore não está configurado');
          setDisplayName(currentUser.displayName || '');
          return;
        }

        const profileRef = doc(db, 'profiles', currentUser.uid);
        const profileSnap = await getDoc(profileRef);

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
        } else {
          setDisplayName(currentUser.displayName || '');
        }
      } catch (error) {
        console.warn('Aviso ao carregar perfil (pode ser normal se o perfil ainda não existe):', error);
        
        setDisplayName(currentUser.displayName || '');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

  const handleFileChange = (file: File | null) => {
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Formato de arquivo inválido. Use PDF ou DOC/DOCX.' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo 5MB.' });
        return;
      }
      
      setResumeFile(file);
      setMessage(null);
    }
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
        console.warn('Storage não está configurado');
        return;
      }
      
      try {
        const url = new URL(resumeURL);
        const pathMatch = url.pathname.match(/\/o\/(.+?)(?:\?|$)/);
        const path = pathMatch ? decodeURIComponent(pathMatch[1]) : null;
        
        if (path) {
          const oldResumeRef = ref(storage, path);
          await deleteObject(oldResumeRef);
        } else {
          console.warn('Não foi possível extrair o path da URL do currículo:', resumeURL);
        }
      } catch (urlError) {
        console.warn('Erro ao processar URL do currículo antigo, continuando sem deletar:', urlError);
      }
    } catch (error) {
      console.error('Erro ao deletar currículo antigo (não crítico):', error);
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

      // Idiomas são opcionais - não precisa validar
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
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
      // Remove o banner de primeiro acesso após salvar
      if (isFirstAccess) {
        setIsFirstAccess(false);
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 2000);
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

  const handleRemoveResume = async () => {
    if (!currentUser || !profile?.resumeURL) return;

    try {
      setSaving(true);
      await deleteOldResume(profile.resumeURL);

      const profileRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(profileRef, {
        resumeURL: null,
        resumeName: null,
        updatedAt: Timestamp.now(),
      }, { merge: true });

      setProfile({ ...profile, resumeURL: undefined, resumeName: undefined });
      setMessage({ type: 'success', text: 'Currículo removido com sucesso!' });
    } catch (error) {
      console.error('Erro ao remover currículo:', error);
      setMessage({ type: 'error', text: 'Erro ao remover currículo.' });
    } finally {
      setSaving(false);
    }
  };

  const dismissMessage = () => {
    setMessage(null);
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
    
    resumeFile,
    handleFileChange,
    handleSubmit,
    handleRemoveResume,
    dismissMessage,
  };
}
