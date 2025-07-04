
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usernameService } from '@/services/usernameService';

export type UserRole = 'admin' | 'doctor' | 'staff' | 'patient';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  username?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (profileData) {
              setProfile(profileData as Profile);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Fetch user profile
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) {
              setProfile(profileData as Profile);
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (usernameOrEmail: string, password: string) => {
    try {
      let email = usernameOrEmail;

      // Check if input looks like username (no @ symbol)
      if (!usernameOrEmail.includes('@')) {
        const emailFromUsername = await usernameService.getEmailByUsername(usernameOrEmail);
        if (!emailFromUsername) {
          toast({
            title: "❌ Sign In Failed",
            description: "Username not found",
            variant: "destructive",
          });
          return { error: { message: "Username not found" } };
        }
        email = emailFromUsername;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "❌ Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "✅ Success",
        description: "Welcome to Ayuu Healthcare System!",
      });

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "❌ Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole = 'patient', username?: string) => {
    try {
      // Check username availability if provided
      if (username) {
        const isAvailable = await usernameService.checkAvailability(username);
        if (!isAvailable) {
          toast({
            title: "❌ Sign Up Failed",
            description: "Username is already taken",
            variant: "destructive",
          });
          return { error: { message: "Username is already taken" } };
        }
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            role: role,
            username: username
          }
        }
      });

      if (error) {
        toast({
          title: "❌ Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "✅ Success",
        description: "Account created successfully! Please check your email for verification.",
      });

      return { data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "❌ Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "✅ Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    return await usernameService.checkAvailability(username);
  };

  return {
    user,
    session,
    profile,
    loading,
    isSignedIn: !!user,
    userRole: profile?.role || 'patient',
    signIn,
    signUp,
    signOut,
    checkUsernameAvailability,
  };
};
