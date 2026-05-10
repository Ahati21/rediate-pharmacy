export function resolveMedicineStatus({ stock, expiryDate, status }) {
  const resolvedExpiryDate = expiryDate ? new Date(expiryDate) : null;

  if (resolvedExpiryDate && !Number.isNaN(resolvedExpiryDate.getTime())) {
    const daysUntilExpiry = Math.ceil((resolvedExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 90) {
      return 'Expiring';
    }
  }

  if (typeof stock === 'number' && stock <= 15) {
    return 'Low Stock';
  }

  return status || 'Approved';
}
