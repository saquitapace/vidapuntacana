export const CalendarViewTypes = {
  DAY_VIEW: 'DAY_VIEW',
  WEEK_VIEW: 'WEEK_VIEW',
  MONTH_VIEW: 'MONTH_VIEW',
  YEAR_VIEW: 'YEAR_VIEW',
};

export const EventTypes = {
  SINGLE_DAY: 'SINGLE_DAY',
  MULTI_DAY: 'MULTI_DAY',
  RECURRING: 'RECURRING',
};

export const EventStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
};

export const UserRoles = {
  ADMIN: 'ADMIN',
  BUSINESS: 'BUSINESS',
  CUSTOMER: 'CUSTOMER',
};

export const ThemeColorTypes = {
  RED: 0,
  GREEN: 1,
  GOLD: 2,
  BLUE: 3,
  CYAN: 4,
  PURPLE: 5,
  BROWN: 6,
};

export const EventRepeatTypes = {
  DAILY: 0,
  WEEKLY: 1,
  BI_WEEKLY: 2,
  MONTHLY: 3,
  WEEK_DAYS: 4,
};

export const EventInviteStatusTypes = {
  PENDING: 0,
  ACCEPTED: 1,
  DECLINED: 2,
};

export const RepeatChangesTypes = {
  CHANGE: 'change',
  DELETE: 'delete',
};

export const MINUTE_SEGMENT_INDEX = {
  0: 0,
  15: 1,
  30: 2,
  45: 3,
};

export const MINUTE_SEGMENT_KEYS = Object.keys(MINUTE_SEGMENT_INDEX);
