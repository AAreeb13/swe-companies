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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{company.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {company.location && <p>📍 {company.location}</p>}
              {company.industry && <p>🏢 {company.industry}</p>}
              {company.size && <p>👥 {company.size}</p>}
              {company.website && (
                <p>
                  🌐 <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {company.website}
                  </a>
                </p>
              )}
            </div>
            
            {/* Tags Display */}
            {company.tags && company.tags.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {company.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                      style={{ borderRadius: '0.375rem' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{company.notes}</p>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Applications ({totalApplications})</h4>
            <AddApplicationButton companyId={company.id} />
          </div>
          
          {totalApplications > 0 && (
            <div className="grid grid-cols-5 gap-2 text-xs mb-3">
              <div className="text-center p-2 bg-blue-50 rounded">
                <div className="font-semibold text-blue-800">{statusCounts.applied}</div>
                <div className="text-blue-600">Applied</div>
              </div>
              <div className="text-center p-2 bg-yellow-50 rounded">
                <div className="font-semibold text-yellow-800">{statusCounts.interviewing}</div>
                <div className="text-yellow-600">Interviewing</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="font-semibold text-green-800">{statusCounts.offered}</div>
                <div className="text-green-600">Offered</div>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <div className="font-semibold text-red-800">{statusCounts.rejected}</div>
                <div className="text-red-600">Rejected</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="font-semibold text-gray-800">{statusCounts.withdrawn}</div>
                <div className="text-gray-600">Withdrawn</div>
              </div>
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-3">
            {company.applications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No applications yet. Add your first application!</p>
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