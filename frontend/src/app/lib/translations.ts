// Translations for all 6 supported languages
// Keys: EN, हि (Hindi), తె (Telugu), த (Tamil), ಕ (Kannada), മ (Malayalam)

export type LangKey = "EN" | "हि" | "తె" | "த" | "ಕ" | "മ";

export interface LoginTranslations {
  tagline: string;
  tags: string[];
  mobileNumber: string;
  otpHint: string;
  sendOtp: string;
  or: string;
  newVendorRegister: string;
  otpSentTo: string;
  enterOtp: string;
  verifyAndContinue: string;
  changeNumber: string;
  resendOtpIn: string;
  resendViaCall: string;
  termsText: string;
  failedToSendOtp: string;
  networkError: string;
  invalidOtp: string;
}

// Common UI strings used across the whole app
export interface CommonTranslations {
  home: string;
  ledger: string;
  add: string;
  reports: string;
  score: string;
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  todaysSales: string;
  monthlySales: string;
  monthlyPurchases: string;
  expenses: string;
  netCashFlow: string;
  quickActions: string;
  addTransaction: string;
  voiceEntry: string;
  creditScore: string;
  recentTransactions: string;
  viewAll: string;
  loanEligibility: string;
  eligible: string;
  notEligible: string;
  thisMonth: string;
  save: string;
  cancel: string;
  confirm: string;
  edit: string;
  submit: string;
  loading: string;
  error: string;
  success: string;
  amount: string;
  date: string;
  category: string;
  paymentMode: string;
  customerName: string;
  notes: string;
  type: string;
  sale: string;
  purchase: string;
  expense: string;
}

