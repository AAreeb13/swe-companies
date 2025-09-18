import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
}

const Input: React.FC<InputProps> = ({ label, error, help, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${className}`}
        style={{
          borderColor: error ? 'var(--danger)' : 'var(--card-border)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--foreground)'
        }}
        {...props}
      />
      {help && !error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>{help}</p>
      )}
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${className}`}
        style={{
          borderColor: error ? 'var(--danger)' : 'var(--card-border)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--foreground)'
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          {label}
        </label>
      )}
      <select
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:border-transparent ${className}`}
        style={{
          borderColor: error ? 'var(--danger)' : 'var(--card-border)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--foreground)'
        }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  );
};

export default Input;