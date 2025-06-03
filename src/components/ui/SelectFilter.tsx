import React, { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface Option {
  label: string;
  value: string;
}

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  urlParam?: string;
  preventRefresh?: boolean;
}

export function SelectFilter({ label, value, onChange, options, className = '', urlParam = 'temporada', preventRefresh = false }: SelectFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    const paramValue = searchParams?.get(urlParam);
    if (paramValue && paramValue !== value && options.some(opt => opt.value === paramValue)) {
      onChange(paramValue);
      setInternalValue(paramValue);
    }
  }, [searchParams, urlParam, value, onChange, options]);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    if (!options.some(opt => opt.value === newValue)) {
      console.warn(`Valor inválido para SelectFilter: ${newValue}`);
      return;
    }
    
    setInternalValue(newValue);
    
    onChange(newValue);
    
    if (!preventRefresh) {
      const currentParams = new URLSearchParams(searchParams?.toString() || '');
      
      const params = new URLSearchParams(currentParams.toString());
      params.set(urlParam, newValue);
      
      const showParam = currentParams.get('show');
      const setorParam = currentParams.get('setor');
      
      if (showParam) params.set('show', showParam);
      if (setorParam) params.set('setor', setorParam);
      
      const newUrl = `${pathname}?${params.toString()}`;
      console.log(`Navegando para: ${newUrl}`);
      router.replace(newUrl, { scroll: false });
    }
  }

  return (
    <div className={`flex flex-col items-center px-4 w-full ${className}`}>
      <label className="text-xs font-medium mb-1 text-gray-700">{label}</label>
      <select
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-md 
                   focus:ring-blue-500 focus:border-blue-500 block py-2 w-full text-center lg:max-w-[800px] xl:max-w-[650px] 2xl:max-w-[800px]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}