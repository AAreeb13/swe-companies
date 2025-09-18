'use client';

import { useCompanies } from '@/context/CompaniesContext';
import AddCompanyButton from '@/components/companies/AddCompanyButton';
import CompanyCard from '@/components/companies/CompanyCard';
import { useState, useMemo } from 'react';

export default function Home() {
  const { state } = useCompanies();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const getTotalApplications = () => {
    return state.companies.reduce((total, company) => total + company.applications.length, 0);
  };

  const getStatusSummary = () => {
    const summary = {
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
      withdrawn: 0
    };
    
    state.companies.forEach(company => {
      company.applications.forEach(app => {
        summary[app.status]++;
      });
    });
    
    return summary;
  };

  // Get all unique tags from all applications across all companies
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    state.companies.forEach(company => {
      company.applications.forEach(application => {
        application.tags?.forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags).sort();
  }, [state.companies]);

  // Filter companies based on selected tags (now searches across all applications)
  const filteredCompanies = useMemo(() => {
    if (selectedTags.length === 0) {
      return state.companies;
    }
    return state.companies.filter(company => 
      company.applications.some(application =>
        selectedTags.some(selectedTag => 
          application.tags?.includes(selectedTag)
        )
      )
    );
  }, [state.companies, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const statusSummary = getStatusSummary();
  const totalApplications = getTotalApplications();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--muted-bg)' }}>
      <header style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>SWE Companies Tracker</h1>
              <p style={{ color: 'var(--muted)' }}>Track your software engineering job applications</p>
            </div>
            <AddCompanyButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{state.companies.length}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Companies</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{totalApplications}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Total Applications</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>{statusSummary.applied}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Applied</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>{statusSummary.interviewing}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Interviewing</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{statusSummary.offered}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Offered</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>{statusSummary.rejected}</div>
            <div className="text-sm" style={{ color: 'var(--muted)' }}>Rejected</div>
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="mb-8 p-4 border" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderColor: 'var(--card-border)' }}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-medium" style={{ color: 'var(--foreground)' }}>Filter by tags:</h3>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-sm font-medium border transition-colors`}
                  style={{ 
                    borderRadius: '0.375rem',
                    ...(selectedTags.includes(tag)
                      ? { 
                          backgroundColor: 'var(--primary-muted)', 
                          color: 'var(--primary)', 
                          borderColor: 'var(--primary)' 
                        }
                      : { 
                          backgroundColor: 'var(--muted-bg)', 
                          color: 'var(--muted)', 
                          borderColor: 'var(--card-border)' 
                        })
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedTags.includes(tag)) {
                      e.currentTarget.style.backgroundColor = 'var(--card-border)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedTags.includes(tag)) {
                      e.currentTarget.style.backgroundColor = 'var(--muted-bg)';
                    }
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted)' }}>
                <span>Active filters: {selectedTags.join(', ')}</span>
                <button
                  onClick={clearFilters}
                  className="underline hover:no-underline"
                  style={{ color: 'var(--primary)' }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Companies Grid */}
        {state.companies.length === 0 ? (
          <div className="text-center py-12">
            <div className="rounded-lg p-8" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Welcome to your Job Application Tracker!</h2>
              <p className="mb-6" style={{ color: 'var(--muted)' }}>
                Start by adding your first company to track your software engineering job applications.
              </p>
              <AddCompanyButton />
            </div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-8 border" style={{ backgroundColor: 'var(--card-bg)', boxShadow: 'var(--shadow)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>No companies match your filters</h2>
              <p className="mb-6" style={{ color: 'var(--muted)' }}>
                Try adjusting your tag filters or add more companies.
              </p>
              <button
                onClick={clearFilters}
                className="mr-4 px-4 py-2 transition-colors"
                style={{ 
                  borderRadius: '0.25rem',
                  backgroundColor: 'var(--primary)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                }}
              >
                Clear Filters
              </button>
              <AddCompanyButton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCompanies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
