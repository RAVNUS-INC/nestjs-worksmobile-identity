export const Endpoint = {
  AUTH: 'https://auth.worksmobile.com/oauth2/v2.0/token',
  BASE: 'https://www.worksapis.com/v1.0',
} as const;

// https://www.worksapis.com/v1.0/business-support/attendance/users/{userId}/clock-in
export const generateBusinessSupportAttendanceUsersClockIn = (
  userId: string,
): string =>
  `${Endpoint.BASE}/business-support/attendance/users/${userId}/clock-in`;

// https://www.worksapis.com/v1.0/business-support/attendance/users/{userId}/clock-out
export const generateBusinessSupportAttendanceUsersClockOut = (
  userId: string,
): string =>
  `${Endpoint.BASE}/business-support/attendance/users/${userId}/clock-out`;

// https://www.worksapis.com/v1.0/bots/{botId}/users/{userId}/messages
export const generateBotsUsersMessages = (
  botId: string,
  userId: string,
): string => `${Endpoint.BASE}/bots/${botId}/users/${userId}/messages`;
