// Helper function to get dashboard URL with or without sellerId
export const getDashboardUrl = (sellerId?: string) => {
  return sellerId ? `/seller/${sellerId}/dashboard` : '/seller/dashboard';
};
