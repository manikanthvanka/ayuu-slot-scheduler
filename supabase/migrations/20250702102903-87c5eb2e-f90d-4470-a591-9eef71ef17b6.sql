-- Create unique test users
INSERT INTO public.users (id, first_name, last_name, gender, date_of_birth) VALUES
('00000000-0000-0000-0000-000000000001', 'Test', 'Admin', 'Male', '1980-01-01'),
('00000000-0000-0000-0000-000000000002', 'Test', 'Doctor', 'Female', '1975-05-15'),
('00000000-0000-0000-0000-000000000003', 'Test', 'Staff', 'Male', '1985-10-20'),
('00000000-0000-0000-0000-000000000004', 'Test', 'Patient', 'Female', '1990-03-25')
ON CONFLICT (id) DO NOTHING;

-- Create user roles
INSERT INTO public.user_roles (user_id, role) VALUES
('00000000-0000-0000-0000-000000000001', 'admin'),
('00000000-0000-0000-0000-000000000002', 'doctor'),
('00000000-0000-0000-0000-000000000003', 'staff'),
('00000000-0000-0000-0000-000000000004', 'patient')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create user communication
INSERT INTO public.user_communication (user_id, email, phone, address) VALUES
('00000000-0000-0000-0000-000000000001', 'testadmin@ayuu.com', '+1111111111', '100 Test Admin St'),
('00000000-0000-0000-0000-000000000002', 'testdoctor@ayuu.com', '+2222222222', '200 Test Doctor Ave'),
('00000000-0000-0000-0000-000000000003', 'teststaff@ayuu.com', '+3333333333', '300 Test Staff Rd'),
('00000000-0000-0000-0000-000000000004', 'testpatient@ayuu.com', '+4444444444', '400 Test Patient Blvd')
ON CONFLICT (user_id) DO NOTHING;

-- Create doctor profile
INSERT INTO public.doctor_profiles (user_id, specialty, experience, availability, license_number) VALUES
('00000000-0000-0000-0000-000000000002', 'Cardiology', '15 years', '8 AM - 6 PM', 'TEST123456')
ON CONFLICT (user_id) DO NOTHING;

-- Create patient profile
INSERT INTO public.patient_profiles (user_id, mr_number, blood_group, status) VALUES
('00000000-0000-0000-0000-000000000004', 'MRTEST001', 'B+', 'registered')
ON CONFLICT (user_id) DO NOTHING;