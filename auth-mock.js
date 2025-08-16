// Mock auth module for testing
export async function checkAuthState(action) {
  console.log('Mock checkAuthState called with:', action);
  
  if (action === 'check') {
    // Return null user for testing (not authenticated)
    return null;
  }
  
  if (action === 'logout') {
    console.log('Mock logout');
    return;
  }
  
  return null;
}