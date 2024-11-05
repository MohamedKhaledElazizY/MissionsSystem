export const API_BASE_URL = 'https://192.168.1.252:8080/api';
export const SOCKET_URL = 'https://192.168.1.252:8080/NotificationHub';
export const TOAST_LIFETIME = 5000;
export const LOGIN_FAIL_WAIT_PERIOD = 5000;
export const Ranks = [
    'جندى',
    'طالب',
    'عريف',
    'رقيب',
    'رقيب أول',
    'مساعد ',
    'مساعد أول',
    'ملازم ',
    'ملازم أول',
    'مساعد أول',
    'نقيب',
    'نقيب أح',
    'رائد',
    'رائد أح',
    'مقدم',
    'مقدم أح',
    'عقيد',
    'عقيد أح',
    'عميد',
    'عميد أح',
    'لواء',
    'لواء أح',
    'فريق ',
    'فريق أح',
    'فريق اول',
    'فريق اول أح',
    'مشير'
];

export const stateTypes = [
    { name: 'مأمورية مؤجلة', key: 'مأمورية مؤجلة', color: { r: 139, g: 0, b: 0 } },
    { name: 'مأمورية منتهية', key: 'مأمورية منتهية', color: { r: 46, g: 139, b: 87 } },
    { name: 'مأمورية جارية', key: 'مأمورية جارية', color: { r: 255, g: 255, b: 255 } }
];

export const auths = [
    { label: 'إضافة مأمورية', key: 'addMission' },
    { label: 'تعديل مأمورية', key: 'editMission' },
    { label: 'حذف مأمورية', key: 'deleteMission' },
    { label: 'طلب عرض شخصي', key: 'personalReview' },
    { label: 'تكويد الافراد', key: 'addMember' },
    { label: 'إضافة مستخدم جديد', key: 'addNewUser' },
    { label: 'تعيين كلمة مرور جديدة', key: 'resetPassword' },
    { label: 'اضافة صلاحيات لمستخدم', key: 'addAuths' },
    { label: 'فتح تاريخ الاستخدام', key: 'openHistory' },
    { label: 'تعيين مشرف عام', key: 'setAdmin' },
    { label: 'فتح الإعدادت', key: 'openSettings' }
];
