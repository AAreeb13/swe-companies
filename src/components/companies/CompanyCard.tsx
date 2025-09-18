'use client';

import React, { useState } from 'react';
import { Company } from '@/types';
import { useCompanies } from '@/context/CompaniesContext';
import Button from '@/components/ui/Button';
import AddApplicationButton from '@/components/applications/AddApplicationButton';
import ApplicationCard from '@/components/applications/ApplicationCard';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { deleteCompany } = useCompanies();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${company.name}? This will also delete all applications for this company.`)) {
      deleteCompany(company.id);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };
    
    company.applications.forEach(app => {
      counts[app.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalApplications = company.applications.length;

  return (
    <div className="rounded-lg border transition-shadow hover:shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', boxShadow: 'var(--shadow)' }}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{company.name}</h3>
            <div className="text-sm space-y-1" style={{ color: 'var(--muted)' }}>
              {company.location && <p>📍 {company.location}</p>}
              {company.industry && <p>🏢 {company.industry}</p>}
              {company.size && <p>👥 {company.size}</p>}
              {company.website && (
                <p>
                  🌐 <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--primary)' }}>
                    {company.website}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        {company.notes && (
          <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: 'var(--muted-bg)' }}>
            <p className="text-sm" style={{ color: 'var(--foreground)' }}>{company.notes}</p>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium" style={{ color: 'var(--foreground)' }}>Applications ({totalApplications})</h4>
            <AddApplicationButton companyId={company.id} />
          </div>
          
          {totalApplications > 0 && (
            <div className="grid grid-cols-5 gap-2 text-xs mb-3">
              <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--primary-muted)' }}>
                <div className="font-semibold" style={{ color: 'var(--primary)' }}>{statusCounts.applied}</div>
                <div style={{ color: 'var(--primary)' }}>Applied</div>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--warning-muted)' }}>
                <div className="font-semibold" style={{ color: 'var(--warning)' }}>{statusCounts.interviewing}</div>
                <div style={{ color: 'var(--warning)' }}>Interviewing</div>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--success-muted)' }}>
                <div className="font-semibold" style={{ color: 'var(--success)' }}>{statusCounts.offered}</div>
                <div style={{ color: 'var(--success)' }}>Offered</div>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--danger-muted)' }}>
                <div className="font-semibold" style={{ color: 'var(--danger)' }}>{statusCounts.rejected}</div>
                <div style={{ color: 'var(--danger)' }}>Rejected</div>
              </div>
              <div className="text-center p-2 rounded" style={{ backgroundColor: 'var(--muted-bg)' }}>
                <div className="font-semibold" style={{ color: 'var(--muted)' }}>{statusCounts.withdrawn}</div>
                <div style={{ color: 'var(--muted)' }}>Withdrawn</div>
              </div>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {company.applications.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--muted)' }}>No applications yet. Add your first application!</p>
            ) : (
              company.applications.map(application => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  companyId={company.id}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyCard;