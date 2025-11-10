import { useState, useEffect, useMemo } from 'react';
import type { Job, Company } from './types';

export function useCompaniesScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const COMPANIES_PER_PAGE = 30;

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://apibr.com/vagas/api/v2/issues?page=1&per_page=100`);
        if (!response.ok) throw new Error('Falha ao buscar dados da API');
        
        const data: Job[] = await response.json();
        setJobs(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const companies = useMemo<Company[]>(() => {
    const companyMap = new Map<string, Company>();

    jobs.forEach(job => {
      const orgLogin = job.repository.organization.login;
      const orgAvatar = job.repository.organization.avatar_url;

      if (companyMap.has(orgLogin)) {
        const company = companyMap.get(orgLogin)!;
        company.jobCount++;
      } else {
        companyMap.set(orgLogin, {
          id: orgLogin,
          name: orgLogin,
          avatar_url: orgAvatar,
          jobCount: 1
        });
      }
    });

    return Array.from(companyMap.values()).sort((a, b) => b.jobCount - a.jobCount);
  }, [jobs]);

  const totalPages = Math.ceil(companies.length / COMPANIES_PER_PAGE);
  const displayedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * COMPANIES_PER_PAGE;
    const endIndex = startIndex + COMPANIES_PER_PAGE;
    return companies.slice(startIndex, endIndex);
  }, [companies, currentPage]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    loading,
    error,
    companies,
    displayedCompanies,
    currentPage,
    setCurrentPage,
    hasNextPage,
    hasPreviousPage,
    totalPages
  };
}

