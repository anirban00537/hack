export const userRoles = [
  'superAdmin',
  'admin',
  'portalModerator',
  'schoolManager',
  'moderator',
  'schoolTeacher',
  'mentor',
  'student',
  'employee',
];

export enum UserRole {
  superAdmin = 'superAdmin',
  admin = 'admin',
  portalModerator = 'portalModerator',
  schoolManager = 'schoolManager',
  moderator = 'moderator',
  schoolTeacher = 'schoolTeacher',
  mentor = 'mentor',
  student = 'student',
  employee = 'employee',
}

export const status = ['restrict', 'inactive', 'approved', 'rejected', 'active'];

export enum Status {
  active = 'active',
  inactive = 'inactive',
  approved = 'approved',
  rejected = 'rejected',
  restrict = 'restrict'
}
