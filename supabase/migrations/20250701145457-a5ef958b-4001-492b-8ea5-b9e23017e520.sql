-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  experience TEXT,
  availability TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time slots table
CREATE TABLE public.time_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slot_time TEXT NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table (separate from profiles for better role management)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role_name TEXT NOT NULL,
  permissions TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role_name)
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors
CREATE POLICY "Doctors are viewable by everyone" 
ON public.doctors 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage doctors" 
ON public.doctors 
FOR ALL 
USING (true);

-- Create policies for time slots
CREATE POLICY "Time slots are viewable by everyone" 
ON public.time_slots 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage time slots" 
ON public.time_slots 
FOR ALL 
USING (true);

-- Create policies for user roles
CREATE POLICY "User roles are viewable by everyone" 
ON public.user_roles 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_slots_updated_at
BEFORE UPDATE ON public.time_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors data
INSERT INTO public.doctors (name, specialty, experience, availability) VALUES
('Dr. Anil Sharma', 'General Medicine', '15 years', '9:00 AM - 1:00 PM'),
('Dr. Meera Patel', 'Cardiology', '12 years', '2:00 PM - 6:00 PM'),
('Dr. Rajesh Kumar', 'Orthopedics', '18 years', '10:00 AM - 2:00 PM'),
('Dr. Sunita Reddy', 'Pediatrics', '10 years', '9:00 AM - 5:00 PM');

-- Insert sample time slots
INSERT INTO public.time_slots (slot_time) VALUES
('9:00 AM'), ('9:30 AM'), ('10:00 AM'), ('10:30 AM'), ('11:00 AM'), ('11:30 AM'),
('12:00 PM'), ('2:00 PM'), ('2:30 PM'), ('3:00 PM'), ('3:30 PM'), ('4:00 PM'),
('4:30 PM'), ('5:00 PM'), ('5:30 PM');

-- Insert admin role for test user
INSERT INTO public.user_roles (user_id, role_name, permissions) 
SELECT id, 'admin', ARRAY['all_permissions']
FROM auth.users 
WHERE email = 'admin@ayuu.com';