export const loginTranslations: Record<LangKey, LoginTranslations> = {
  EN: {
    tagline: "Track. Score. Grow.",
    tags: ["Small Vendors", "Shop Owners", "Street Vendors"],
    mobileNumber: "Mobile Number",
    otpHint: "We'll send a 6-digit OTP to verify your number",
    sendOtp: "Send OTP",
    or: "OR",
    newVendorRegister: "New Vendor? Register",
    otpSentTo: "OTP sent to",
    enterOtp: "Enter 6-digit OTP",
    verifyAndContinue: "Verify & Continue",
    changeNumber: "← Change Number",
    resendOtpIn: "Resend OTP in 28s",
    resendViaCall: "Resend via Call",
    termsText: "By continuing, you agree to our Terms of Service & Privacy Policy",
    failedToSendOtp: "Failed to send OTP",
    networkError: "Network error. Please try again.",
    invalidOtp: "Invalid OTP. Please try again.",
  },
  "हि": {
    tagline: "ट्रैक करें। स्कोर करें। बढ़ें।",
    tags: ["छोटे विक्रेता", "दुकानदार", "फेरीवाले"],
    mobileNumber: "मोबाइल नंबर",
    otpHint: "आपके नंबर को सत्यापित करने के लिए 6 अंकों का OTP भेजा जाएगा",
    sendOtp: "OTP भेजें",
    or: "या",
    newVendorRegister: "नए विक्रेता? रजिस्टर करें",
    otpSentTo: "OTP भेजा गया",
    enterOtp: "6 अंकों का OTP दर्ज करें",
    verifyAndContinue: "सत्यापित करें और जारी रखें",
    changeNumber: "← नंबर बदलें",
    resendOtpIn: "28 सेकंड में OTP दोबारा भेजें",
    resendViaCall: "कॉल से दोबारा भेजें",
    termsText: "जारी रखने पर, आप हमारी सेवा शर्तों और गोपनीयता नीति से सहमत हैं",
    failedToSendOtp: "OTP भेजने में विफल",
    networkError: "नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।",
    invalidOtp: "अमान्य OTP। कृपया पुनः प्रयास करें।",
  },
  "తె": {
    tagline: "ట్రాక్ చేయండి. స్కోర్ చేయండి. పెరగండి.",
    tags: ["చిన్న వ్యాపారులు", "దుకాణదారులు", "వీధి వ్యాపారులు"],
    mobileNumber: "మొబైల్ నంబర్",
    otpHint: "మీ నంబర్‌ను ధృవీకరించడానికి 6 అంకెల OTP పంపబడుతుంది",
    sendOtp: "OTP పంపండి",
    or: "లేదా",
    newVendorRegister: "కొత్త వ్యాపారి? నమోదు చేయండి",
    otpSentTo: "OTP పంపబడింది",
    enterOtp: "6 అంకెల OTP నమోదు చేయండి",
    verifyAndContinue: "ధృవీకరించండి & కొనసాగండి",
    changeNumber: "← నంబర్ మార్చండి",
    resendOtpIn: "28 సెకన్లలో OTP మళ్ళీ పంపండి",
    resendViaCall: "కాల్ ద్వారా మళ్ళీ పంపండి",
    termsText: "కొనసాగించడం ద్వారా, మీరు మా సేవా నిబంధనలు మరియు గోప్యతా విధానానికి అంగీకరిస్తున్నారు",
    failedToSendOtp: "OTP పంపడంలో వైఫల్యం",
    networkError: "నెట్‌వర్క్ లోపం. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    invalidOtp: "చెల్లని OTP. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  },
  "த": {
    tagline: "கண்காணிக்கவும். மதிப்பெண் பெறவும். வளரவும்.",
    tags: ["சிறு வியாபாரிகள்", "கடை உரிமையாளர்கள்", "தெரு வியாபாரிகள்"],
    mobileNumber: "மொபைல் எண்",
    otpHint: "உங்கள் எண்ணை சரிபார்க்க 6 இலக்க OTP அனுப்பப்படும்",
    sendOtp: "OTP அனுப்பு",
    or: "அல்லது",
    newVendorRegister: "புதிய வியாபாரியா? பதிவு செய்யுங்கள்",
    otpSentTo: "OTP அனுப்பப்பட்டது",
    enterOtp: "6 இலக்க OTP உள்ளிடவும்",
    verifyAndContinue: "சரிபார்க்கவும் & தொடரவும்",
    changeNumber: "← எண் மாற்றவும்",
    resendOtpIn: "28 வினாடிகளில் OTP மீண்டும் அனுப்பவும்",
    resendViaCall: "அழைப்பு மூலம் மீண்டும் அனுப்பவும்",
    termsText: "தொடர்வதன் மூலம், நீங்கள் எங்கள் சேவை விதிமுறைகளும் தனியுரிமை கொள்கையும் ஒப்புக்கொள்கிறீர்கள்",
    failedToSendOtp: "OTP அனுப்புவதில் தோல்வி",
    networkError: "நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.",
    invalidOtp: "தவறான OTP. மீண்டும் முயற்சிக்கவும்.",
  },
  "ಕ": {
    tagline: "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ. ಸ್ಕೋರ್ ಮಾಡಿ. ಬೆಳೆಯಿರಿ.",
    tags: ["ಸಣ್ಣ ವ್ಯಾಪಾರಿಗಳು", "ಅಂಗಡಿ ಮಾಲೀಕರು", "ಬೀದಿ ವ್ಯಾಪಾರಿಗಳು"],
    mobileNumber: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    otpHint: "ನಿಮ್ಮ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಲು 6 ಅಂಕಿಯ OTP ಕಳುಹಿಸಲಾಗುತ್ತದೆ",
    sendOtp: "OTP ಕಳುಹಿಸಿ",
    or: "ಅಥವಾ",
    newVendorRegister: "ಹೊಸ ವ್ಯಾಪಾರಿಯೇ? ನೋಂದಾಯಿಸಿ",
    otpSentTo: "OTP ಕಳುಹಿಸಲಾಗಿದೆ",
    enterOtp: "6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    verifyAndContinue: "ಪರಿಶೀಲಿಸಿ & ಮುಂದುವರಿಯಿರಿ",
    changeNumber: "← ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ",
    resendOtpIn: "28 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ OTP ಮರುಕಳುಹಿಸಿ",
    resendViaCall: "ಕರೆ ಮೂಲಕ ಮರುಕಳುಹಿಸಿ",
    termsText: "ಮುಂದುವರಿಯುವ ಮೂಲಕ, ನೀವು ನಮ್ಮ ಸೇವಾ ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಗೆ ಒಪ್ಪುತ್ತೀರಿ",
    failedToSendOtp: "OTP ಕಳುಹಿಸಲು ವಿಫಲವಾಗಿದೆ",
    networkError: "ನೆಟ್‌ವರ್ಕ್ ದೋಷ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    invalidOtp: "ಅಮಾನ್ಯ OTP. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  },
  "മ": {
    tagline: "ട്രാക്ക് ചെയ്യൂ. സ്‌കോർ ചെയ്യൂ. വളരൂ.",
    tags: ["ചെറുകിട വ്യാപാരികൾ", "കടയുടമകൾ", "തെരുവ് കച്ചവടക്കാർ"],
    mobileNumber: "മൊബൈൽ നമ്പർ",
    otpHint: "നിങ്ങളുടെ നമ്പർ പരിശോധിക്കാൻ 6 അക്ക OTP അയക്കും",
    sendOtp: "OTP അയക്കൂ",
    or: "അല്ലെങ്കിൽ",
    newVendorRegister: "പുതിയ വ്യാപാരിയോ? രജിസ്റ്റർ ചെയ്യൂ",
    otpSentTo: "OTP അയച്ചു",
    enterOtp: "6 അക്ക OTP നൽകൂ",
    verifyAndContinue: "പരിശോധിക്കൂ & തുടരൂ",
    changeNumber: "← നമ്പർ മാറ്റൂ",
    resendOtpIn: "28 സെക്കൻഡിൽ OTP വീണ്ടും അയക്കൂ",
    resendViaCall: "കോൾ വഴി വീണ്ടും അയക്കൂ",
    termsText: "തുടരുന്നതിലൂടെ, നിങ്ങൾ ഞങ്ങളുടെ സേവന നിബന്ധനകളും സ്വകാര്യതാ നയവും അംഗീകരിക്കുന്നു",
    failedToSendOtp: "OTP അയക്കുന്നതിൽ പരാജയപ്പെട്ടു",
    networkError: "നെറ്റ്‌വർക്ക് പിശക്. വീണ്ടും ശ്രമിക്കൂ.",
    invalidOtp: "തെറ്റായ OTP. വീണ്ടും ശ്രമിക്കൂ.",
  },
};

