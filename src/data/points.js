export const points = [
  // === LUNG ===
  { id: "LU1", meridian: "lu", code: "LU1", nameHe: "ריאות 1", nameCn: "Zhong Fu", location: "מתחת לעצם הבריח, 6 cun מהקו האמצעי", function: ["Front-Mu של הריאות", "מוריד ומפזר צ'י ריאות", "מטפל בשיעול וקוצר נשימה"], indications: ["שיעול", "קוצר נשימה", "כאב בחזה"], category: "Front-Mu" },
  { id: "LU7", meridian: "lu", code: "LU7", nameHe: "ריאות 7", nameCn: "Lie Que", location: "1.5 cun מעל קו פרק כף יד, צד עצם הרדיוס", function: ["Luo-Connecting point", "פותח ומשחרר את הריאות", "מחזק הצ'י המולד", "Master point של Ren Mai"], indications: ["שיעול", "כאב ראש", "כאב צוואר", "חולשת ריאות"], category: "Luo / Master" },
  { id: "LU9", meridian: "lu", code: "LU9", nameHe: "ריאות 9", nameCn: "Tai Yuan", location: "פרק כף יד, בבסיס האגודל בצד הרדיאלי", function: ["Source point (Yuan)", "מחזק צ'י ויין הריאות", "מחזק את כל הצ'י בגוף", "Influential point לכלי הדם"], indications: ["חסר צ'י/יין בריאות", "שיעול כרוני", "דפיקות לב"], category: "Yuan / Influential" },
  { id: "LU5", meridian: "lu", code: "LU5", nameHe: "ריאות 5", nameCn: "Chi Ze", location: "בקיפול המרפק, בצד הרדיאלי של ה-biceps", function: ["He-Sea point", "מנקה חום בריאות", "מוריד צ'י מורד"], indications: ["שיעול עם ליחה צהובה", "חום בריאות"], category: "He-Sea" },
  { id: "LU6", meridian: "lu", code: "LU6", nameHe: "ריאות 6", nameCn: "Kong Zui", location: "5 cun מעל קו פרק כף יד, על עצם הרדיוס", function: ["Xi-Cleft point", "מטפל בתסמינים חריפים של ריאות", "עוצר דמם", "משכך כאבי גרון חריפים"], indications: ["שיעול דם", "כאב גרון חריף", "שיעול חריף", "אסתמה חריפה"], category: "Xi-Cleft" },

  // === LARGE INTESTINE ===
  { id: "LI4", meridian: "li", code: "LI4", nameHe: "מעי גס 4", nameCn: "He Gu", location: "בין עצמות metacarpal 1 ו-2, בגב היד", function: ["Source point – אחת הנקודות החשובות ביותר", "מפזר רוח ופתוגנים חיצוניים", "משכך כאבים כלליים", "מחזק את ה-Wei Qi"], indications: ["כאב ראש", "שיניים", "פנים", "חום", "עצירות", "כאב כללי"], category: "Yuan / Command" },
  { id: "LI15", meridian: "li", code: "LI15", nameHe: "מעי גס 15", nameCn: "Jian Yu", location: "בגומה הקדמית של הכתף בעת הרמת הזרוע", function: ["נקודה מקומית לכתף", "מנקה רוח-חום", "מרפה שרירי הכתף והזרוע"], indications: ["כאב כתף", "הגבלת תנועה בכתף", "שיתוק חלקי בזרוע"], category: "Local" },
  { id: "LI10", meridian: "li", code: "LI10", nameHe: "מעי גס 10", nameCn: "Shou San Li", location: "2 cun מתחת למרפק, על קו LI11", function: ["מחזק צ'י ודם", "משכך כאבי ידיים וכתפיים", "מסייע לעיכול"], indications: ["חולשה כללית", "כאבי ידיים", "בעיות עיכול"], category: "General" },
  { id: "LI11", meridian: "li", code: "LI11", nameHe: "מעי גס 11", nameCn: "Qu Chi", location: "בקצה החיצוני של קיפול המרפק", function: ["He-Sea point", "מנקה חום ורוח", "מוריד חום", "מנקה עור"], indications: ["חום", "אלרגיות", "פריחות עור", "עצירות", "כאב מרפק"], category: "He-Sea" },
  { id: "LI20", meridian: "li", code: "LI20", nameHe: "מעי גס 20", nameCn: "Ying Xiang", location: "ליד הנחיר", function: ["פותח את האף", "מנקה רוח-חום"], indications: ["גודש באף", "אובדן ריח"], category: "Local" },

  // === STOMACH ===
  { id: "ST25", meridian: "st", code: "ST25", nameHe: "קיבה 25", nameCn: "Tian Shu", location: "2 cun לצד הטבור", function: ["Front-Mu של המעי הגס", "מווסת מעיים", "מטפל בשלשול ועצירות"], indications: ["שלשול", "עצירות", "כאבי בטן", "IBS"], category: "Front-Mu" },
  { id: "ST36", meridian: "st", code: "ST36", nameHe: "קיבה 36", nameCn: "Zu San Li", location: "3 cun מתחת לברך, 1 cun החוצה מ-shin bone", function: ["He-Sea point – 'הנקודה החשובה ביותר'", "מחזק צ'י ודם ויאנג", "מחזק טחול-קיבה", "מגביר חסינות", "משכך כאבים"], indications: ["עייפות כרונית", "חולשה", "בעיות עיכול", "חיזוק כללי"], category: "He-Sea / Sea of Nourishment" },
  { id: "ST40", meridian: "st", code: "ST40", nameHe: "קיבה 40", nameCn: "Feng Long", location: "אמצע הרגל התחתונה, 8 cun מעל הקרסול", function: ["Luo-Connecting point", "מנקה ליחה מכל הגוף", "מנקה ריאות"], indications: ["ליחה", "שיעול עם ליחה", "כבדות", "ערפיליות"], category: "Luo / Phlegm" },
  { id: "ST44", meridian: "st", code: "ST44", nameHe: "קיבה 44", nameCn: "Nei Ting", location: "בין אצבע 2-3 של כף הרגל", function: ["Ying-Spring point", "מנקה חום בקיבה", "משכך כאב שיניים ופנים"], indications: ["חום בקיבה", "כאב שיניים", "פנים אדומות"], category: "Ying-Spring" },

  // === SPLEEN ===
  { id: "SP3", meridian: "sp", code: "SP3", nameHe: "טחול 3", nameCn: "Tai Bai", location: "בגב כף הרגל, מתחת לבסיס metatarsal 1", function: ["Source point", "מחזק צ'י הטחול", "מייבש לחות"], indications: ["חסר צ'י בטחול", "כבדות", "ריכוז חלש"], category: "Yuan" },
  { id: "SP6", meridian: "sp", code: "SP6", nameHe: "טחול 6", nameCn: "San Yin Jiao", location: "3 cun מעל הקרסול הפנימי, בשוק", function: ["נקודת מפגש של 3 מרידיאנים ייניים (SP/LV/KD)", "מחזק טחול, כבד, כליות", "מחזק דם ויין", "מווסת ווסת"], indications: ["בעיות ווסת", "אנמיה", "כאב גב", "חרדה", "נדודי שינה"], category: "Meeting / Gynecology" },
  { id: "SP9", meridian: "sp", code: "SP9", nameHe: "טחול 9", nameCn: "Yin Ling Quan", location: "מתחת לברך הפנימי, בחריץ ליד ה-tibia", function: ["He-Sea point", "מייבש לחות ומנקה מרדיאן הטחול", "מטפל בבצקות"], indications: ["בצקות", "כאב ברך", "שתן עכור", "לחות"], category: "He-Sea / Damp" },
  { id: "SP10", meridian: "sp", code: "SP10", nameHe: "טחול 10", nameCn: "Xue Hai", location: "2 cun מעל קצה ברך פנימית", function: ["מנקה חום בדם", "מחזק דם", "מווסת דם ואנרגיה ייניים"], indications: ["גירוד עור", "אקזמה", "כאב קדם ווסתי", "אנמיה"], category: "Blood" },
  { id: "SP21", meridian: "sp", code: "SP21", nameHe: "טחול 21", nameCn: "Da Bao", location: "7 cun מתחת לבית שחי, על הצד", function: ["Great Luo – מחבר כל הלו"], indications: ["כאב כללי בגוף", "חולשה כללית"], category: "Great Luo" },

  // === HEART ===
  { id: "HT1", meridian: "ht", code: "HT1", nameHe: "לב 1", nameCn: "Ji Quan", location: "מרכז בית השחי, בין עצם הזרוע לשרירי החזה", function: ["Well point – נקודת מוצא של מרידיאן הלב", "מרפה שרירי הזרוע", "מטפל בנוקשות ודלקת בכתף"], indications: ["כאב לב", "דפיקות לב", "כאב כתף וזרוע", "נוקשות בית שחי"], category: "Well" },
  { id: "HT3", meridian: "ht", code: "HT3", nameHe: "לב 3", nameCn: "Shao Hai", location: "קצה הפנימי של קיפול המרפק, על הקצה המדיאלי של epicondyle", function: ["He-Sea / Water point", "מנקה חום לב", "מרגיע שן", "מרפה מרפק וזרוע"], indications: ["חרדה", "חרדה עם חום", "כאב מרפק", "דפיקות לב עם חום"], category: "He-Sea" },
  { id: "HT7", meridian: "ht", code: "HT7", nameHe: "לב 7", nameCn: "Shen Men", location: "פרק כף יד, בצד האולנרי", function: ["Source point – 'שער הרוח'", "מרגיע את השן", "מטפל בנדודי שינה, חרדה, פאניקה"], indications: ["נדודי שינה", "חרדה", "פאניקה", "דפיקות לב"], category: "Yuan / Shen" },
  { id: "HT5", meridian: "ht", code: "HT5", nameHe: "לב 5", nameCn: "Tong Li", location: "1 cun מעל פרק כף יד צד אולנרי", function: ["Luo-Connecting point", "משפר דיבור", "מחזק לב"], indications: ["פאניקה", "קשיי דיבור", "כאב בחזה"], category: "Luo" },
  { id: "HT9", meridian: "ht", code: "HT9", nameHe: "לב 9", nameCn: "Shao Chong", location: "פינה פנימית של ציפורן קמיצה", function: ["Well point – לאיחוי בהתקפי לב, טיפול חירום"], indications: ["אבדן הכרה", "חום גבוה", "אנגינה"], category: "Well / Emergency" },

  // === SMALL INTESTINE ===
  { id: "SI3", meridian: "si", code: "SI3", nameHe: "מעי דק 3", nameCn: "Hou Xi", location: "אגרוף – שוליים היד בבסיס metatarsal 5", function: ["Input point של Du Mai", "מטפל בגב, צוואר, חום"], indications: ["כאב גב/צוואר", "חום", "התכווצויות"], category: "Master Du Mai" },
  { id: "SI11", meridian: "si", code: "SI11", nameHe: "מעי דק 11", nameCn: "Tian Zong", location: "מרכז עצם השכמה", function: ["מרפה כתף ושכמה", "מטפל בנשים לחלב"], indications: ["כאב כתף", "כאב שכמה"], category: "Local" },
  { id: "SI19", meridian: "si", code: "SI19", nameHe: "מעי דק 19", nameCn: "Ting Gong", location: "מול פתח האוזן", function: ["שיפור שמיעה", "צלצולי אוזניים"], indications: ["חירשות", "צלצול אוזניים"], category: "Local" },

  // === URINARY BLADDER ===
  { id: "UB13", meridian: "ub", code: "UB13", nameHe: "שלפוחית 13", nameCn: "Fei Shu", location: "1.5 cun לצד חוליה T3", function: ["Back-Shu של הריאות", "מחזק צ'י/יין ריאות"], indications: ["שיעול", "קוצר נשימה", "חסר ריאות"], category: "Back-Shu" },
  { id: "UB15", meridian: "ub", code: "UB15", nameHe: "שלפוחית 15", nameCn: "Xin Shu", location: "1.5 cun לצד חוליה T5", function: ["Back-Shu של הלב", "מרגיע שן, מטפל בנדודי שינה"], indications: ["נדודי שינה", "חרדה", "דפיקות לב"], category: "Back-Shu" },
  { id: "UB17", meridian: "ub", code: "UB17", nameHe: "שלפוחית 17", nameCn: "Ge Shu", location: "1.5 cun לצד חוליה T7", function: ["Influential point לדם", "מחזק ומנקה דם"], indications: ["אנמיה", "גירוד עור", "דמם"], category: "Back-Shu / Influential" },
  { id: "UB18", meridian: "ub", code: "UB18", nameHe: "שלפוחית 18", nameCn: "Gan Shu", location: "1.5 cun לצד חוליה T9", function: ["Back-Shu של הכבד", "מנקה חום כבד, מחזק דם כבד"], indications: ["בעיות כבד", "עיניים אדומות", "חסר דם"], category: "Back-Shu" },
  { id: "UB20", meridian: "ub", code: "UB20", nameHe: "שלפוחית 20", nameCn: "Pi Shu", location: "1.5 cun לצד חוליה T11", function: ["Back-Shu של הטחול", "מחזק צ'י הטחול"], indications: ["חסר טחול", "כבדות", "בעיות עיכול"], category: "Back-Shu" },
  { id: "UB21", meridian: "ub", code: "UB21", nameHe: "שלפוחית 21", nameCn: "Wei Shu", location: "1.5 cun לצד חוליה T12", function: ["Back-Shu של הקיבה", "מווסת קיבה"], indications: ["כאב קיבה", "בחילות", "חוסר תאבון"], category: "Back-Shu" },
  { id: "UB22", meridian: "ub", code: "UB22", nameHe: "שלפוחית 22", nameCn: "San Jiao Shu", location: "1.5 cun לצד חוליה L1", function: ["Back-Shu של תלת מחמם", "מווסת נוזלים ולחות"], indications: ["בצקות", "לחות"], category: "Back-Shu" },
  { id: "UB23", meridian: "ub", code: "UB23", nameHe: "שלפוחית 23", nameCn: "Shen Shu", location: "1.5 cun לצד חוליה L2", function: ["Back-Shu של הכליות", "מחזק יין ויאנג הכליות", "מחזק גב תחתון"], indications: ["כאב גב תחתון", "חסר כליות", "שתן לילה"], category: "Back-Shu" },
  { id: "UB40", meridian: "ub", code: "UB40", nameHe: "שלפוחית 40", nameCn: "Wei Zhong", location: "אמצע קיפול הברך", function: ["He-Sea point – 'Command point לגב'", "מנקה חום בדם", "מחזק גב"], indications: ["כאב גב", "כאב ברך", "שיגרון"], category: "He-Sea / Command" },
  { id: "UB60", meridian: "ub", code: "UB60", nameHe: "שלפוחית 60", nameCn: "Kun Lun", location: "בין קרסול חיצוני לגיד אכילס", function: ["Jing-River point", "משכך כאב גב וראש", "מזרז לידה (הורדת עובר)"], indications: ["כאב גב", "כאב ראש", "כאב רגל"], category: "Jing-River" },

  // === KIDNEY ===
  { id: "KD1", meridian: "kid", code: "KD1", nameHe: "כליות 1", nameCn: "Yong Quan", location: "שליש עליון של כף הרגל (בין metatarsal 2-3)", function: ["Well point – 'מעיין נובע'", "מקרקע ומרגיע", "מוריד אש מהראש"], indications: ["אבדן הכרה", "חום גבוה", "פאניקה", "יתר לחץ דם"], category: "Well / Grounding" },
  { id: "KD3", meridian: "kid", code: "KD3", nameHe: "כליות 3", nameCn: "Tai Xi", location: "בין קרסול פנימי לגיד אכילס", function: ["Source point", "מחזק יין ויאנג הכליות", "מחזק Jing"], indications: ["חסר כליות", "כאב גב", "חרדה כרונית", "חרדת קיום"], category: "Yuan" },
  { id: "KD6", meridian: "kid", code: "KD6", nameHe: "כליות 6", nameCn: "Zhao Hai", location: "1 cun מתחת לקרסול הפנימי", function: ["Master point של Yin Qiao Mai", "מחזק יין הכליות", "מרגיע שן", "מטפל בנדודי שינה"], indications: ["נדודי שינה", "חסר יין", "הזעות לילה", "גרון יבש"], category: "Master / Yin" },
  { id: "KD7", meridian: "kid", code: "KD7", nameHe: "כליות 7", nameCn: "Fu Liu", location: "2 cun מעל קרסול פנימי, מאחורי הקרסול", function: ["Jing-River / Metal point", "מחזק יאנג הכליות", "מווסת הזעות"], indications: ["הזעות ספונטניות", "חסר יאנג כליות", "בצקות"], category: "Jing-River" },
  { id: "KD27", meridian: "kid", code: "KD27", nameHe: "כליות 27", nameCn: "Shu Fu", location: "מתחת לעצם הבריח, 2 cun לצד הקו האמצעי", function: ["מחזק צ'י ריאות", "מוריד צ'י מורד ריאות"], indications: ["שיעול", "קוצר נשימה", "כאב חזה"], category: "Local" },

  // === PERICARDIUM ===
  { id: "PC6", meridian: "pc", code: "PC6", nameHe: "מעטפת לב 6", nameCn: "Nei Guan", location: "2 cun מעל פרק כף יד, בין גידי flexor", function: ["Luo-Connecting / Master point של Yin Wei Mai", "מרגיע לב ושן", "מטפל בבחילות", "מטפל בחרדה וקשרים רגשיים"], indications: ["בחילות", "הקאות", "חרדה", "דפיקות לב", "בחילות הריון"], category: "Luo / Master / Nausea" },
  { id: "PC7", meridian: "pc", code: "PC7", nameHe: "מעטפת לב 7", nameCn: "Da Ling", location: "אמצע פרק כף יד, בין הגידים", function: ["Source point", "מרגיע לב ושן"], indications: ["נדודי שינה", "חרדה", "דפיקות לב"], category: "Yuan" },
  { id: "PC3", meridian: "pc", code: "PC3", nameHe: "מעטפת לב 3", nameCn: "Qu Ze", location: "קיפול המרפק הפנימי", function: ["He-Sea point", "מנקה חום בדם"], indications: ["חום", "דפיקות לב עם חום"], category: "He-Sea" },

  // === TRIPLE WARMER ===
  { id: "TW5", meridian: "tw", code: "TW5", nameHe: "תלת מחמם 5", nameCn: "Wai Guan", location: "2 cun מעל פרק כף יד, בין הגידים – גב", function: ["Luo-Connecting / Master point של Yang Wei Mai", "מנקה רוח-חום", "משכך כאב אוזניים ועיניים"], indications: ["צינון", "כאב אוזניים", "כאב ראש"], category: "Luo / Master" },
  { id: "TW14", meridian: "tw", code: "TW14", nameHe: "תלת מחמם 14", nameCn: "Jian Liao", location: "אחורי הכתף", function: ["מרפה כתף"], indications: ["כאב כתף"], category: "Local" },
  { id: "TW3", meridian: "tw", code: "TW3", nameHe: "תלת מחמם 3", nameCn: "Zhong Zhu", location: "גב היד בין metatarsal 4-5", function: ["Shu-Stream point", "פותח ומנקה"], indications: ["כאב ראש", "אוזניים"], category: "Shu-Stream" },

  // === GALLBLADDER ===
  { id: "GB20", meridian: "gb", code: "GB20", nameHe: "כיס מרה 20", nameCn: "Feng Chi", location: "בבסיס הגולגולת, בין sternocleidomastoid לטרפז", function: ["מנקה רוח", "משחרר חיצוני", "משפר ראייה"], indications: ["כאב ראש", "עיניים אדומות", "צוואר תפוס", "צינון", "כאב עורפי"], category: "Wind / Local" },
  { id: "GB21", meridian: "gb", code: "GB21", nameHe: "כיס מרה 21", nameCn: "Jian Jing", location: "אמצע הטרפז", function: ["מרפה כתפיים", "מוריד צ'י", "מזרז לידה"], indications: ["כתפיים תפוסות", "כאב צוואר"], category: "Local" },
  { id: "GB34", meridian: "gb", code: "GB34", nameHe: "כיס מרה 34", nameCn: "Yang Ling Quan", location: "מתחת לראש fibula", function: ["He-Sea point", "Influential point לגידים", "מנקה חום כבד-כיס מרה"], indications: ["כאב גידים", "ברך", "צלע"], category: "He-Sea / Influential" },
  { id: "GB40", meridian: "gb", code: "GB40", nameHe: "כיס מרה 40", nameCn: "Qiu Xu", location: "מתחת ולפני קרסול חיצוני", function: ["Source point", "מנקה כבד-כיס מרה"], indications: ["כאב קרסול", "חום ב כיס מרה"], category: "Yuan" },

  // === LIVER ===
  { id: "LV2", meridian: "liv", code: "LV2", nameHe: "כבד 2", nameCn: "Xing Jian", location: "בין אצבע 1-2 כף הרגל", function: ["Ying-Spring / Fire point", "מנקה חום בכבד", "מוריד יאנג עולה"], indications: ["עצבנות", "עיניים אדומות", "כאב ראש מחום בכבד"], category: "Ying-Spring" },
  { id: "LV3", meridian: "liv", code: "LV3", nameHe: "כבד 3", nameCn: "Tai Chong", location: "2 cun מעל הקצה בין metatarsal 1-2", function: ["Source point – 'הנקודה החשובה ביותר'", "משחרר סטגנציית צ'י", "מרגיע כבד", "מווסת רגשות"], indications: ["עצבנות", "תסכול", "כאב ראש", "PMS", "חרדה"], category: "Yuan / Soothing" },
  { id: "LV8", meridian: "liv", code: "LV8", nameHe: "כבד 8", nameCn: "Qu Quan", location: "קיפול הברך הפנימי", function: ["He-Sea / Water point", "מחזק דם ויין הכבד"], indications: ["חסר דם בכבד", "גניקולוגי", "כאב ברך"], category: "He-Sea" },
  { id: "LV14", meridian: "liv", code: "LV14", nameHe: "כבד 14", nameCn: "Qi Men", location: "מתחת לפטמה, בחלל צלע 6", function: ["Front-Mu של הכבד", "משחרר סטגנציית צ'י בצלעות"], indications: ["כאב צלעות", "כאב חזה", "PMS"], category: "Front-Mu" },
];

export const getPointById = (id) => points.find((p) => p.id === id);
export const getPointsByMeridian = (meridianId) => points.filter((p) => p.meridian === meridianId);
export const searchPoints = (query) => {
  const q = query.toLowerCase();
  return points.filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.nameCn.toLowerCase().includes(q) ||
      p.nameHe.includes(query) ||
      p.indications.some((i) => i.toLowerCase().includes(q)) ||
      p.function.some((f) => f.toLowerCase().includes(q))
  );
};
