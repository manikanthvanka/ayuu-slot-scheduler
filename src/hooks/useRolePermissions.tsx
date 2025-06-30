
import { useState, useEffect } from 'react';
import type { UserRole } from '@/types';

export const useRolePermissions = (userRole: UserRole) => {
  const [rolePermissions, setRolePermissions] = useState<any>({});

  useEffect(() => {
    const savedPermissions = localStorage.getItem('rolePermissions');
    if (savedPermissions) {
      setRolePermissions(JSON.parse(savedPermissions));
    } else {
      const defaultPermissions = {
        admin: {
          register_patient: true,
          book_appointment: true,
          view_queue: true,
          update_vitals: true,
          vitals_done: true,
          consultation: true,
          prescribe: true,
          order_tests: true,
          view_history: true,
          manage_roles: true,
          view_reports: true,
          patient_search: true
        },
        doctor: {
          register_patient: false,
          book_appointment: false,
          view_queue: true,
          update_vitals: false,
          vitals_done: false,
          consultation: true,
          prescribe: true,
          order_tests: true,
          view_history: true,
          manage_roles: false,
          view_reports: false,
          patient_search: true
        },
        staff: {
          register_patient: true,
          book_appointment: true,
          view_queue: true,
          update_vitals: true,
          vitals_done: true,
          consultation: false,
          prescribe: false,
          order_tests: false,
          view_history: true,
          manage_roles: false,
          view_reports: true,
          patient_search: true
        },
        patient: {
          register_patient: false,
          book_appointment: true,
          view_queue: false,
          update_vitals: false,
          vitals_done: false,
          consultation: false,
          prescribe: false,
          order_tests: false,
          view_history: false,
          manage_roles: false,
          view_reports: false,
          patient_search: false
        }
      };
      setRolePermissions(defaultPermissions);
      localStorage.setItem('rolePermissions', JSON.stringify(defaultPermissions));
    }
  }, []);

  const updateRolePermissions = (newPermissions: any) => {
    setRolePermissions(newPermissions);
    localStorage.setItem('rolePermissions', JSON.stringify(newPermissions));
  };

  const hasPermission = (permission: string) => {
    return rolePermissions[userRole]?.[permission] || false;
  };

  return {
    rolePermissions,
    updateRolePermissions,
    hasPermission
  };
};