// Common translations used in Dashboard, Nav, Forms, etc.
export const commonTranslations: Record<LangKey, CommonTranslations> = {
  EN: {
    home: "Home", ledger: "Ledger", add: "Add", reports: "Reports", score: "Score",
    goodMorning: "Good morning", goodAfternoon: "Good afternoon", goodEvening: "Good evening",
    todaysSales: "Today's Sales", monthlySales: "Monthly Sales", monthlyPurchases: "Purchases", expenses: "Expenses", netCashFlow: "Net Cash Flow",
    quickActions: "Quick Actions", addTransaction: "Add Transaction", voiceEntry: "Voice Entry",
    creditScore: "Credit Score", recentTransactions: "Recent Transactions", viewAll: "View All",
    loanEligibility: "Loan Eligibility", eligible: "✓ Eligible", notEligible: "✗ Not Eligible",
    thisMonth: "this month", save: "Save", cancel: "Cancel", confirm: "Confirm", edit: "Edit",
    submit: "Submit", loading: "Loading...", error: "Error", success: "Success",
    amount: "Amount", date: "Date", category: "Category", paymentMode: "Payment Mode",
    customerName: "Customer Name", notes: "Notes", type: "Type",
    sale: "Sale", purchase: "Purchase", expense: "Expense",
  },
  "हि": {
    home: "होम", ledger: "खाता", add: "जोड़ें", reports: "रिपोर्ट", score: "स्कोर",
    goodMorning: "सुप्रभात", goodAfternoon: "नमस्ते", goodEvening: "शुभ संध्या",
    todaysSales: "आज की बिक्री", monthlySales: "मासिक बिक्री", monthlyPurchases: "खरीद", expenses: "खर्च", netCashFlow: "शुद्ध नकदी प्रवाह",
    quickActions: "त्वरित क्रियाएं", addTransaction: "लेनदेन जोड़ें", voiceEntry: "आवाज से दर्ज करें",
    creditScore: "क्रेडिट स्कोर", recentTransactions: "हाल के लेनदेन", viewAll: "सभी देखें",
    loanEligibility: "ऋण पात्रता", eligible: "✓ पात्र", notEligible: "✗ अपात्र",
    thisMonth: "इस महीने", save: "सहेजें", cancel: "रद्द करें", confirm: "पुष्टि करें", edit: "संपादित करें",
    submit: "जमा करें", loading: "लोड हो रहा है...", error: "त्रुटि", success: "सफलता",
    amount: "राशि", date: "तारीख", category: "श्रेणी", paymentMode: "भुगतान का तरीका",
    customerName: "ग्राहक का नाम", notes: "नोट्स", type: "प्रकार",
    sale: "बिक्री", purchase: "खरीद", expense: "खर्च",
  },
  "తె": {
    home: "హోమ్", ledger: "లెడ్జర్", add: "జోడించు", reports: "నివేదికలు", score: "స్కోర్",
    goodMorning: "శుభోదయం", goodAfternoon: "నమస్కారం", goodEvening: "శుభ సాయంత్రం",
    todaysSales: "నేటి అమ్మకాలు", monthlySales: "నెలవారీ అమ్మకాలు", monthlyPurchases: "కొనుగోళ్లు", expenses: "ఖర్చులు", netCashFlow: "నికర నగదు ప్రవాహం",
    quickActions: "త్వరిత చర్యలు", addTransaction: "లావాదేవీ జోడించు", voiceEntry: "వాయిస్ ఎంట్రీ",
    creditScore: "క్రెడిట్ స్కోర్", recentTransactions: "ఇటీవలి లావాదేవీలు", viewAll: "అన్నీ చూడు",
    loanEligibility: "రుణ అర్హత", eligible: "✓ అర్హత ఉంది", notEligible: "✗ అర్హత లేదు",
    thisMonth: "ఈ నెల", save: "సేవ్ చేయి", cancel: "రద్దు చేయి", confirm: "నిర్ధారించు", edit: "సవరించు",
    submit: "సమర్పించు", loading: "లోడ్ అవుతోంది...", error: "లోపం", success: "విజయం",
    amount: "మొత్తం", date: "తేదీ", category: "వర్గం", paymentMode: "చెల్లింపు విధానం",
    customerName: "కస్టమర్ పేరు", notes: "గమనికలు", type: "రకం",
    sale: "అమ్మకం", purchase: "కొనుగోలు", expense: "ఖర్చు",
  },
  "த": {
    home: "முகப்பு", ledger: "ஏடு", add: "சேர்க்க", reports: "அறிக்கைகள்", score: "மதிப்பெண்",
    goodMorning: "காலை வணக்கம்", goodAfternoon: "மதிய வணக்கம்", goodEvening: "மாலை வணக்கம்",
    todaysSales: "இன்றைய விற்பனை", monthlySales: "மாதாந்திர விற்பனை", monthlyPurchases: "கொள்முதல்", expenses: "செலவுகள்", netCashFlow: "நிகர பணப்புழக்கம்",
    quickActions: "விரைவு செயல்கள்", addTransaction: "பரிவர்த்தனை சேர்க்க", voiceEntry: "குரல் பதிவு",
    creditScore: "கடன் மதிப்பெண்", recentTransactions: "சமீபத்திய பரிவர்த்தனைகள்", viewAll: "அனைத்தையும் காண்க",
    loanEligibility: "கடன் தகுதி", eligible: "✓ தகுதியானவர்", notEligible: "✗ தகுதியற்றவர்",
    thisMonth: "இந்த மாதம்", save: "சேமி", cancel: "ரத்து", confirm: "உறுதிப்படுத்து", edit: "திருத்து",
    submit: "சமர்ப்பி", loading: "ஏற்றுகிறது...", error: "பிழை", success: "வெற்றி",
    amount: "தொகை", date: "தேதி", category: "வகை", paymentMode: "கட்டண முறை",
    customerName: "வாடிக்கையாளர் பெயர்", notes: "குறிப்புகள்", type: "வகை",
    sale: "விற்பனை", purchase: "கொள்முதல்", expense: "செலவு",
  },
  "ಕ": {
    home: "ಮನೆ", ledger: "ಲೆಡ್ಜರ್", add: "ಸೇರಿಸಿ", reports: "ವರದಿಗಳು", score: "ಸ್ಕೋರ್",
    goodMorning: "ಶುಭೋದಯ", goodAfternoon: "ನಮಸ್ಕಾರ", goodEvening: "ಶುಭ ಸಂಜೆ",
    todaysSales: "ಇಂದಿನ ಮಾರಾಟ", monthlySales: "ಮಾಸಿಕ ಮಾರಾಟ", monthlyPurchases: "ಖರೀದಿಗಳು", expenses: "ಖರ್ಚುಗಳು", netCashFlow: "ನಿವ್ವಳ ನಗದು ಹರಿವು",
    quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು", addTransaction: "ವ್ಯವಹಾರ ಸೇರಿಸಿ", voiceEntry: "ಧ್ವನಿ ನಮೂದು",
    creditScore: "ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್", recentTransactions: "ಇತ್ತೀಚಿನ ವ್ಯವಹಾರಗಳು", viewAll: "ಎಲ್ಲಾ ನೋಡಿ",
    loanEligibility: "ಸಾಲದ ಅರ್ಹತೆ", eligible: "✓ ಅರ್ಹರು", notEligible: "✗ ಅನರ್ಹರು",
    thisMonth: "ಈ ತಿಂಗಳು", save: "ಉಳಿಸಿ", cancel: "ರದ್ದು", confirm: "ದೃಢೀಕರಿಸಿ", edit: "ಸಂಪಾದಿಸಿ",
    submit: "ಸಲ್ಲಿಸಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", error: "ದೋಷ", success: "ಯಶಸ್ಸು",
    amount: "ಮೊತ್ತ", date: "ದಿನಾಂಕ", category: "ವರ್ಗ", paymentMode: "ಪಾವತಿ ವಿಧಾನ",
    customerName: "ಗ್ರಾಹಕರ ಹೆಸರು", notes: "ಟಿಪ್ಪಣಿಗಳು", type: "ಪ್ರಕಾರ",
    sale: "ಮಾರಾಟ", purchase: "ಖರೀದಿ", expense: "ಖರ್ಚು",
  },
  "മ": {
    home: "ഹോം", ledger: "ലെഡ്ജർ", add: "ചേർക്കൂ", reports: "റിപ്പോർട്ടുകൾ", score: "സ്‌കോർ",
    goodMorning: "സുപ്രഭാതം", goodAfternoon: "നമസ്കാരം", goodEvening: "ശുഭ സന്ധ്യ",
    todaysSales: "ഇന്നത്തെ വിൽപ്പന", monthlySales: "മാസ വിൽപ്പന", monthlyPurchases: "വാങ്ങലുകൾ", expenses: "ചെലവുകൾ", netCashFlow: "നിറ്റ കാഷ് ഫ്ലോ",
    quickActions: "ദ്രുത പ്രവർത്തനങ്ങൾ", addTransaction: "ഇടപാട് ചേർക്കൂ", voiceEntry: "ശബ്ദ നൽകൽ",
    creditScore: "ക്രെഡിറ്റ് സ്‌കോർ", recentTransactions: "സമീപകാല ഇടപാടുകൾ", viewAll: "എല്ലാം കാണൂ",
    loanEligibility: "വായ്പ യോഗ്യത", eligible: "✓ യോഗ്യൻ", notEligible: "✗ അയോഗ്യൻ",
    thisMonth: "ഈ മാസം", save: "സേവ് ചെയ്യൂ", cancel: "റദ്ദാക്കൂ", confirm: "സ്ഥിരീകരിക്കൂ", edit: "എഡിറ്റ് ചെയ്യൂ",
    submit: "സമർപ്പിക്കൂ", loading: "ലോഡ് ചെയ്യുന്നു...", error: "പിശക്", success: "വിജയം",
    amount: "തുക", date: "തീയതി", category: "വിഭാഗം", paymentMode: "പണമടക്കൽ രീതി",
    customerName: "ഉപഭോക്തൃ പേര്", notes: "കുറിപ്പുകൾ", type: "തരം",
    sale: "വിൽപ്പന", purchase: "വാങ്ങൽ", expense: "ചെലവ്",
  },
};
