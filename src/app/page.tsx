'use client';

import { useCompanies } from '@/context/CompaniesContext';
import AddCompanyButton from '@/components/companies/AddCompanyButton';
import CompanyCard from '@/components/companies/CompanyCard';

export default function Home() {
  const { state } = useCompanies();

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

  const statusSummary = getStatusSummary();
  const totalApplications = getTotalApplications();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SWE Companies Tracker</h1>
              <p className="text-gray-600">Track your software engineering job applications</p>
            </div>
            <AddCompanyButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-gray-900">{state.companies.length}</div>
            <div className="text-sm text-gray-600">Companies</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-gray-900">{totalApplications}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-600">{statusSummary.applied}</div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusSummary.interviewing}</div>
            <div className="text-sm text-gray-600">Interviewing</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600">{statusSummary.offered}</div>
            <div className="text-sm text-gray-600">Offered</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-red-600">{statusSummary.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Companies Grid */}
        {state.companies.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to your Job Application Tracker!</h2>
              <p className="text-gray-600 mb-6">
                Start by adding your first company to track your software engineering job applications.
              </p>
              <AddCompanyButton />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {state.companies.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
