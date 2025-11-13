import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import type { UserProfile } from './types';

export function useProfileScreen() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [about, setAbout] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
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
          } as UserProfile;
          setProfile(profileData);
          setDisplayName(profileData.displayName || '');
          setAbout(profileData.about || '');
          setGithub(profileData.github || '');
          setLinkedin(profileData.linkedin || '');
        } else {
          setDisplayName(currentUser.displayName || '');
        }
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('permission') || errorMessage.includes('Permission') || errorMessage.includes('Missing or insufficient permissions')) {
          setMessage({ type: 'error', text: 'Erro de permissão ao carregar perfil. Verifique as regras do Firestore.' });
        } else if (errorMessage.includes('network') || errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
          setMessage({ type: 'error', text: 'Erro de conexão. Verifique sua internet.' });
        } else {
          console.warn('Aviso ao carregar perfil (pode ser normal se o perfil ainda não existe):', error);
        }
        
        setDisplayName(currentUser.displayName || '');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Usuário não autenticado.' });
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const profileData: Record<string, any> = {
        uid: currentUser.uid,
        displayName: displayName.trim() || currentUser.displayName || '',
        email: currentUser.email!,
        updatedAt: Timestamp.now(),
      };

      if (currentUser.photoURL) {
        profileData.photoURL = currentUser.photoURL;
      }

      if (about.trim()) {
        profileData.about = about.trim();
      }

      if (github.trim()) {
        profileData.github = github.trim();
      }

      if (linkedin.trim()) {
        profileData.linkedin = linkedin.trim();
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
        about: profileData.about,
        github: profileData.github,
        linkedin: profileData.linkedin,
        resumeURL: profileData.resumeURL,
        resumeName: profileData.resumeName,
        updatedAt: new Date(),
      };

      setProfile(updatedProfile);
      setResumeFile(null);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
        setMessage({ type: 'error', text: 'Erro de permissão. Verifique se você está autenticado.' });
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
    displayName,
    setDisplayName,
    about,
    setAbout,
    github,
    setGithub,
    linkedin,
    setLinkedin,
    resumeFile,
    handleFileChange,
    handleSubmit,
    handleRemoveResume,
    dismissMessage,
  };
}

