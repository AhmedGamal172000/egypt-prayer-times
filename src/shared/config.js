/**
 * Central configuration for the Prayer Times extension.
 * All configurable values live here — never hardcoded elsewhere.
 */

/** @type {string} */
export const EXTENSION_VERSION = '1.0.0';

/** API Configuration */
export const API_CONFIG = {
  ALADHAN_BASE_URL: 'https://api.aladhan.com/v1',
  DEFAULT_TIMEOUT_MS: 10000,
  CACHE_TTL_HOURS: 24
};

/** Calculation methods mapping for Aladhan API */
export const CALCULATION_METHODS = {
  EGYPTIAN_GENERAL_AUTHORITY: { id: 5, name: 'Egyptian General Authority of Survey' },
  MUSLIM_WORLD_LEAGUE: { id: 1, name: 'Muslim World League' },
  ISNA: { id: 2, name: 'Islamic Society of North America' },
  MAKKAH: { id: 4, name: 'Umm Al-Qura University, Makkah' },
  KARACHI: { id: 1, name: 'University of Islamic Sciences, Karachi' } // fallback
};

/** Default calculation method */
export const DEFAULT_METHOD = CALCULATION_METHODS.EGYPTIAN_GENERAL_AUTHORITY.id;

/** Time format preferences */
export const TIME_FORMAT = {
  H12: '12h',
  H24: '24h'
};

/** Supported languages */
export const LANGUAGE = {
  EN: 'en',
  AR: 'ar'
};

/** Data source status indicators */
export const DATA_SOURCE = {
  LIVE: 'live',
  CACHED: 'cached',
  CALCULATED: 'calculated'
};

