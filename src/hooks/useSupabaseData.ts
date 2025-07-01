import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Patient {
  id: string;
  mr_number: string;
  name: string;
  age: number;
  phone: string;
  email?: string;
  address?: string;
  status: string;
  token?: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id?: string;
  patient_name: string;
  mr_number: string;
  appointment_date: string;
  status: string;
  vitals?: any;
  notes?: string;
  token?: number;
  created_at: string;
  updated_at: string;
}

export const useSupabaseData = (shouldFetch: boolean = true) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const { toast } = useToast();

  // Enhanced connection test with detailed diagnostics
  const testConnection = async () => {
    try {
      console.log('🔍 Starting comprehensive Supabase connection test...');
      setConnectionStatus('checking');

      // Test 1: Basic connectivity
      console.log('📡 Test 1: Testing basic Supabase client connectivity...');

      // Test 2: Check if patients table exists and is accessible
      console.log('📋 Test 2: Checking patients table accessibility...');
      const { data: patientsTest, error: patientsError, count: patientsCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
      
      if (patientsError) {
        console.error('❌ Patients table test failed:', patientsError);
        console.error('Error details:', {
          code: patientsError.code,
          message: patientsError.message,
          details: patientsError.details,
          hint: patientsError.hint
        });
        
        if (patientsError.code === 'PGRST116') {
          console.error('🚨 Table "patients" does not exist or is not accessible via API');
          toast({
            title: "Database Error - Patients Table",
            description: "The patients table doesn't exist or isn't accessible. Please check your Supabase table setup.",
            variant: "destructive",
          });
        } else if (patientsError.code === '42501') {
          console.error('🚨 Permission denied for patients table');
          toast({
            title: "Permission Error - Patients",
            description: "Access denied to patients table. Check RLS policies and API permissions.",
            variant: "destructive",
          });
        }
        
        setConnectionStatus('error');
        return false;
      }
      
      console.log('✅ Patients table accessible, record count:', patientsCount);

      // Test 3: Check if appointments table exists and is accessible
      console.log('📅 Test 3: Checking appointments table accessibility...');
      const { data: appointmentsTest, error: appointmentsError, count: appointmentsCount } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });
      
      if (appointmentsError) {
        console.error('❌ Appointments table test failed:', appointmentsError);
        console.error('Error details:', {
          code: appointmentsError.code,
          message: appointmentsError.message,
          details: appointmentsError.details,
          hint: appointmentsError.hint
        });
        
        if (appointmentsError.code === 'PGRST116') {
          console.error('🚨 Table "appointments" does not exist or is not accessible via API');
          toast({
            title: "Database Error - Appointments Table",
            description: "The appointments table doesn't exist or isn't accessible. Please check your Supabase table setup.",
            variant: "destructive",
          });
        } else if (appointmentsError.code === '42501') {
          console.error('🚨 Permission denied for appointments table');
          toast({
            title: "Permission Error - Appointments",
            description: "Access denied to appointments table. Check RLS policies and API permissions.",
            variant: "destructive",
          });
        }
        
        setConnectionStatus('error');
        return false;
      }
      
      console.log('✅ Appointments table accessible, record count:', appointmentsCount);

      // Test 4: Test write permissions by attempting a mock insert (then immediately delete)
      console.log('✏️ Test 4: Testing write permissions...');
      const testPatient = {
        mr_number: 'TEST_CONNECTION_' + Date.now(),
        name: 'Connection Test',
        age: 0,
        phone: '0000000000',
        status: 'Test'
      };

      const { data: insertTest, error: insertError } = await supabase
        .from('patients')
        .insert([testPatient])
        .select()
        .single();

      if (insertError) {
        console.error('❌ Write permission test failed:', insertError);
        console.error('Insert error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details
        });
        
        toast({
          title: "Write Permission Error",
          description: "Cannot insert data. Check RLS policies for INSERT permissions.",
          variant: "destructive",
        });
        
        // Don't fail completely on write error, some apps might be read-only
        console.log('⚠️ Write test failed, but continuing with read-only mode');
      } else {
        console.log('✅ Write permissions working');
        
        // Clean up test record
        if (insertTest) {
          await supabase.from('patients').delete().eq('id', insertTest.id);
          console.log('🧹 Test record cleaned up');
        }
      }

      console.log('🎉 Connection test completed successfully!');
      setConnectionStatus('connected');
      return true;

    } catch (error) {
      console.error('💥 Unexpected error during connection test:', error);
      setConnectionStatus('error');
      toast({
        title: "Connection Test Failed",
        description: "Unexpected error during connection test. Check console for details.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fetch patients
  const fetchPatients = async () => {
    if (!shouldFetch) return;
    
    try {
      console.log('Fetching patients from Supabase...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error fetching patients:', error);
        throw error;
      }
      
      console.log('Patients fetched successfully:', data?.length || 0);
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      if (shouldFetch) {
        toast({
          title: "Database Error",
          description: "Failed to fetch patients. Please check your Supabase connection and table setup.",
          variant: "destructive",
        });
      }
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!shouldFetch) return;
    
    try {
      console.log('Fetching appointments from Supabase...');
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: true });

      if (error) {
        console.error('Supabase error fetching appointments:', error);
        throw error;
      }
      
      console.log('Appointments fetched successfully:', data?.length || 0);
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (shouldFetch) {
        toast({
          title: "Database Error",
          description: "Failed to fetch appointments. Please check your Supabase connection and table setup.",
          variant: "destructive",
        });
      }
    }
  };

  // Create patient
  const createPatient = async (patientData: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating patient:', patientData);
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
        .single();

      if (error) {
        console.error('Error creating patient:', error);
        throw error;
      }
      
      console.log('Patient created successfully:', data);
      await fetchPatients(); // Refresh the list
      toast({
        title: "Success",
        description: "Patient registered successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating patient:', error);
      toast({
        title: "Error",
        description: "Failed to register patient",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating appointment:', appointmentData);
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
      
      console.log('Appointment created successfully:', data);
      await fetchAppointments(); // Refresh the list
      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update patient status
  const updatePatientStatus = async (patientId: string, newStatus: string) => {
    try {
      console.log('Updating patient status:', patientId, newStatus);
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', patientId);

      if (error) {
        console.error('Error updating patient status:', error);
        throw error;
      }

      // Also update appointments with the same patient
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        await supabase
          .from('appointments')
          .update({ status: newStatus })
          .eq('mr_number', patient.mr_number);
      }

      await fetchPatients();
      await fetchAppointments();
      
      toast({
        title: "Success",
        description: "Patient status updated",
      });
    } catch (error) {
      console.error('Error updating patient status:', error);
      toast({
        title: "Error",
        description: "Failed to update patient status",
        variant: "destructive",
      });
    }
  };

  // Search patients
  const searchPatients = async (query: string) => {
    try {
      console.log('Searching patients with query:', query);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`name.ilike.%${query}%,mr_number.ilike.%${query}%,phone.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching patients:', error);
        throw error;
      }
      
      console.log('Search results:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('Error searching patients:', error);
      toast({
        title: "Error",
        description: "Failed to search patients",
        variant: "destructive",
      });
      return [];
    }
  };

  // Find patient by MR number
  const findPatientByMR = async (mrNumber: string) => {
    try {
      console.log('Finding patient by MR number:', mrNumber);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('mr_number', mrNumber)
        .maybeSingle();

      if (error) {
        console.error('Error finding patient by MR:', error);
        throw error;
      }
      
      console.log('Patient found:', data ? 'Yes' : 'No');
      return data;
    } catch (error) {
      console.error('Error finding patient by MR:', error);
      return null;
    }
  };

  // Initial data fetch with enhanced error handling
  useEffect(() => {
    if (!shouldFetch) {
      console.log('Data fetching disabled - shouldFetch is false');
      setPatients([]);
      setAppointments([]);
      setIsLoading(false);
      setConnectionStatus('checking');
      return;
    }

    const loadData = async () => {
      console.log('🚀 Starting enhanced Supabase data loading...');
      setIsLoading(true);
      
      try {
        // Test connection first with detailed diagnostics
        const isConnected = await testConnection();
        
        if (isConnected) {
          console.log('✅ Connection verified, fetching data...');
          await Promise.all([fetchPatients(), fetchAppointments()]);
          console.log('🎯 Initial data loading completed successfully');
        } else {
          console.error('❌ Failed to establish Supabase connection');
          toast({
            title: "Connection Error",
            description: "Unable to connect to Supabase. Check console for detailed diagnostics.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('💥 Error loading initial data:', error);
        toast({
          title: "Database Error",
          description: "Failed to load data. Check console for detailed error information.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [shouldFetch]);

  return {
    patients,
    appointments,
    isLoading,
    connectionStatus,
    createPatient,
    createAppointment,
    updatePatientStatus,
    searchPatients,
    findPatientByMR,
    fetchPatients,
    fetchAppointments,
    testConnection
  };
};
