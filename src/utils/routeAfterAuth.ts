
export const routeAfterAuth = async (navigate: (path: string) => void, currentPath: string) => {
  try {
    // TEMPORARILY DISABLED - Allow access to all pages without authentication
    console.log('Authentication temporarily disabled - allowing access to all pages');
    return;
    
    // Original authentication logic (commented out)
    /*
    // Wait for session to be determined
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session exists
    if (!session) {
      // Only redirect to auth if not already on auth or landing pages
      if (currentPath !== '/auth' && currentPath !== '/landing') {
        navigate('/auth');
      }
      return;
    }
    
    // If session exists, check onboarding status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('onboarded')
      .eq('id', session.user.id)
      .single();
    
    if (error || !profile || profile.onboarded === false) {
      // User needs onboarding
      if (currentPath !== '/onboarding') {
        navigate('/onboarding');
      }
    } else {
      // User is onboarded
      if (currentPath === '/auth' || currentPath === '/landing' || currentPath === '/onboarding') {
        navigate('/home');
      }
    }
    */
  } catch (error) {
    console.error('Error in routeAfterAuth:', error);
    // Temporarily allow access even on error
    return;
  }
};
