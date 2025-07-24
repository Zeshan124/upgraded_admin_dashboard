
// services/notificationService.js
export async function sendNotification(notification) {
  const response = await fetch('/api/sendNotification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });

  const responseData = await response.json();
  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong!');
  }

  return responseData;
}