/** Countries and cities for prayer time lookup */
export const COUNTRIES = [
  {
    name: 'Egypt',
    nameAr: 'مصر',
    cities: [
      { name: 'Cairo', nameAr: 'القاهرة' },
      { name: 'Alexandria', nameAr: 'الإسكندرية' },
      { name: 'Giza', nameAr: 'الجيزة' },
      { name: 'Shubra El-Kheima', nameAr: 'شبرا الخيمة' },
      { name: 'Port Said', nameAr: 'بورسعيد' },
      { name: 'Suez', nameAr: 'السويس' },
      { name: 'Luxor', nameAr: 'الأقصر' },
      { name: 'Al-Mansura', nameAr: 'المنصورة' },
      { name: 'El-Mahalla El-Kubra', nameAr: 'المحلة الكبرى' },
      { name: 'Tanta', nameAr: 'طنطا' },
      { name: 'Asyut', nameAr: 'أسيوط' },
      { name: 'Ismailia', nameAr: 'الإسماعيلية' },
      { name: 'Fayyum', nameAr: 'الفيوم' },
      { name: 'Zagazig', nameAr: 'الزقازيق' },
      { name: 'Aswan', nameAr: 'أسوان' },
      { name: 'Damietta', nameAr: 'دمياط' },
      { name: 'Minya', nameAr: 'المنيا' },
      { name: 'Beni Suef', nameAr: 'بني سويف' },
      { name: 'Qena', nameAr: 'قنا' },
      { name: 'Sohag', nameAr: 'سوهاج' },
      { name: 'Hurghada', nameAr: 'الغردقة' },
      { name: 'Sharm El-Sheikh', nameAr: 'شرم الشيخ' }
    ]
  },
  {
    name: 'Saudi Arabia',
    nameAr: 'السعودية',
    cities: [
      { name: 'Riyadh', nameAr: 'الرياض' },
      { name: 'Jeddah', nameAr: 'جدة' },
      { name: 'Mecca', nameAr: 'مكة' },
      { name: 'Medina', nameAr: 'المدينة' },
      { name: 'Dammam', nameAr: 'الدمام' },
      { name: 'Tabuk', nameAr: 'تبوك' },
      { name: 'Taif', nameAr: 'الطائف' },
      { name: 'Buraidah', nameAr: 'بريدة' },
      { name: 'Abha', nameAr: 'أبها' },
      { name: 'Khobar', nameAr: 'الخبر' }
    ]
  },
  {
    name: 'United Arab Emirates',
    nameAr: 'الإمارات',
    cities: [
      { name: 'Dubai', nameAr: 'دبي' },
      { name: 'Abu Dhabi', nameAr: 'أبوظبي' },
      { name: 'Sharjah', nameAr: 'الشارقة' },
      { name: 'Ajman', nameAr: 'عجمان' },
      { name: 'Ras Al Khaimah', nameAr: 'رأس الخيمة' },
      { name: 'Fujairah', nameAr: 'الفجيرة' }
    ]
  },
  {
    name: 'Kuwait',
    nameAr: 'الكويت',
    cities: [
      { name: 'Kuwait City', nameAr: 'مدينة الكويت' },
      { name: 'Hawalli', nameAr: 'حولي' },
      { name: 'Salmiya', nameAr: 'السالمية' },
      { name: 'Jahra', nameAr: 'الجهراء' }
    ]
  },
  {
    name: 'Qatar',
    nameAr: 'قطر',
    cities: [
      { name: 'Doha', nameAr: 'الدوحة' },
      { name: 'Al Wakrah', nameAr: 'الوكرة' },
      { name: 'Al Khor', nameAr: 'الخور' }
    ]
  },
  {
    name: 'Bahrain',
    nameAr: 'البحرين',
    cities: [
      { name: 'Manama', nameAr: 'المنامة' },
      { name: 'Riffa', nameAr: 'الرفاع' },
      { name: 'Muharraq', nameAr: 'المحرق' }
    ]
  },
  {
    name: 'Oman',
    nameAr: 'عمان',
    cities: [
      { name: 'Muscat', nameAr: 'مسقط' },
      { name: 'Salalah', nameAr: 'صلالة' },
      { name: 'Sohar', nameAr: 'صحار' },
      { name: 'Nizwa', nameAr: 'نزوى' }
    ]
  },
  {
    name: 'Jordan',
    nameAr: 'الأردن',
    cities: [
      { name: 'Amman', nameAr: 'عمان' },
      { name: 'Zarqa', nameAr: 'الزرقاء' },
      { name: 'Irbid', nameAr: 'إربد' },
      { name: 'Aqaba', nameAr: 'العقبة' },
      { name: 'Salt', nameAr: 'السلط' }
    ]
  },
  {
    name: 'Lebanon',
    nameAr: 'لبنان',
    cities: [
      { name: 'Beirut', nameAr: 'بيروت' },
      { name: 'Tripoli', nameAr: 'طرابلس' },
      { name: 'Sidon', nameAr: 'صيدا' },
      { name: 'Tyre', nameAr: 'صور' }
    ]
  },
  {
    name: 'Syria',
    nameAr: 'سوريا',
    cities: [
      { name: 'Damascus', nameAr: 'دمشق' },
      { name: 'Aleppo', nameAr: 'حلب' },
      { name: 'Homs', nameAr: 'حمص' },
      { name: 'Latakia', nameAr: 'اللاذقية' }
    ]
  },
  {
    name: 'Iraq',
    nameAr: 'العراق',
    cities: [
      { name: 'Baghdad', nameAr: 'بغداد' },
      { name: 'Basra', nameAr: 'البصرة' },
      { name: 'Mosul', nameAr: 'الموصل' },
      { name: 'Erbil', nameAr: 'أربيل' },
      { name: 'Najaf', nameAr: 'النجف' },
      { name: 'Karbala', nameAr: 'كربلاء' }
    ]
  },
  {
    name: 'Palestine',
    nameAr: 'فلسطين',
    cities: [
      { name: 'Gaza', nameAr: 'غزة' },
      { name: 'Jerusalem', nameAr: 'القدس' },
      { name: 'Hebron', nameAr: 'الخليل' },
      { name: 'Nablus', nameAr: 'نابلس' },
      { name: 'Ramallah', nameAr: 'رام الله' }
    ]
  },
  {
    name: 'Yemen',
    nameAr: 'اليمن',
    cities: [
      { name: 'Sanaa', nameAr: 'صنعاء' },
      { name: 'Aden', nameAr: 'عدن' },
      { name: 'Taiz', nameAr: 'تعز' },
      { name: 'Hodeidah', nameAr: 'الحديدة' }
    ]
  },
  {
    name: 'Libya',
    nameAr: 'ليبيا',
    cities: [
      { name: 'Tripoli', nameAr: 'طرابلس' },
      { name: 'Benghazi', nameAr: 'بنغازي' },
      { name: 'Misrata', nameAr: 'مصراتة' },
      { name: 'Bayda', nameAr: 'البيضاء' }
    ]
  },
  {
    name: 'Tunisia',
    nameAr: 'تونس',
    cities: [
      { name: 'Tunis', nameAr: 'تونس' },
      { name: 'Sfax', nameAr: 'صفاقس' },
      { name: 'Sousse', nameAr: 'سوسة' },
      { name: 'Kairouan', nameAr: 'القيروان' }
    ]
  },
  {
    name: 'Algeria',
    nameAr: 'الجزائر',
    cities: [
      { name: 'Algiers', nameAr: 'الجزائر' },
      { name: 'Oran', nameAr: 'وهران' },
      { name: 'Constantine', nameAr: 'قسنطينة' },
      { name: 'Annaba', nameAr: 'عنابة' }
    ]
  },
  {
    name: 'Morocco',
    nameAr: 'المغرب',
    cities: [
      { name: 'Casablanca', nameAr: 'الدار البيضاء' },
      { name: 'Rabat', nameAr: 'الرباط' },
      { name: 'Marrakesh', nameAr: 'مراكش' },
      { name: 'Fez', nameAr: 'فاس' },
      { name: 'Tangier', nameAr: 'طنجة' },
      { name: 'Agadir', nameAr: 'أغادير' }
    ]
  },
  {
    name: 'Sudan',
    nameAr: 'السودان',
    cities: [
      { name: 'Khartoum', nameAr: 'الخرطوم' },
      { name: 'Omdurman', nameAr: 'أم درمان' },
      { name: 'Port Sudan', nameAr: 'بور سودان' }
    ]
  },
  {
    name: 'Turkey',
    nameAr: 'تركيا',
    cities: [
      { name: 'Istanbul', nameAr: 'إسطنبول' },
      { name: 'Ankara', nameAr: 'أنقرة' },
      { name: 'Izmir', nameAr: 'إزمير' },
      { name: 'Bursa', nameAr: 'بورصة' },
      { name: 'Antalya', nameAr: 'أنطاليا' },
      { name: 'Konya', nameAr: 'قونية' }
    ]
  },
  {
    name: 'Iran',
    nameAr: 'إيران',
    cities: [
      { name: 'Tehran', nameAr: 'طهران' },
      { name: 'Mashhad', nameAr: 'مشهد' },
      { name: 'Isfahan', nameAr: 'أصفهان' },
      { name: 'Shiraz', nameAr: 'شيراز' },
      { name: 'Tabriz', nameAr: 'تبريز' }
    ]
  },
  {
    name: 'Pakistan',
    nameAr: 'باكستان',
    cities: [
      { name: 'Karachi', nameAr: 'كراتشي' },
      { name: 'Lahore', nameAr: 'لاهور' },
      { name: 'Islamabad', nameAr: 'إسلام آباد' },
      { name: 'Faisalabad', nameAr: 'فيصل آباد' },
      { name: 'Rawalpindi', nameAr: 'راولبندي' },
      { name: 'Peshawar', nameAr: 'بيشاور' }
    ]
  },
  {
    name: 'Bangladesh',
    nameAr: 'بنغلاديش',
    cities: [
      { name: 'Dhaka', nameAr: 'داكا' },
      { name: 'Chittagong', nameAr: 'شيتاغونغ' },
      { name: 'Khulna', nameAr: 'خولنا' },
      { name: 'Rajshahi', nameAr: 'راجشاهي' }
    ]
  },
  {
    name: 'Afghanistan',
    nameAr: 'أفغانستان',
    cities: [
      { name: 'Kabul', nameAr: 'كابل' },
      { name: 'Herat', nameAr: 'هرات' },
      { name: 'Kandahar', nameAr: 'قندهار' },
      { name: 'Mazar-i-Sharif', nameAr: 'مزار شريف' }
    ]
  },
  {
    name: 'India',
    nameAr: 'الهند',
    cities: [
      { name: 'Mumbai', nameAr: 'مومباي' },
      { name: 'Delhi', nameAr: 'دلهي' },
      { name: 'Hyderabad', nameAr: 'حيدر آباد' },
      { name: 'Chennai', nameAr: 'تشيناي' },
      { name: 'Bangalore', nameAr: 'بنغالور' },
      { name: 'Kolkata', nameAr: 'كولكاتا' },
      { name: 'Ahmedabad', nameAr: 'أحمد آباد' },
      { name: 'Lucknow', nameAr: 'لكنو' }
    ]
  },
  {
    name: 'Malaysia',
    nameAr: 'ماليزيا',
    cities: [
      { name: 'Kuala Lumpur', nameAr: 'كوالالمبور' },
      { name: 'George Town', nameAr: 'جورج تاون' },
      { name: 'Johor Bahru', nameAr: 'جوهور باهرو' },
      { name: 'Kota Kinabalu', nameAr: 'كوتا كينابالو' }
    ]
  },
  {
    name: 'Indonesia',
    nameAr: 'إندونيسيا',
    cities: [
      { name: 'Jakarta', nameAr: 'جاكرتا' },
      { name: 'Surabaya', nameAr: 'سورابايا' },
      { name: 'Bandung', nameAr: 'باندونغ' },
      { name: 'Medan', nameAr: 'مدان' },
      { name: 'Makassar', nameAr: 'ماكاسار' }
    ]
  },
  {
    name: 'Brunei',
    nameAr: 'بروناي',
    cities: [
      { name: 'Bandar Seri Begawan', nameAr: 'بندر سري بكاوان' }
    ]
  },
  {
    name: 'Nigeria',
    nameAr: 'نيجيريا',
    cities: [
      { name: 'Lagos', nameAr: 'لاغوس' },
      { name: 'Kano', nameAr: 'كانو' },
      { name: 'Ibadan', nameAr: 'إبادان' },
      { name: 'Abuja', nameAr: 'أبوجا' }
    ]
  },
  {
    name: 'Somalia',
    nameAr: 'الصومال',
    cities: [
      { name: 'Mogadishu', nameAr: 'مقديشو' },
      { name: 'Hargeisa', nameAr: 'هرجيسا' },
      { name: 'Kismayo', nameAr: 'كيسمايو' }
    ]
  },
  {
    name: 'Ethiopia',
    nameAr: 'إثيوبيا',
    cities: [
      { name: 'Addis Ababa', nameAr: 'أديس أبابا' },
      { name: 'Dire Dawa', nameAr: 'دير داوا' }
    ]
  },
  {
    name: 'United Kingdom',
    nameAr: 'المملكة المتحدة',
    cities: [
      { name: 'London', nameAr: 'لندن' },
      { name: 'Birmingham', nameAr: 'برمنغهام' },
      { name: 'Manchester', nameAr: 'مانشستر' },
      { name: 'Glasgow', nameAr: 'غلاسكو' },
      { name: 'Bradford', nameAr: 'برادفورد' },
      { name: 'Leeds', nameAr: 'ليدز' }
    ]
  },
  {
    name: 'United States',
    nameAr: 'الولايات المتحدة',
    cities: [
      { name: 'New York', nameAr: 'نيويورك' },
      { name: 'Los Angeles', nameAr: 'لوس أنجلوس' },
      { name: 'Chicago', nameAr: 'شيكاغو' },
      { name: 'Houston', nameAr: 'هيوستن' },
      { name: 'Philadelphia', nameAr: 'فيلادلفيا' },
      { name: 'Detroit', nameAr: 'ديترويت' },
      { name: 'Dallas', nameAr: 'دالاس' },
      { name: 'San Francisco', nameAr: 'سان فرانسيسكو' }
    ]
  },
  {
    name: 'Canada',
    nameAr: 'كندا',
    cities: [
      { name: 'Toronto', nameAr: 'تورنتو' },
      { name: 'Montreal', nameAr: 'مونتريال' },
      { name: 'Vancouver', nameAr: 'فانكوفر' },
      { name: 'Ottawa', nameAr: 'أوتاوا' },
      { name: 'Calgary', nameAr: 'كالغاري' }
    ]
  },
  {
    name: 'France',
    nameAr: 'فرنسا',
    cities: [
      { name: 'Paris', nameAr: 'باريس' },
      { name: 'Marseille', nameAr: 'مارسيليا' },
      { name: 'Lyon', nameAr: 'ليون' },
      { name: 'Toulouse', nameAr: 'تولوز' },
      { name: 'Nice', nameAr: 'نيس' }
    ]
  },
  {
    name: 'Germany',
    nameAr: 'ألمانيا',
    cities: [
      { name: 'Berlin', nameAr: 'برلين' },
      { name: 'Hamburg', nameAr: 'هامبورغ' },
      { name: 'Munich', nameAr: 'ميونخ' },
      { name: 'Cologne', nameAr: 'كولونيا' },
      { name: 'Frankfurt', nameAr: 'فرانكفورت' }
    ]
  },
  {
    name: 'Australia',
    nameAr: 'أستراليا',
    cities: [
      { name: 'Sydney', nameAr: 'سيدني' },
      { name: 'Melbourne', nameAr: 'ملبورن' },
      { name: 'Brisbane', nameAr: 'بريزبان' },
      { name: 'Perth', nameAr: 'برث' },
      { name: 'Adelaide', nameAr: 'أديلايد' }
    ]
  },
  {
    name: 'Russia',
    nameAr: 'روسيا',
    cities: [
      { name: 'Moscow', nameAr: 'موسكو' },
      { name: 'Saint Petersburg', nameAr: 'سانت بطرسبرغ' },
      { name: 'Kazan', nameAr: 'قازان' },
      { name: 'Ufa', nameAr: 'أوفا' }
    ]
  },
  {
    name: 'China',
    nameAr: 'الصين',
    cities: [
      { name: 'Beijing', nameAr: 'بكين' },
      { name: 'Shanghai', nameAr: 'شنغهاي' },
      { name: 'Guangzhou', nameAr: 'قوانغتشو' },
      { name: 'Shenzhen', nameAr: 'شنتشن' },
      { name: 'Urumqi', nameAr: 'أورومتشي' }
    ]
  }
];

/** Default user settings */
export const DEFAULT_SETTINGS = {
  city: 'Cairo',
  country: 'Egypt',
  method: DEFAULT_METHOD,
  timeFormat: TIME_FORMAT.H12,
  language: LANGUAGE.EN,
  provider: 'aladhan'
};

/** Alarm constants */
export const ALARMS = {
  DAILY_SYNC: 'daily-sync',
  MINUTE_TICK: 'minute-tick',
  HOURLY_REFRESH: 'hourly-refresh',
  SYNC_HOUR: 3,
  SYNC_MINUTE: 0
};

/** Prayer names in order */
export const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
