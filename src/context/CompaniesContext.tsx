'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Company, Application } from '@/types';

interface CompaniesState {
  companies: Company[];
}

type CompaniesAction =
  | { type: 'SET_COMPANIES'; payload: Company[] }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: { id: string; updates: Partial<Company> } }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'ADD_APPLICATION'; payload: { companyId: string; application: Application } }
  | { type: 'UPDATE_APPLICATION'; payload: { companyId: string; applicationId: string; updates: Partial<Application> } }
  | { type: 'DELETE_APPLICATION'; payload: { companyId: string; applicationId: string } };

interface CompaniesContextType {
  state: CompaniesState;
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'applications'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  addApplication: (companyId: string, application: Omit<Application, 'id'>) => void;
  updateApplication: (companyId: string, applicationId: string, updates: Partial<Application>) => void;
  deleteApplication: (companyId: string, applicationId: string) => void;
  getCompanyById: (id: string) => Company | undefined;
}

const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined);

const companiesReducer = (state: CompaniesState, action: CompaniesAction): CompaniesState => {
  switch (action.type) {
    case 'SET_COMPANIES':
      return { companies: action.payload };
    
    case 'ADD_COMPANY':
      return { companies: [...state.companies, action.payload] };
    
    case 'UPDATE_COMPANY':
      return {
        companies: state.companies.map(company =>
          company.id === action.payload.id
            ? { ...company, ...action.payload.updates }
            : company
        )
      };
    
    case 'DELETE_COMPANY':
      return {
        companies: state.companies.filter(company => company.id !== action.payload)
      };
    
    case 'ADD_APPLICATION':
      return {
        companies: state.companies.map(company =>
          company.id === action.payload.companyId
            ? { ...company, applications: [...company.applications, action.payload.application] }
            : company
        )
      };
    
    case 'UPDATE_APPLICATION':
      return {
        companies: state.companies.map(company =>
          company.id === action.payload.companyId
            ? {
                ...company,
                applications: company.applications.map(app =>
                  app.id === action.payload.applicationId
                    ? { ...app, ...action.payload.updates }
                    : app
                )
              }
            : company
        )
      };
    
    case 'DELETE_APPLICATION':
      return {
        companies: state.companies.map(company =>
          company.id === action.payload.companyId
            ? {
                ...company,
                applications: company.applications.filter(app => app.id !== action.payload.applicationId)
              }
            : company
        )
      };
    
    default:
      return state;
  }
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const CompaniesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(companiesReducer, { companies: [] });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('swe-companies-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Ensure backward compatibility by adding tags array if missing
        const companiesWithTags = parsedData.map((company: Partial<Company>) => ({
          ...company,
          tags: company.tags || []
        })) as Company[];
        dispatch({ type: 'SET_COMPANIES', payload: companiesWithTags });
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('swe-companies-data', JSON.stringify(state.companies));
  }, [state.companies]);

  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'applications'>) => {
    const newCompany: Company = {
      ...companyData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      applications: [],
      tags: companyData.tags || []
    };
    dispatch({ type: 'ADD_COMPANY', payload: newCompany });
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    dispatch({ type: 'UPDATE_COMPANY', payload: { id, updates } });
  };

  const deleteCompany = (id: string) => {
    dispatch({ type: 'DELETE_COMPANY', payload: id });
  };

  const addApplication = (companyId: string, applicationData: Omit<Application, 'id'>) => {
    const newApplication: Application = {
      ...applicationData,
      id: generateId()
    };
    dispatch({ type: 'ADD_APPLICATION', payload: { companyId, application: newApplication } });
  };

  const updateApplication = (companyId: string, applicationId: string, updates: Partial<Application>) => {
    dispatch({ type: 'UPDATE_APPLICATION', payload: { companyId, applicationId, updates } });
  };

  const deleteApplication = (companyId: string, applicationId: string) => {
    dispatch({ type: 'DELETE_APPLICATION', payload: { companyId, applicationId } });
  };

  const getCompanyById = (id: string) => {
    return state.companies.find(company => company.id === id);
  };

  const value: CompaniesContextType = {
    state,
    addCompany,
    updateCompany,
    deleteCompany,
    addApplication,
    updateApplication,
    deleteApplication,
    getCompanyById
  };

  return (
    <CompaniesContext.Provider value={value}>
      {children}
    </CompaniesContext.Provider>
  );
};

export const useCompanies = () => {
  const context = useContext(CompaniesContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompaniesProvider');
  }
  return context;
};