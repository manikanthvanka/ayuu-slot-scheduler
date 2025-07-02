-- Create test users for each role
INSERT INTO public.users (id, first_name, last_name, gender, date_of_birth) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin', 'User', 'Male', '1980-01-01'),
('22222222-2222-2222-2222-222222222222', 'Doctor', 'Smith', 'Female', '1975-05-15'),
('33333333-3333-3333-3333-333333333333', 'Staff', 'Johnson', 'Male', '1985-10-20'),
('44444444-4444-4444-4444-444444444444', 'Patient', 'Brown', 'Female', '1990-03-25');

-- Create user roles
INSERT INTO public.user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin'),
('22222222-2222-2222-2222-222222222222', 'doctor'),
('33333333-3333-3333-3333-333333333333', 'staff'),
('44444444-4444-4444-4444-444444444444', 'patient');

-- Create user communication
INSERT INTO public.user_communication (user_id, email, phone, address) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@ayuu.com', '+1234567890', '123 Admin St'),
('22222222-2222-2222-2222-222222222222', 'doctor@ayuu.com', '+1234567891', '456 Doctor Ave'),
('33333333-3333-3333-3333-333333333333', 'staff@ayuu.com', '+1234567892', '789 Staff Rd'),
('44444444-4444-4444-4444-444444444444', 'patient@ayuu.com', '+1234567893', '321 Patient Blvd');

-- Create doctor profile
INSERT INTO public.doctor_profiles (user_id, specialty, experience, availability, license_number) VALUES
('22222222-2222-2222-2222-222222222222', 'General Medicine', '10 years', '9 AM - 5 PM', 'MD123456');

-- Create patient profile
INSERT INTO public.patient_profiles (user_id, mr_number, blood_group, status) VALUES
('44444444-4444-4444-4444-444444444444', 'MR001', 'O+', 'registered');