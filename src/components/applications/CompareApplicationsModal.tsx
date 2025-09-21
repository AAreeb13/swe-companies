'use client';

import React, { useState, useMemo } from 'react';
import { useCompanies } from '@/context/CompaniesContext';
import { Application } from '@/types';
import Modal from '@/components/ui/Modal';
import { Select } from '@/components/ui/Input';

interface CompareApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApplicationWithCompany extends Application {
  companyName: string;
  companyId: string;
}

const CompareApplicationsModal: React.FC<CompareApplicationsModalProps> = ({ isOpen, onClose }) => {
  const { state } = useCompanies();
  const [selectedApp1, setSelectedApp1] = useState<string>('');
  const [selectedApp2, setSelectedApp2] = useState<string>('');

  // Flatten all applications with company info
  const allApplications: ApplicationWithCompany[] = useMemo(() => {
    const apps: ApplicationWithCompany[] = [];
    state.companies.forEach(company => {
      company.applications.forEach(app => {
        apps.push({
          ...app,
          companyName: company.name,
          companyId: company.id
        });
      });
    });
    return apps;
  }, [state.companies]);

  // Create options for select dropdowns
  const applicationOptions = useMemo(() => {
    return allApplications.map(app => ({
      value: `${app.companyId}|||${app.id}`,
      label: `${app.companyName} - ${app.position}`
    }));
  }, [allApplications]);

  const getApplicationById = (appId: string): ApplicationWithCompany | undefined => {
    const [companyId, applicationId] = appId.split('|||');
    return allApplications.find(app => app.companyId === companyId && app.id === applicationId);
  };

  const app1 = selectedApp1 ? getApplicationById(selectedApp1) : undefined;
  const app2 = selectedApp2 ? getApplicationById(selectedApp2) : undefined;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const resetSelections = () => {
    setSelectedApp1('');
    setSelectedApp2('');
  };

  const handleClose = () => {
    resetSelections();
    onClose();
  };

  if (allApplications.length < 2) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Compare Applications">
        <div className="text-center py-8">
          <p style={{ color: 'var(--muted)' }}>
            You need at least 2 applications to compare. Add more applications to use this feature.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Compare Applications">
      <div className="space-y-6">
        {/* Application Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="First Application"
            name="app1"
            value={selectedApp1}
            onChange={(e) => setSelectedApp1(e.target.value)}
            options={[
              { value: '', label: 'Select an application...' },
              ...applicationOptions.filter(opt => opt.value !== selectedApp2)
            ]}
          />
          <Select
            label="Second Application"
            name="app2"
            value={selectedApp2}
            onChange={(e) => setSelectedApp2(e.target.value)}
            options={[
              { value: '', label: 'Select an application...' },
              ...applicationOptions.filter(opt => opt.value !== selectedApp1)
            ]}
          />
        </div>

        {/* Comparison Table */}
        {app1 && app2 && (
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>Application Comparison</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--card-border)' }}>
                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--foreground)' }}>Field</th>
                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--foreground)' }}>
                      {app1.companyName} - {app1.position}
                    </th>
                    <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--foreground)' }}>
                      {app2.companyName} - {app2.position}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow 
                    label="Company" 
                    value1={app1.companyName} 
                    value2={app2.companyName} 
                  />
                  <ComparisonRow 
                    label="Position" 
                    value1={app1.position} 
                    value2={app2.position} 
                  />
                  <ComparisonRow 
                    label="Status" 
                    value1={formatStatus(app1.status)} 
                    value2={formatStatus(app2.status)} 
                  />
                  <ComparisonRow 
                    label="Priority" 
                    value1={formatPriority(app1.priority)} 
                    value2={formatPriority(app2.priority)} 
                  />
                  <ComparisonRow 
                    label="Date Applied" 
                    value1={formatDate(app1.dateApplied)} 
                    value2={formatDate(app2.dateApplied)} 
                  />
                  <ComparisonRow 
                    label="Application URL" 
                    value1={app1.applicationUrl || 'Not provided'} 
                    value2={app2.applicationUrl || 'Not provided'} 
                  />
                  <ComparisonRow 
                    label="Tags" 
                    value1={app1.tags?.join(', ') || 'None'} 
                    value2={app2.tags?.join(', ') || 'None'} 
                  />
                  <ComparisonRow 
                    label="Notes" 
                    value1={app1.notes || 'No notes'} 
                    value2={app2.notes || 'No notes'} 
                    isLongText
                  />
                  <ComparisonRow 
                    label="Brainstorming" 
                    value1={app1.brainstorming || 'No brainstorming'} 
                    value2={app2.brainstorming || 'No brainstorming'} 
                    isLongText
                  />
                  <ComparisonRow 
                    label="Cover Letter" 
                    value1={app1.coverLetter ? 'Present' : 'Not provided'} 
                    value2={app2.coverLetter ? 'Present' : 'Not provided'} 
                  />
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(!app1 || !app2) && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--card-border)' }}>
            <p style={{ color: 'var(--muted)' }}>
              Select two applications above to see their comparison
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

interface ComparisonRowProps {
  label: string;
  value1: string;
  value2: string;
  isLongText?: boolean;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ label, value1, value2, isLongText = false }) => {
  const isDifferent = value1 !== value2;
  
  return (
    <tr className="border-b" style={{ borderColor: 'var(--card-border)' }}>
      <td className="px-4 py-3 font-medium" style={{ color: 'var(--foreground)' }}>
        {label}
      </td>
      <td 
        className={`px-4 py-3 ${isDifferent ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
        style={{ color: 'var(--foreground)' }}
      >
        {isLongText ? (
          <div className="max-w-xs">
            <p className="text-sm truncate" title={value1}>
              {value1}
            </p>
          </div>
        ) : (
          value1
        )}
      </td>
      <td 
        className={`px-4 py-3 ${isDifferent ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}
        style={{ color: 'var(--foreground)' }}
      >
        {isLongText ? (
          <div className="max-w-xs">
            <p className="text-sm truncate" title={value2}>
              {value2}
            </p>
          </div>
        ) : (
          value2
        )}
      </td>
    </tr>
  );
};

export default CompareApplicationsModal;