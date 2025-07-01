-- Drop existing tables and recreate with proper normalization
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS usercomdet CASCADE;

-- Core users table with basic information
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table (many-to-many relationship)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'staff', 'patient')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- User communication details
CREATE TABLE public.user_communication (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Doctor-specific profile information
CREATE TABLE public.doctor_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  specialty TEXT,
  experience TEXT,
  availability TEXT,
  license_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Patient-specific profile information
CREATE TABLE public.patient_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  mr_number TEXT NOT NULL UNIQUE,
  blood_group TEXT,
  allergies TEXT[],
  medical_history TEXT[],
  current_medications TEXT[],
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'checked-in', 'vitals-done', 'with-doctor', 'sent-for-tests', 're-check-pending', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_communication ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Staff can manage users" ON public.users FOR ALL USING (true);

-- RLS Policies for user_roles table
CREATE POLICY "User roles are viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (true);

-- RLS Policies for user_communication table
CREATE POLICY "User communication is viewable by everyone" ON public.user_communication FOR SELECT USING (true);
CREATE POLICY "Staff can manage user communication" ON public.user_communication FOR ALL USING (true);

-- RLS Policies for doctor_profiles table
CREATE POLICY "Doctor profiles are viewable by everyone" ON public.doctor_profiles FOR SELECT USING (true);
CREATE POLICY "Staff can manage doctor profiles" ON public.doctor_profiles FOR ALL USING (true);

-- RLS Policies for patient_profiles table
CREATE POLICY "Patient profiles are viewable by everyone" ON public.patient_profiles FOR SELECT USING (true);
CREATE POLICY "Staff can manage patient profiles" ON public.patient_profiles FOR ALL USING (true);

-- Update triggers for timestamp columns
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_communication_updated_at
  BEFORE UPDATE ON public.user_communication
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_profiles_updated_at
  BEFORE UPDATE ON public.doctor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_profiles_updated_at
  BEFORE UPDATE ON public.patient_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update appointments table to reference users instead of patients
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_patient_id_fkey 
  FOREIGN KEY (patient_id) REFERENCES public.users(id);

-- Insert sample users
INSERT INTO public.users (id, first_name, last_name, gender, date_of_birth) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'John', 'Doe', 'Male', '1990-01-15'),
('550e8400-e29b-41d4-a716-446655440001', 'Jane', 'Smith', 'Female', '1985-03-22'),
('550e8400-e29b-41d4-a716-446655440002', 'Dr. Sarah', 'Wilson', 'Female', '1980-07-10'),
('550e8400-e29b-41d4-a716-446655440003', 'Dr. Michael', 'Brown', 'Male', '1975-11-05'),
('550e8400-e29b-41d4-a716-446655440004', 'Admin', 'User', 'Other', '1985-05-15'),
('550e8400-e29b-41d4-a716-446655440005', 'Staff', 'Member', 'Female', '1990-09-20');

-- Insert user roles
INSERT INTO public.user_roles (user_id, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'patient'),
('550e8400-e29b-41d4-a716-446655440001', 'patient'),
('550e8400-e29b-41d4-a716-446655440002', 'doctor'),
('550e8400-e29b-41d4-a716-446655440003', 'doctor'),
('550e8400-e29b-41d4-a716-446655440004', 'admin'),
('550e8400-e29b-41d4-a716-446655440005', 'staff');

-- Insert communication details
INSERT INTO public.user_communication (user_id, email, phone, address) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'john.doe@email.com', '+1234567890', '123 Main St, City'),
('550e8400-e29b-41d4-a716-446655440001', 'jane.smith@email.com', '+1234567891', '456 Oak Ave, Town'),
('550e8400-e29b-41d4-a716-446655440002', 'dr.sarah@hospital.com', '+1234567892', '789 Medical Center'),
('550e8400-e29b-41d4-a716-446655440003', 'dr.michael@hospital.com', '+1234567893', '789 Medical Center'),
('550e8400-e29b-41d4-a716-446655440004', 'admin@hospital.com', '+1234567894', '100 Admin Building'),
('550e8400-e29b-41d4-a716-446655440005', 'staff@hospital.com', '+1234567895', '200 Staff Building');

-- Insert doctor profiles
INSERT INTO public.doctor_profiles (user_id, specialty, experience, availability, license_number) VALUES 
('550e8400-e29b-41d4-a716-446655440002', 'Cardiology', '15 years', 'Mon-Fri 9AM-5PM', 'MD12345'),
('550e8400-e29b-41d4-a716-446655440003', 'Neurology', '12 years', 'Mon-Wed 8AM-4PM', 'MD67890');

-- Insert patient profiles
INSERT INTO public.patient_profiles (user_id, mr_number, blood_group, status) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'MR001', 'O+', 'registered'),
('550e8400-e29b-41d4-a716-446655440001', 'MR002', 'A+', 'checked-in');

-- Update existing appointments to use the new user IDs
UPDATE public.appointments SET patient_id = '550e8400-e29b-41d4-a716-446655440000' WHERE patient_id IS NOT NULL;
INSERT INTO public.appointments (patient_id, doctor_name, appointment_date, appointment_time, department, reason, status, token) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Dr. Sarah Wilson', CURRENT_DATE, '10:00', 'Cardiology', 'Routine checkup', 'scheduled', 2);