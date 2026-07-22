const STORAGE_KEY = "banakar-finclub-state-v1";
const VAPID_PUBLIC_KEY = "BNqp-GTE0Toi-cN27YJ49RIiGHISNkh9HFAUZ8GMDFmp3-DaV6Q91NE8yF9gNQsq3asqxFPsWiWzFdVrTz-bQsY";
const PRESIDENT_PHONE = "9591382942";
const ASSOCIATION_UPI_ID = "mukkaneshwara@ybl";
const ASSOCIATION_UPI_NAME = "Sri Mukkaneshwara Associates";
const AUTH_EMAIL_DOMAIN = "banakarfinclub.app";
const PRESIDENT_EMAIL = "manjunathbs.cloud@gmail.com";
const appConfig = window.BANAKAR_FINCLUB_CONFIG || {};
const liveBackendReady = appConfig.backend === "supabase" && Boolean(appConfig.supabaseUrl && appConfig.supabaseAnonKey && window.supabase);
const supabaseClient = liveBackendReady ? window.supabase.createClient(appConfig.supabaseUrl, appConfig.supabaseAnonKey) : null;

const translations = {
  en: {
    privateClub: "Private member finance club",
    loginTitle: "Family fund, deposits, loans, and reports in one private app.",
    loginCopy: "Built for Banakar FinClub members with admin approval, monthly deposits, and loan tracking.",
    signIn: "Login",
    signUp: "Signup",
    reset: "Reset",
    phone: "Phone",
    password: "Password",
    name: "Full name",
    requestAccess: "Request access",
    forgotPassword: "Forgot password",
    dashboard: "Home",
    deposits: "Deposits",
    loans: "Loans",
    members: "Members",
    admin: "Admin",
    totalFund: "Total fund balance",
    bankBalance: "Bank balance",
    availableLoan: "Available loan",
    loanRequestStatus: "Loan request status",
    monthlyDue: "Monthly due",
    outstandingLoans: "Outstanding loans",
    pendingApprovals: "Pending approvals",
    dueBy: "Due by 15th",
    groupRules: "Group rules",
    recentActivity: "Recent activity",
    loanRequest: "Loan request",
    amount: "Amount",
    reason: "Reason",
    submit: "Submit",
    approve: "Approve",
    reject: "Reject",
    logout: "Logout",
    language: "ಕನ್ನಡ",
    adminOnly: "Admin only",
    ownDetailsOnly: "Members see own details and group balance.",
    demoMode: "Demo mode",
    liveMode: "Live mode",
    meetings: "Dashboard",
  },
  kn: {
    privateClub: "ಖಾಸಗಿ ಸದಸ್ಯರ ಹಣಕಾಸು ಕ್ಲಬ್",
    loginTitle: "ಕುಟುಂಬ ನಿಧಿ, ಠೇವಣಿ, ಸಾಲ ಮತ್ತು ವರದಿಗಳು ಒಂದೇ ಆಪ್‌ನಲ್ಲಿ.",
    loginCopy: "Banakar FinClub ಸದಸ್ಯರಿಗಾಗಿ ಅಡ್ಮಿನ್ ಅನುಮೋದನೆ, ಮಾಸಿಕ ಠೇವಣಿ, ಸಾಲ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ICICI ಸ್ಟೇಟ್ಮೆಂಟ್ ಆಮದು ಸಿದ್ಧತೆ.",
    signIn: "ಲಾಗಿನ್",
    signUp: "ಸೈನ್ ಅಪ್",
    reset: "ರಿಸೆಟ್",
    phone: "ಫೋನ್",
    password: "ಪಾಸ್ವರ್ಡ್",
    name: "ಪೂರ್ಣ ಹೆಸರು",
    requestAccess: "ಪ್ರವೇಶ ವಿನಂತಿ",
    forgotPassword: "ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ",
    dashboard: "ಹೋಮ್",
    deposits: "ಠೇವಣಿಗಳು",
    loans: "ಸಾಲಗಳು",
    members: "ಸದಸ್ಯರು",
    admin: "ಅಡ್ಮಿನ್",
    totalFund: "ಒಟ್ಟು ನಿಧಿ ಬ್ಯಾಲೆನ್ಸ್",
    bankBalance: "ಬ್ಯಾಂಕ್ ಬ್ಯಾಲೆನ್ಸ್",
    availableLoan: "ಲಭ್ಯವಿರುವ ಸಾಲ",
    loanRequestStatus: "ಸಾಲ ವಿನಂತಿ ಸ್ಥಿತಿ",
    monthlyDue: "ಮಾಸಿಕ ಬಾಕಿ",
    outstandingLoans: "ಬಾಕಿ ಸಾಲಗಳು",
    pendingApprovals: "ಬಾಕಿ ಅನುಮೋದನೆಗಳು",
    dueBy: "15ರೊಳಗೆ ಪಾವತಿ",
    groupRules: "ಗುಂಪಿನ ನಿಯಮಗಳು",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    loanRequest: "ಸಾಲ ವಿನಂತಿ",
    amount: "ಮೊತ್ತ",
    reason: "ಕಾರಣ",
    submit: "ಸಲ್ಲಿಸಿ",
    approve: "ಅನುಮೋದಿಸಿ",
    reject: "ತಿರಸ್ಕರಿಸಿ",
    logout: "ಲಾಗ್ಔಟ್",
    language: "English",
    adminOnly: "ಅಡ್ಮಿನ್ ಮಾತ್ರ",
    ownDetailsOnly: "ಸದಸ್ಯರು ತಮ್ಮ ವಿವರಗಳು ಮತ್ತು ಗುಂಪು ಬ್ಯಾಲೆನ್ಸ್ ಮಾತ್ರ ನೋಡುತ್ತಾರೆ.",
    demoMode: "ಡೆಮೊ ಮೋಡ್",
    liveMode: "ಲೈವ್ ಮೋಡ್",
    meetings: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  },
};

const initialState = {
  lang: "en",
  activeTab: "dashboard",
  currentUserId: null,
  settings: {
    monthlyDeposit: 2000,
    dueDay: 15,
    loanInterestRateMonthly: 1.25,
    loanInterestLabel: "Rs. 1.25 per Rs. 100 per month",
    presidentDecemberDeposit: 0,
    vicePresidentDecemberDeposit: 1250,
    annualRenewalRule: "Decided in annual meeting",
    bankName: "ICICI Bank",
    bankBalance: 231770,
    minimumReserve: 5000,
    bankBalanceUpdatedAt: "2026-05-14",
    activeYearNumber: 6,
    activeYearStart: "2026-07",
    activeYearLabel: "Sixth Year",
    activeYearRenewalFee: 0,
    activeYearExits: [],
    yearClosed: false,
    emiEnabled: false,
    emiLoanInterestRateMonthly: 1.5,
  },
  members: [
    { id: "m1", name: "Manjunath Banakar", phone: "9591382942", role: "president", status: "active", password: "123456" },
    { id: "m2", name: "Pratap Banakar", phone: "7259907409", role: "vice_president", status: "active", password: "123456" },
    { id: "m3", name: "Praveen Banakar", phone: "9538913204", role: "member", status: "active", password: "123456" },
    { id: "m4", name: "Mukkanna Banakar", phone: "8618600807", role: "member", status: "active", password: "123456" },
    { id: "m5", name: "Santosh Banakar", phone: "9739678816", role: "member", status: "active", password: "123456" },
    { id: "m6", name: "Pradeep Banakar", phone: "9663644751", role: "member", status: "active", password: "123456" },
    { id: "m7", name: "Appanna Banakar", phone: "8217526323", role: "member", status: "active", password: "123456" },
  ],
  allMembers: [],
  signupRequests: [],
  deposits: [
    {
      id: "d2021", year: 2021, label: "First Year (2021-2022)", principal: 111000, interest: 8700, expenditure: 5600, balance: 114100,
      intro: "In the inaugural year, the association established its financial foundation as follows:",
      history: [
        "Initial contribution: Each member deposited ₹5,000 in February 2021",
        "Regular monthly deposits: ₹1,000 per member from March 2021 to January 2022",
        "Special consideration: The President was exempted from December 2021 deposit",
        "Additional income: Earned ₹8,700 through interest",
        "Annual expenses: ₹5,600 spent on year-end meeting at M Thumbaraguddi",
      ],
      breakdown: [
        { description: "Initial Contribution", details: "February 2021 (₹5,000 × 7 members)", amount: 35000 },
        { description: "Monthly Deposits", details: "March 2021 - November 2021 (₹1,000 × 7 members × 9 months)", amount: 63000 },
        { description: "December 2021", details: "6 members (President exempt)", amount: 6000 },
        { description: "January 2022", details: "All 7 members", amount: 7000 },
        { description: "Interest Earned", details: "Total interest for the year", amount: 8700 },
        { description: "Annual Meeting Expense", details: "Year-end meeting cost · M Thumbaraguddi", amount: -5600 },
      ],
    },
    {
      id: "d2022", year: 2022, label: "Second Year (2022-2023)", principal: 149000, interest: 33600, expenditure: 13000, balance: 169600,
      intro: "In the second year, the association continued with enhanced financial activities:",
      history: [
        "Monthly deposit increased to: ₹1,500 per member",
        "Special consideration: President exempted from December 2022 deposit",
        "Additional income: Earned ₹33,600 through interest",
        "Annual expenses: ₹13,000 spent on year-end meeting at Sampige Heritage Resort, Koppal",
      ],
      breakdown: [
        { description: "January 2022", details: "All 7 members", amount: 14000 },
        { description: "February 2022", details: "First month with new rate (₹1,500 × 7 members)", amount: 10500 },
        { description: "Monthly Deposits", details: "March 2022 - November 2022 (₹1,500 × 7 members × 9 months)", amount: 94500 },
        { description: "December 2022", details: "6 members (President exempt)", amount: 9000 },
        { description: "Monthly Deposits", details: "January 2023 - February 2023 (₹1,500 × 7 members × 2 months)", amount: 21000 },
        { description: "Interest Earned", details: "Total interest for the year", amount: 33600 },
        { description: "Annual Meeting Expense", details: "Year-end meeting cost · Sampige Heritage Resort, Koppal", amount: -13000 },
      ],
    },
    {
      id: "d2023", year: 2023, label: "Third Year (2023-2024)", principal: 159500, interest: 45700, expenditure: 17750, balance: 187450,
      intro: "In the third year, the association updated its financial structure:",
      history: [
        "Yearly renewal fee: ₹5,000 per member",
        "Monthly deposit: ₹1,500 per member",
        "Special consideration: President exempted from December 2023 deposit",
        "Additional income: Earned ₹45,700 through interest",
        "Annual expenses: ₹17,750 spent on year-end meeting at Cotton County Club, Hubballi",
      ],
      breakdown: [
        { description: "Renewal Fee", details: "March 2023 (₹5,000 × 7 members)", amount: 35000 },
        { description: "Monthly Deposits", details: "April 2023 - November 2023 (₹1,500 × 7 members × 8 months)", amount: 84000 },
        { description: "December 2023", details: "6 members (President exempt)", amount: 9000 },
        { description: "Monthly Deposits", details: "January 2024 - March 2024 (₹1,500 × 7 members × 3 months)", amount: 31500 },
        { description: "Interest Earned", details: "Total interest for the year", amount: 45700 },
        { description: "Annual Meeting Expense", details: "Year-end meeting cost · Cotton County Club, Hubballi", amount: -17750 },
      ],
    },
    {
      id: "d2024", year: 2024, label: "Fourth Year (2024-2025)", principal: 126000, interest: 57300, expenditure: 33385, balance: 149915,
      intro: "In the fourth year, the association further enhanced its financial structure:",
      history: [
        "Yearly renewal fee increased to: ₹6,000 per member",
        "Monthly deposit continued at: ₹1,500 per member",
        "Additional income: Earned ₹57,300 through interest (until November 2024)",
        "Annual expenses: ₹33,385 spent on year-end meeting at Jungle Vibes Resort, Dandeli",
      ],
      breakdown: [
        { description: "Renewal Fee", details: "April 2024 (₹6,000 × 7 members)", amount: 42000 },
        { description: "Monthly Deposits", details: "April 2024 - November 2024 (₹1,500 × 7 members × 8 months)", amount: 84000 },
        { description: "Interest Earned", details: "Total interest until November 2024", amount: 57300 },
        { description: "Annual Meeting Expense", details: "Year-end meeting cost · Jungle Vibes Resort, Dandeli", amount: -33385 },
      ],
    },
    {
      id: "d2025", year: 2025, label: "Fifth Year (2025)", principal: 149000, interest: 103350, expenditure: 20580, balance: 231770,
      intro: "In the fifth year, the association continued its financial progress:",
      history: [
        "Principal Amount: ₹1,49,000 (total monthly deposits collected)",
        "Interest Earned: ₹1,03,350 (significant growth in interest income)",
        "Expenditure: ₹20,580 (annual meeting at Sandur Wonder Valley Resort)",
        "Total Balance: ₹2,31,770 (strong financial position)",
      ],
      breakdown: [
        { description: "Monthly Deposits", details: "December 2024 (₹1,500 × 6 members)", amount: 9000 },
        { description: "Monthly Deposits", details: "January - October 2025 (₹2,000 × 7 members × 10 months)", amount: 140000 },
        { description: "Interest Earned", details: "Total interest earned on deposits", amount: 103350 },
        { description: "Annual Meeting Expense", details: "5th Year Annual Meeting (October 2025) · Sandur Wonder Valley Resort", amount: -20580 },
      ],
    },
  ],
  monthlyPayments: [
    { id: "p1", memberId: "m1", month: "2026-05", amount: 2000, status: "paid", source: "manual" },
    { id: "p2", memberId: "m2", month: "2026-05", amount: 2000, status: "paid", source: "manual" },
    { id: "p3", memberId: "m3", month: "2026-05", amount: 2000, status: "pending", source: "manual" },
    { id: "p4", memberId: "m4", month: "2026-05", amount: 2000, status: "paid", source: "manual" },
  ],
  loans: [],
  loanEmis: [],
  extensionRequests: [],
  loanRequests: [
    { id: "q1", memberId: "m7", amount: 25000, reason: "Medical support", status: "pending", date: "2026-05-14" },
  ],
  loanHistory: [],
  notifications: [],
  messages: [],
  statementRows: [],
  rules: [],
  meetingRecords: [],
  meetings: [
    {
      id: "meet5", year: 5, label: "5th Annual Meeting (2025)",
      date: "October 2025", venue: "Sandur Wonder Valley Resort",
      expenditure: 20580,
      decisions: [
        "Association extended to 10 years total (5 more years remaining)",
        "Per member share: ₹1,21,833.57 (Total balance ₹8,52,835 ÷ 7 members)",
        "New member Appanna Banakar joined — paid ₹1,34,016.93 (share + 10%). EMI option chosen: ₹7,445.38/month × 18 months starting January 2026",
        "Sarpabhushana Banakar exited — net settlement of ₹25,166 payable by member to association (loans exceeded share value)",
        "Monthly deposit continues at ₹2,000. Yearly renewal fee ₹3,000 per member from November 2025",
      ],
    },
    {
      id: "meet4", year: 4, label: "4th Annual Meeting (2024-2025)",
      date: "December 8, 2024", venue: "Jungle Vibes Resort, Dandeli",
      expenditure: 33385, decisions: [],
    },
    {
      id: "meet3", year: 3, label: "3rd Annual Meeting (2023-2024)",
      date: "April 6, 2024", venue: "Cotton County Club and Resort, Hubballi",
      expenditure: 17750, decisions: [],
    },
    {
      id: "meet2", year: 2, label: "2nd Annual Meeting (2022-2023)",
      date: "March 18, 2023", venue: "Sampige Heritage Resort, Koppal District",
      expenditure: 13000, decisions: [],
    },
    {
      id: "meet1", year: 1, label: "1st Annual Meeting (2021-2022)",
      date: "January 22, 2022", venue: "M Thumbaraguddi (Native Place)",
      expenditure: 5600, decisions: [],
    },
  ],
  audit: [
    { id: "a1", date: "2026-05-14", text: "New Banakar FinClub app created from existing data." },
  ],
};

let state = loadState();

function t(key) {
  return translations[state.lang][key] || translations.en[key] || key;
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(initialState);
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  if (liveBackendReady) {
    localStorage.setItem(`${STORAGE_KEY}-prefs`, JSON.stringify({ lang: state.lang, activeTab: state.activeTab }));
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEY}-prefs`)) || {};
  } catch {
    return {};
  }
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(normalizePhone(phone));
}

function requireValidPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!isValidPhone(normalized)) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }
  return normalized;
}

function phoneEmail(phone) {
  const normalized = normalizePhone(phone);
  if (normalized === PRESIDENT_PHONE) return PRESIDENT_EMAIL;
  return `${normalized}@${AUTH_EMAIL_DOMAIN}`;
}

async function resolveAuthEmail(phone) {
  const normalized = normalizePhone(phone);
  if (normalized === PRESIDENT_PHONE) return PRESIDENT_EMAIL;
  if (liveBackendReady) {
    const { data } = await supabaseClient.rpc("get_auth_email_for_phone", { p_phone: normalized });
    if (data) return data;
  }
  return `${normalized}@${AUTH_EMAIL_DOMAIN}`;
}

async function liveQuery(promise) {
  const { data, error } = await promise;
  if (error) throw error;
  return data;
}

async function liveOptionalList(promise) {
  const { data, error } = await promise;
  if (error) {
    console.warn("Optional live query failed:", error.message);
    return [];
  }
  return data || [];
}

function liveProfileToMember(profile) {
  return {
    id: profile.id,
    name: profile.full_name,
    phone: profile.phone,
    email: profile.email || "",
    role: profile.role,
    status: profile.status,
    authUserId: profile.auth_user_id,
    avatarUrl: profile.avatar_url || "",
    mpinHash: profile.mpin_hash || null,
    nomineeName: profile.nominee_name || "",
    nomineeRelationship: profile.nominee_relationship || "",
    nomineePhone: profile.nominee_phone || "",
  };
}

function livePaymentToLocal(payment) {
  return {
    id: payment.id,
    memberId: payment.profile_id,
    month: payment.month,
    amount: Number(payment.expected_amount || payment.paid_amount || 0),
    paidAmount: Number(payment.paid_amount || 0),
    status: payment.status,
    source: payment.source,
  };
}

function liveLoanToLocal(loan) {
  return {
    id: loan.id,
    legacyLoanId: loan.legacy_loan_id || "",
    memberId: loan.profile_id,
    memberName: loan.member_name || "",
    memberPhone: loan.member_phone || "",
    amount: Number(loan.principal || 0),
    principalPaid: Number(loan.principal_paid || 0),
    interestRateMonthly: Number(loan.interest_rate_monthly || 1.25),
    interest: Number(loan.monthly_interest || 0),
    interestPaid: Number(loan.interest_paid || 0),
    from: loan.disbursed_at,
    renewalOrReturnDate: loan.renewal_or_return_date || "",
    closedAt: loan.closed_at || "",
    status: loan.status,
    isInterestFree: Boolean(loan.is_interest_free),
    purpose: loan.purpose || "",
    notes: loan.notes || "",
    loanType: loan.loan_type || "full",
    tenureMonths: loan.tenure_months || null,
    emiAmount: Number(loan.emi_amount || 0),
    emisPaid: Number(loan.emis_paid || 0),
  };
}

function liveLoanEmiToLocal(e) {
  return {
    id: e.id, loanId: e.loan_id,
    emiNumber: e.emi_number, dueMonth: e.due_month,
    amount: Number(e.amount),
    principalPart: Number(e.principal_part),
    interestPart: Number(e.interest_part),
    status: e.status, paidAt: e.paid_at,
  };
}

function liveLoanHistoryToLocal(loan) {
  return {
    id: loan.id,
    legacyLoanId: loan.legacy_loan_id || "",
    year: loan.year || "",
    memberId: loan.profile_id,
    memberName: loan.member_name || "",
    from: loan.from_date || "",
    amount: Number(loan.principal || 0),
    interest: Number(loan.monthly_interest || 0),
    interestText: loan.interest_text || "",
    renewalOrReturn: loan.renewal_or_return || "",
    status: loan.status || "",
    totalPaid: Number(loan.total_paid || 0),
    isInterestFree: Boolean(loan.is_interest_free),
    notes: loan.notes || "",
  };
}

function liveLoanRequestToLocal(request) {
  return {
    id: request.id,
    memberId: request.profile_id,
    amount: Number(request.amount || 0),
    reason: request.reason,
    status: request.status,
    date: String(request.requested_at || "").slice(0, 10),
    loanType: request.loan_type || "full",
    tenureMonths: request.tenure_months || null,
  };
}

function liveNotificationToLocal(n) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    isRead: n.is_read,
    relatedId: n.related_id,
    createdAt: n.created_at,
  };
}

function liveMessageToLocal(m) {
  return {
    id: m.id,
    profileId: m.profile_id,
    body: m.body,
    createdAt: m.created_at,
  };
}

function liveExtensionToLocal(e) {
  return {
    id: e.id,
    loanId: e.loan_id,
    profileId: e.profile_id,
    status: e.status,
    requestedAt: e.requested_at,
    decidedAt: e.decided_at || null,
  };
}

function liveStatementToLocal(s) {
  return {
    id: s.id,
    date: s.date,
    type: s.type,
    amount: Number(s.amount),
    description: s.description,
    balance: Number(s.balance),
    relatedId: s.related_id,
    createdAt: s.created_at,
  };
}

function liveAuditToLocal(log) {
  return {
    id: log.id,
    date: String(log.created_at || "").slice(0, 10),
    text: log.details?.message || log.action,
  };
}

function currentProfileId() {
  return state.currentUserId;
}

async function addLiveAudit(message, action = "activity") {
  if (!liveBackendReady || !currentProfileId()) return;
  await liveQuery(supabaseClient.from("audit_logs").insert({
    actor_profile_id: currentProfileId(),
    action,
    details: { message },
  }));
}

async function insertStatement(type, amount, description, relatedId = null) {
  if (!liveBackendReady) return;
  const lastBalance = state.statementRows[0]?.balance || 0;
  const balance = type === "credit" ? lastBalance + amount : lastBalance - amount;
  const row = { date: today(), type, amount, description, balance, related_id: relatedId };
  await liveQuery(supabaseClient.from("statements").insert(row));
  state.statementRows.unshift(liveStatementToLocal({ ...row, id: "pending", created_at: new Date().toISOString(), related_id: relatedId }));
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
  if (!liveBackendReady || !currentProfileId()) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    const sub = subscription.toJSON();
    await supabaseClient.from("push_subscriptions").upsert(
      { profile_id: currentProfileId(), endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
      { onConflict: "profile_id,endpoint" }
    );
  } catch (_) {}
}

async function loadLiveState() {
  if (!liveBackendReady) return;
  const prefs = loadPrefs();
  let { data: authData, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !authData?.user) {
    // Access token may have simply expired while the app was idle/backgrounded.
    // Try a refresh before treating this as a real logout, so MPIN lock (not
    // full login) is what greets the member when the app wakes back up.
    const { data: refreshData, error: refreshError } = await supabaseClient.auth.refreshSession();
    if (!refreshError && refreshData?.user) {
      authData = refreshData;
      authError = null;
    }
  }
  if (authError || !authData?.user) {
    state = { ...structuredClone(initialState), ...prefs, currentUserId: null };
    return;
  }

  const [settingsRows, profiles, deposits, payments, loanRequests, loans, loanHistory, audit, notifications, rulesData, extensionRequests, messages, statementsData, loanEmisData, meetingRecordsData] = await Promise.all([
    liveQuery(supabaseClient.from("settings").select("id,value")),
    liveQuery(supabaseClient.from("profiles").select("id,full_name,phone,email,role,status,auth_user_id,avatar_url,mpin_hash,nominee_name,nominee_relationship,nominee_phone").order("created_at", { ascending: true })),
    liveQuery(supabaseClient.from("deposit_summaries").select("*").order("year", { ascending: true })),
    liveQuery(supabaseClient.from("monthly_payments").select("*").gte("month", "2025-11").order("created_at", { ascending: false })),
    liveQuery(supabaseClient.from("loan_requests").select("*").order("requested_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("current_loans").select("*").order("created_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("loan_history").select("*").order("from_date", { ascending: false }).limit(100)),
    liveQuery(supabaseClient.from("audit_logs").select("id,action,created_at,details").order("created_at", { ascending: false }).limit(20)),
    liveOptionalList(supabaseClient.from("notifications").select("*").eq("profile_id", state.currentUserId).order("created_at", { ascending: false }).limit(50)),
    liveOptionalList(supabaseClient.from("rules").select("*").order("section", { ascending: true }).order("sort_order", { ascending: true })),
    liveOptionalList(supabaseClient.from("loan_extension_requests").select("*").order("requested_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("messages").select("*").order("created_at", { ascending: true }).limit(200)),
    liveOptionalList(supabaseClient.from("statements").select("*").order("created_at", { ascending: false }).limit(200)),
    liveOptionalList(supabaseClient.from("loan_emis").select("*").order("loan_id").order("emi_number")),
    liveOptionalList(supabaseClient.from("meeting_records").select("*").order("year", { ascending: true })),
  ]);

  const settingsById = Object.fromEntries(settingsRows.map((row) => [row.id, row.value]));
  const current = profiles.find((profile) => profile.auth_user_id === authData.user.id);
  const visibleProfiles = profiles.filter((profile) => {
    if (profile.id === current?.id) return true;
    return profile.auth_user_id && !["rejected", "disabled", "exited"].includes(profile.status);
  });
  const members = visibleProfiles.map(liveProfileToMember);
  state = {
    ...structuredClone(initialState),
    ...prefs,
    settings: {
      ...initialState.settings,
      ...(settingsById.rules || {}),
      ...(settingsById.active_year_info || {}),
      bankBalance: Number(settingsById.bank_balance?.amount ?? initialState.settings.bankBalance),
      bankBalanceUpdatedAt: settingsById.bank_balance?.updatedAt || initialState.settings.bankBalanceUpdatedAt,
      loanInterestLabel: "Rs. 1.25 per Rs. 100 per month",
      bankName: "ICICI Bank",
      emiEnabled: Boolean(settingsById.emi_settings?.enabled ?? false),
      emiLoanInterestRateMonthly: Number(settingsById.emi_settings?.interestRate ?? 1.5),
    },
    currentUserId: current?.status === "active" ? current.id : null,
    members,
    allMembers: profiles.map(liveProfileToMember),
    signupRequests: profiles
      .filter((profile) => profile.status === "pending" && profile.auth_user_id)
      .map((profile) => ({ id: profile.id, name: profile.full_name, phone: profile.phone, date: String(profile.created_at || "").slice(0, 10) })),
    deposits: deposits.map((item) => ({
      id: item.id, year: item.year, label: item.label,
      principal: Number(item.principal || 0), interest: Number(item.interest || 0),
      expenditure: Number(item.expenditure || 0), balance: Number(item.balance || 0),
      exit_payouts: Number(item.exit_payouts || 0),
      breakdown: item.breakdown || null,
    })),
    meetingRecords: meetingRecordsData.map(r => ({
      id: r.id, year: r.year,
      date: r.date || "", venue: r.venue || "", notes: r.notes || "",
      decisions: Array.isArray(r.decisions) ? r.decisions : [],
      photos: Array.isArray(r.photos) ? r.photos : [],
    })),
    monthlyPayments: payments.map(livePaymentToLocal),
    loanRequests: loanRequests.map(liveLoanRequestToLocal),
    loans: loans.map(liveLoanToLocal),
    loanEmis: loanEmisData.map(liveLoanEmiToLocal),
    extensionRequests: extensionRequests.map(liveExtensionToLocal),
    messages: messages.map(liveMessageToLocal),
    loanHistory: loanHistory.map(liveLoanHistoryToLocal),
    notifications: notifications.map(liveNotificationToLocal),
    statementRows: statementsData.map(liveStatementToLocal),
    rules: rulesData.filter((r) => r.is_active !== false).map((r) => ({ id: r.id, section: r.section, item: r.item, sort_order: r.sort_order ?? 0 })),
    audit: audit.reverse().map(liveAuditToLocal),
  };

  // Cache identity + MPIN hash locally so the MPIN lock can greet the member on
  // next open even before the live session is restored.
  const activeUser = current?.status === "active" ? state.members.find((m) => m.id === current.id) : null;
  if (activeUser?.mpinHash) saveMpinIdentity(activeUser);

  // Clear payInitiated flag if this user's current month payment is already paid
  const myPayment = state.monthlyPayments.find((p) => p.memberId === state.currentUserId && p.month === currentMonth());
  if (myPayment?.status === "paid") localStorage.removeItem(`payInitiated_${currentMonth()}`);

  // Start realtime chat subscription once logged in
  initRealtimeChat();
  subscribeToPush();

  // Persist available loan amount so SQL cron notifications can read it
  const available = Math.max(0, expectedBankBalance() - Number(state.settings.minimumReserve || 5000));
  supabaseClient.from("settings").upsert({ id: "available_loan_balance", value: { amount: available } }).then(() => {});
}

function money(value) {
  const number = Number(value || 0);
  const prefix = number < 0 ? "-₹" : "₹";
  return prefix + Math.abs(number).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function parseRupeeAmount(value) {
  const normalized = String(value || "").replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return NaN;
  return Math.round(Number(normalized));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function uid(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function currentUser() {
  return state.members.find((member) => member.id === state.currentUserId) || null;
}

function isAdmin(member = currentUser()) {
  return member && member.role === "president" && member.status === "active";
}

function backendLabel() {
  return liveBackendReady ? t("liveMode") : t("demoMode");
}

function memberById(id) {
  const pool = state.allMembers?.length ? state.allMembers : state.members;
  return pool.find((member) => member.id === id);
}

function activeMembers() {
  return state.members.filter((member) => member.status === "active");
}

function depositMembers() {
  const pool = state.allMembers?.length ? state.allMembers : state.members;
  return pool.filter((member) => member.status === "active" && member.role !== "onboarding");
}

function roleLabel(role) {
  const labels = {
    president: "President",
    vice_president: "Vice President",
    member: "Member",
    onboarding: "Onboarding",
  };
  return labels[role] || "Member";
}

function expectedMonthlyDeposit(member, month = currentMonth()) {
  const monthNumber = Number(month.slice(5, 7));
  if (monthNumber !== 12) return state.settings.monthlyDeposit;
  if (member.role === "president") return state.settings.presidentDecemberDeposit;
  if (member.role === "vice_president") return state.settings.vicePresidentDecemberDeposit;
  return state.settings.monthlyDeposit;
}

function loanOutstanding(loan) {
  if (loan.loanType === "emi") {
    const principalPerEmi = loan.amount / (loan.tenureMonths || 1);
    return Math.max(0, loan.amount - principalPerEmi * loan.emisPaid);
  }
  return Math.max(0, Number(loan.amount) - Number(loan.principalPaid || 0));
}

function calcEmi(principal, tenureMonths) {
  const r = Number(state.settings.emiLoanInterestRateMonthly || 1.5) / 100;
  const emiAmount = Math.round(principal * (1 + r * tenureMonths) / tenureMonths);
  const principalPart = Math.round(principal / tenureMonths);
  const interestPart = emiAmount - principalPart;
  return { emiAmount, principalPart, interestPart };
}

function loanMonthlyInterest(loan) {
  if (loan.status === "interest_free" || loan.isInterestFree) return 0;
  if (Number(loan.interest) > 0) return Number(loan.interest);
  return (loanOutstanding(loan) * Number(loan.interestRateMonthly || state.settings.loanInterestRateMonthly)) / 100;
}

function loanBaseMonthlyInterest(loan) {
  if (loan.status === "interest_free" || loan.isInterestFree) return 0;
  if (Number(loan.interest) > 0) return Number(loan.interest);
  return (Number(loan.amount || 0) * Number(loan.interestRateMonthly || state.settings.loanInterestRateMonthly)) / 100;
}

function yr6InterestMonths(loan) {
  if (!loan.from) return 0;
  const loanDate = new Date(loan.from);
  const interestStart = new Date(loanDate.getFullYear(), loanDate.getMonth() + 1, 1);
  const yr6StartDate = new Date("2025-11-01");
  const effectiveStart = interestStart > yr6StartDate ? interestStart : yr6StartDate;
  // Cap at May 2026 — June+ interest comes from actual monthly_payments records
  const now = new Date(Math.min(new Date().getTime(), new Date(2026, 4, 31).getTime()));
  if (now < effectiveStart) return 0;
  return Math.max(0, (now.getFullYear() - effectiveStart.getFullYear()) * 12 + (now.getMonth() - effectiveStart.getMonth()) + 1);
}

function year6InterestCollected() {
  return currentLoans()
    .filter((l) => l.notes !== "emi_entry")
    .reduce((sum, loan) => sum + yr6InterestMonths(loan) * loanBaseMonthlyInterest(loan), 0);
}

function monthDiff(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 0;
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(1, months);
}

function calculatedInterestPaid(loan, clearDate = today()) {
  return loanBaseMonthlyInterest(loan) * monthDiff(loan.from, clearDate);
}

// Interest earned on a loan during a specific year, bounded by yearStart.
// Counts from the later of (loan disbursed + 1 month) or yearStart, up to atDate.
function yearBoundedInterest(loan, yearStart, atDate) {
  if (loan.notes === "emi_entry" || Number(loan.interestRateMonthly) > 3) return 0;
  const loanDate = loan.from ? new Date(loan.from) : null;
  if (!loanDate || isNaN(loanDate.getTime())) return 0;
  const interestFrom = new Date(loanDate.getFullYear(), loanDate.getMonth() + 1, 1);
  const yrStartDate = new Date(yearStart);
  const effectiveFrom = interestFrom > yrStartDate ? interestFrom : yrStartDate;
  const effectiveTo = new Date(atDate);
  if (effectiveTo <= effectiveFrom) return 0;
  const months = (effectiveTo.getFullYear() - effectiveFrom.getFullYear()) * 12
    + (effectiveTo.getMonth() - effectiveFrom.getMonth()) + 1;
  return Math.max(0, Math.round(months * loanBaseMonthlyInterest(loan)));
}

function loanRenewalDate(loan) {
  return loan.renewalOrReturnDate || "";
}

function loanMemberName(loan) {
  return loan.memberName || memberById(loan.memberId)?.name || "-";
}

function loanBelongsToMember(loan, member) {
  if (!loan || !member) return false;
  if (loan.memberId && loan.memberId === member.id) return true;
  const loanPhone = normalizePhone(loan.memberPhone);
  return Boolean(loanPhone && loanPhone === normalizePhone(member.phone));
}

function isCurrentLoan(loan) {
  return loan.status === "active" && loanOutstanding(loan) > 0;
}

function isLoanDueThisMonth(loan) {
  const renewal = loanRenewalDate(loan);
  return Boolean(renewal && renewal.slice(0, 7) === currentMonth());
}

function loanExtensionStatus(loanId) {
  const ext = (state.extensionRequests || []).find((e) => e.loanId === loanId);
  return ext ? { status: ext.status, id: ext.id } : null;
}

function currentLoans() {
  return state.loans.filter(isCurrentLoan);
}

function currentLoanBookRows() {
  return state.loans;
}

function memberLoans(memberId) {
  const member = memberById(memberId);
  return currentLoans().filter((loan) => loanBelongsToMember(loan, member));
}

function memberOutstanding(memberId) {
  return memberLoans(memberId).reduce((sum, loan) => sum + loanOutstanding(loan), 0);
}

function memberMonthlyInterest(memberId) {
  return memberLoans(memberId)
    .filter((l) => l.notes !== "emi_entry" && l.loanType !== "emi")
    .reduce((sum, loan) => sum + loanMonthlyInterest(loan), 0);
}

function latestHistoricalBalance() {
  return state.deposits.reduce((latest, item) => (item.year > latest.year ? item : latest), state.deposits[0]).balance;
}

function groupStats() {
  const baseBalance = expectedBankBalance();
  const loanPrincipalOutstanding = currentLoans()
    .filter((l) => l.notes !== "emi_entry")
    .reduce((sum, loan) => sum + loanOutstanding(loan), 0);
  const currentInterestDue = currentLoans()
    .filter((l) => l.notes !== "emi_entry")
    .reduce((sum, loan) => sum + loanMonthlyInterest(loan), 0);
  const availableBalance = baseBalance - loanPrincipalOutstanding;
  return { baseBalance, loanPrincipalOutstanding, currentInterestDue, availableBalance };
}

function bankBalance() {
  return Number(state.settings.bankBalance ?? latestHistoricalBalance());
}

function closedYearsBasePool() {
  return state.deposits.reduce((sum, d) => sum + Number(d.balance || 0), 0);
}

function activeYearCutoffMonth() {
  return state.settings.activeYearStart || "2026-07";
}

function expectedBankBalance() {
  return state.statementRows[0]?.balance || 0;
}

function availableLoanAmount() {
  return Math.max(0, expectedBankBalance() - Number(state.settings.minimumReserve || 5000));
}

function currentMonthPayment(memberId) {
  return state.monthlyPayments.find((payment) => payment.memberId === memberId && payment.month === currentMonth());
}

function memberEmiMonthly(member) {
  // New generalised EMI loans (loan_type = 'emi')
  const emiLoans = state.loans.filter(l =>
    l.loanType === "emi" && l.status === "active" && loanBelongsToMember(l, member)
  );
  const newEmi = emiLoans.reduce((sum, loan) => {
    const nextEmi = state.loanEmis.find(e => e.loanId === loan.id && e.status === "pending");
    return sum + (nextEmi ? nextEmi.amount : 0);
  }, 0);
  // Legacy: Appanna's hardcoded EMI (notes === 'emi_entry')
  if (newEmi === 0) {
    const legacyLoan = state.loans.find(l => l.notes === "emi_entry" && loanBelongsToMember(l, member));
    if (legacyLoan && legacyLoan.status === "active") {
      const prog = appannaEmiProgress();
      return prog.remaining > 0 ? Math.round(prog.monthlyEmi) : 0;
    }
  }
  return newEmi;
}

function memberMonthlyDue(member) {
  return expectedMonthlyDeposit(member) + memberMonthlyInterest(member.id) + memberEmiMonthly(member);
}

// Splits a member's paid amount into deposit (principal) and interest correctly.
// Regular deposit + EMI principal → deposit; regular loan interest + EMI interest → interest.
function paymentSplit(mem, month, paidAmount) {
  // Legacy Appanna EMI — entire payment is deposit, no interest extracted
  // Use notes OR high interest rate (>3%/mo = EMI) as the EMI indicator, since notes may be NULL after DB resets
  const hasLegacyEmi = state.loans.some(l => (l.notes === "emi_entry" || Number(l.interestRateMonthly) > 3) && loanBelongsToMember(l, mem));
  if (hasLegacyEmi) return { dep: paidAmount, interest: 0 };

  const baseDep = expectedMonthlyDeposit(mem, month);

  // New EMI loans — pull principal part from loan_emis for this month
  const emiLoans = state.loans.filter(l => l.loanType === "emi" && l.status === "active" && loanBelongsToMember(l, mem));
  let emiPrincipal = 0;
  for (const loan of emiLoans) {
    const emiRow = state.loanEmis.find(e => e.loanId === loan.id && e.dueMonth === month);
    if (emiRow) emiPrincipal += Number(emiRow.principalPart || 0);
  }

  const dep = baseDep + emiPrincipal;
  return { dep, interest: Math.max(0, paidAmount - dep) };
}

function groupMonthlyDepositDue() {
  return depositMembers().reduce((sum, member) => sum + expectedMonthlyDeposit(member), 0);
}

function groupMonthlyDue() {
  return groupMonthlyDepositDue() + groupStats().currentInterestDue;
}

function latestLoanRequest(memberId) {
  return state.loanRequests
    .filter((request) => request.memberId === memberId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))[0];
}

function renderNotificationPanel() {
  document.querySelector(".notif-panel-wrap")?.remove();
  const items = (state.notifications || []);
  const wrap = document.createElement("div");
  wrap.className = "notif-panel-wrap";
  wrap.innerHTML = `
    <div class="notif-overlay" data-action="close-notifications"></div>
    <div class="notif-panel">
      <div class="notif-panel-header">
        <h3>Notifications</h3>
        <button class="icon-button" type="button" data-action="close-notifications" style="min-height:34px;min-width:34px;">✕</button>
      </div>
      <div class="notif-list">
        ${items.length ? items.map((n) => `
          <div class="notif-item ${n.isRead ? "" : "unread"}">
            <div class="notif-content">
              <strong>${escapeHtml(n.title)}</strong>
              <span>${escapeHtml(n.body)}</span>
            </div>
            <small class="notif-time">${timeAgo(n.createdAt)}</small>
          </div>
        `).join("") : `<div class="empty">No notifications yet.</div>`}
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
  requestAnimationFrame(() => wrap.classList.add("open"));
}

async function openNotifications() {
  renderNotificationPanel();
  const unreadIds = (state.notifications || []).filter((n) => !n.isRead).map((n) => n.id);
  if (unreadIds.length === 0) return;
  state.notifications.forEach((n) => { n.isRead = true; });
  document.querySelector(".notif-badge")?.remove();
  if (liveBackendReady) {
    await supabaseClient.from("notifications").update({ is_read: true }).in("id", unreadIds);
  }
}

function closeNotificationPanel() {
  const wrap = document.querySelector(".notif-panel-wrap");
  if (!wrap) return;
  wrap.classList.remove("open");
  setTimeout(() => wrap.remove(), 220);
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => toast.classList.remove("show"), 2400);
  setTimeout(() => toast.remove(), 2800);
}

function bellIcon() {
  return `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
}

function unreadCount() {
  return (state.notifications || []).filter((n) => !n.isRead).length;
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function eyeIcon(hidden) {
  return hidden
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

function passwordField(name, label, placeholder = "") {
  return `
    <label class="field">
      <span>${label}</span>
      <div class="input-wrapper">
        <input name="${name}" type="password" ${placeholder ? `placeholder="${placeholder}"` : ""} required />
        <button type="button" class="eye-btn" data-action="toggle-password" aria-label="Toggle password visibility">${eyeIcon(true)}</button>
      </div>
    </label>
  `;
}

function setFormLoading(form, loading) {
  const btn = form.querySelector("button.primary[type='submit']");
  if (!btn) return;
  if (loading) {
    btn.disabled = true;
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = `<span class="btn-loading"><span class="spinner"></span>Loading…</span>`;
  } else {
    btn.disabled = false;
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const _EYE_OPEN  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const _EYE_SLASH = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function bfcToggleBal(key) {
  const isVis = sessionStorage.getItem("bfc_bal_" + key) === "1";
  const next = !isVis;
  sessionStorage.setItem("bfc_bal_" + key, next ? "1" : "0");
  const valEl = document.querySelector(`.bal-val[data-bal-key="${key}"]`);
  const btnEl = document.querySelector(`.bal-eye[data-bal-key="${key}"]`);
  if (valEl) valEl.textContent = next ? money(Number(valEl.dataset.bal)) : "₹ ••••";
  if (btnEl) btnEl.innerHTML = next ? _EYE_OPEN : _EYE_SLASH;
}

function render() {
  document.body.classList.toggle("kannada", state.lang === "kn");
  const user = currentUser();
  // MPIN gate wins over the login screen: if an MPIN is pending and we know who
  // the member is (live session OR cached identity), show the MPIN lock — not
  // the full phone+password login.
  if (mpinPending && (user || mpinIdentity())) {
    renderMpinScreen();
    return;
  }
  if (!user) {
    clearTimeout(idleTimer);
    renderAuth("login");
    return;
  }
  resetIdleTimer();

  const openDetails = new Set(
    [...document.querySelectorAll("details.collapsible[open]")].map((el) => el.querySelector("h3")?.textContent?.trim())
  );

  document.querySelector("#app").innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="user-chip" data-action="open-profile" style="cursor:pointer;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:5px 10px 5px 5px;" title="View Profile">
            ${memberAvatarHtml(user)}
            <div>
              <strong>${escapeHtml(user.name)}</strong>
              <span>${escapeHtml(roleLabel(user.role))}</span>
              <span style="font-size:10px;color:#F59E0B;letter-spacing:0.2px;">Edit Profile ›</span>
            </div>
          </div>
          <div class="top-actions">
            <span class="mode-badge ${liveBackendReady ? "live" : "demo"}">${backendLabel()}</span>
            <button class="icon-button" type="button" data-action="toggle-lang">${t("language")}</button>
            <button class="icon-button notif-bell-btn" type="button" data-action="open-notifications" aria-label="Notifications">
              ${bellIcon()}
              ${unreadCount() > 0 ? `<span class="notif-badge">${unreadCount() > 9 ? "9+" : unreadCount()}</span>` : ""}
            </button>
            <button class="icon-button" type="button" data-action="logout" title="${t("logout")}">⎋</button>
          </div>
        </div>
      </header>
      <main class="content">
        ${renderTab()}
      </main>
      <nav class="nav" aria-label="App navigation">
        ${navButton("dashboard", "⌂", t("dashboard"))}
        ${navButton("deposits", "₹", t("deposits"))}
        ${navButton("loans", "⇄", t("loans"))}
        ${navButton("members", "☷", t("members"))}
        ${navButton("meetings", "◎", t("meetings"))}
        ${isAdmin() ? navButton("admin", "⚙", t("admin")) : navButton("history", "📅", "Meetings")}
      </nav>
    </div>
  `;

  if (openDetails.size > 0) {
    document.querySelectorAll("details.collapsible").forEach((el) => {
      const title = el.querySelector("h3")?.textContent?.trim();
      if (title && openDetails.has(title)) el.open = true;
    });
  }

  // renderChatFab();
  renderAiFab();
  requestAnimationFrame(runPageAnimations);
}

function runPageAnimations() {
  document.querySelectorAll("[data-count-up]").forEach((el) => {
    const target = parseFloat(el.dataset.countUp);
    if (isNaN(target) || target <= 0) return;
    const duration = 900;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = money(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function memberAvatarHtml(member, size = "") {
  const cls = `avatar${size ? " avatar-" + size : ""}`;
  if (member?.avatarUrl) {
    return `<img src="${escapeHtml(member.avatarUrl)}" class="${cls} avatar-photo" alt="${escapeHtml(member?.name || "")}" />`;
  }
  return `<div class="${cls}">${initials(member?.name || "?")}</div>`;
}

async function compressImage(file, maxDim = 400, quality = 0.85) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width: w, height: h } = img;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(resolve, "image/jpeg", quality);
    };
    img.src = url;
  });
}

async function uploadAvatarPhoto(file, profileId) {
  const blob = await compressImage(file, 400, 0.85);
  const path = `${profileId}.jpg`;
  const { error } = await supabaseClient.storage.from("Avatars").upload(path, blob, { upsert: true, contentType: "image/jpeg" });
  if (error) throw error;
  const { data } = supabaseClient.storage.from("Avatars").getPublicUrl(path);
  const url = data.publicUrl;
  await liveQuery(supabaseClient.from("profiles").update({ avatar_url: url }).eq("id", profileId));
  return url;
}

async function handleAvatarUpload(file) {
  if (!liveBackendReady || !currentProfileId()) return;
  try {
    showToast("Uploading photo…");
    const url = await uploadAvatarPhoto(file, currentProfileId());
    const member = state.members.find(m => m.id === currentProfileId());
    if (member) member.avatarUrl = url;
    render();
    showToast("Profile photo updated!");
  } catch (e) {
    showToast("Upload failed: " + (e.message || "try again"));
  }
}

function navButton(tab, icon, label) {
  return `<button class="${state.activeTab === tab ? "active" : ""}" type="button" data-tab="${tab}"><span>${icon}</span><span>${label}</span></button>`;
}

function renderAuth(mode) {
  const authMode = mode === "reset" ? "reset" : mode === "signup" ? "signup" : "login";
  const modeLabels = { login: t("signIn"), signup: t("signUp") };
  document.querySelector("#app").innerHTML = `
    <div class="auth-page">
      <section class="auth-hero">
        <div class="brand-row">
          <div class="brand-logo"><img src="icon.svg" alt="Banakar FinClub logo" /></div>
          <div>
            <h1>Banakar FinClub</h1>
            <p>${t("privateClub")}</p>
          </div>
        </div>
        <div class="auth-copy">
          <h2>${t("loginTitle")}</h2>
          <p>${t("loginCopy")}</p>
        </div>
      </section>
      <section class="auth-card">
        <div class="segmented">
          ${["login", "signup"].map((item) => `<button class="${authMode === item ? "active" : ""}" type="button" data-auth-mode="${item}">${modeLabels[item]}</button>`).join("")}
        </div>
        ${authMode === "login" ? loginForm() : authMode === "signup" ? signupForm() : resetForm()}
      </section>
    </div>
  `;
}

// ── MPIN helpers ─────────────────────────────────────────────────────────────

let mpinPending = false;
let mpinEntry = "";

// Locally-cached identity so the MPIN lock works even before the live Supabase
// session has been restored (e.g. reopening the app after days). Holds just
// enough to show + verify MPIN offline, then restore the session in background.
const MPIN_IDENTITY_KEY = "bfc_mpin_identity";
function mpinIdentity() {
  try { return JSON.parse(localStorage.getItem(MPIN_IDENTITY_KEY)); } catch (_) { return null; }
}
function saveMpinIdentity(member) {
  if (!member?.mpinHash) return;
  localStorage.setItem(MPIN_IDENTITY_KEY, JSON.stringify({
    userId: member.id, name: member.name, phone: member.phone, mpinHash: member.mpinHash,
  }));
}
function clearMpinIdentity() { localStorage.removeItem(MPIN_IDENTITY_KEY); }

async function hashMpin(pin) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pin + "_bfc"));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function mpinSet() { return !!(currentUser()?.mpinHash || mpinIdentity()?.mpinHash); }
async function saveMpin(pin) {
  const hash = await hashMpin(pin);
  await liveQuery(supabaseClient.from("profiles").update({ mpin_hash: hash }).eq("id", state.currentUserId));
  const member = state.members.find(m => m.id === state.currentUserId);
  if (member) { member.mpinHash = hash; saveMpinIdentity(member); }
}
async function validateMpin(pin) {
  const hash = await hashMpin(pin);
  return hash === currentUser()?.mpinHash || hash === mpinIdentity()?.mpinHash;
}
async function clearMpin() {
  await liveQuery(supabaseClient.from("profiles").update({ mpin_hash: null }).eq("id", state.currentUserId));
  const member = state.members.find(m => m.id === state.currentUserId);
  if (member) member.mpinHash = null;
  clearMpinIdentity();
}

function loginForm() {
  return `
    <form class="form" data-form="login">
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" inputmode="tel" required /></label>
      ${passwordField("password", t("password"), liveBackendReady ? "" : "123456")}
      <button class="primary" type="submit">${t("signIn")}</button>
      <button class="text-link" type="button" data-auth-mode="reset">${t("forgotPassword")}?</button>
      <p class="hint">${liveBackendReady ? "Live backend is configured." : "Demo admin: 9591382942 / 123456. Add Supabase details in config.js to connect live data."}</p>
    </form>
  `;
}

function signupForm() {
  return `
    <form class="form" data-form="signup">
      <div class="avatar-picker-wrap">
        <label class="avatar-pick-label" for="signup-avatar">
          <span class="avatar-pick-placeholder">📷<br/><small>Add photo<br/>(optional)</small></span>
        </label>
        <input type="file" id="signup-avatar" name="avatar" accept="image/*" style="display:none;" />
      </div>
      <label class="field"><span>${t("name")}</span><input name="name" type="text" required /></label>
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" required /></label>
      <label class="field"><span>Email</span><input name="email" type="email" required /></label>
      ${passwordField("password", t("password"))}
      <button class="primary" type="submit">${t("requestAccess")}</button>
      <p class="hint">Signup requests stay pending until the president approves them.</p>
    </form>
  `;
}

function resetForm() {
  return `
    <form class="form" data-form="reset">
      <label class="field"><span>Phone or Email</span><input name="phone_or_email" type="text" inputmode="text" autocomplete="email" placeholder="10-digit phone or email" required /></label>
      <button class="primary" type="submit">${t("forgotPassword")}</button>
      <p class="hint">${liveBackendReady ? "A password reset link will be sent to your registered email." : "Demo mode records a reset request for admin follow-up."}</p>
    </form>
  `;
}

function renderSetNewPassword() {
  document.querySelector("#app").innerHTML = `
    <div class="auth-page">
      <section class="auth-hero">
        <div class="brand-row">
          <div class="brand-logo"><img src="icon.svg" alt="Banakar FinClub logo" /></div>
          <div>
            <h1>Banakar FinClub</h1>
            <p>${t("privateClub")}</p>
          </div>
        </div>
      </section>
      <section class="auth-card">
        <h3 style="margin-bottom:16px;">Set new password</h3>
        <form class="form" data-form="set-new-password">
          ${passwordField("password", "New password")}
          <button class="primary" type="submit">Set password</button>
          <p class="hint">Password must be at least 6 characters.</p>
        </form>
      </section>
    </div>
  `;
}

function renderTab() {
  const tabs = {
    dashboard: renderDashboard,
    deposits: renderDeposits,
    loans: renderLoans,
    members: renderMembers,
    meetings: renderMeetings,
    admin: renderAdmin,
    statement: renderStatement,
    history: renderHistory,
    profile: renderProfile,
  };
  return (tabs[state.activeTab] || renderDashboard)();
}

function renderDashboard() {
  const user = currentUser();
  const monthlyDue = memberMonthlyDue(user);
  const monthlyPayment = currentMonthPayment(user.id);
  const ownDeposit = expectedMonthlyDeposit(user);
  const ownInterest = memberMonthlyInterest(user.id);
  const request = latestLoanRequest(user.id);
  const approvalCount = state.signupRequests.length + state.loanRequests.filter((item) => item.status === "pending").length;
  const dashboardMetrics = [
    metric(t("bankBalance"), money(expectedBankBalance()), `Estimated · deposits + interest − loans`),
    metric(t("availableLoan"), money(availableLoanAmount()), `Bank balance - ${money(state.settings.minimumReserve || 5000)} reserve`),
    metric(t("monthlyDue"), money(monthlyDue), `${statusText(monthlyPayment?.status || "pending")} · deposit ${money(ownDeposit)} + interest ${money(ownInterest)}`),
    metric(t("outstandingLoans"), money(memberOutstanding(user.id)), "Your outstanding principal"),
  ];
  if (isAdmin()) {
    dashboardMetrics.push(metric(t("pendingApprovals"), String(approvalCount), "Signup and loan requests"));
  } else {
    dashboardMetrics.push(metric(t("loanRequestStatus"), statusText(request?.status || "none"), request ? `${money(request.amount)} · ${escapeHtml(request.date || "-")}` : "No loan request"));
  }
  const initials = (user.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const greeting = (() => { const h = new Date().getHours(); return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening"; })();
  const paymentStatus = monthlyPayment?.status || "pending";
  const payInitiated = localStorage.getItem(`payInitiated_${currentMonth()}`) === "1";
  const bankBal = expectedBankBalance();
  const availLoan = availableLoanAmount();
  const poolBal = currentLoans().filter(l => l.notes !== "emi_entry").reduce((s, l) => s + loanOutstanding(l), 0) + bankBal;

  const tiles = [
    { icon: "🐷", title: "DEPOSITS", sub: "Monthly savings & year records", tab: "deposits" },
    (() => {
      const myEmiLoan = currentLoanBookRows().find(l => loanBelongsToMember(l, user) && l.loanType === "emi" && l.status === "active");
      if (myEmiLoan) return { icon: "💳", title: "LOANS", sub: `EMI Loan · ${myEmiLoan.emisPaid}/${myEmiLoan.tenureMonths} paid · ${money(myEmiLoan.emiAmount)}/mo`, action: "show-loans" };
      const myLegacyEmi = state.loans.find(l => l.notes === "emi_entry" && loanBelongsToMember(l, user) && l.status === "active");
      if (myLegacyEmi) {
        const prog = appannaEmiProgress();
        return { icon: "💳", title: "LOANS", sub: `EMI · ${prog.paid}/${prog.totalMonths} paid · ${money(prog.monthlyEmi)}/mo`, action: "show-loans" };
      }
      return { icon: "💳", title: "LOANS", sub: "View your loan details", action: "show-loans" };
    })(),
    { icon: "👥", title: "MEMBERS", sub: "Association members", tab: "members" },
    { icon: "📊", title: "DASHBOARD", sub: "Association analytics", tab: "meetings" },
    { icon: "📒", title: "STATEMENT", sub: "Transaction history & balances", tab: "statement" },
    { icon: "📜", title: "RULES", sub: "Association guidelines", action: "show-rules" },
    isAdmin()
      ? { icon: "📅", title: "MEETINGS", sub: "Annual meeting records & photos", tab: "history" }
      : null,
    isAdmin()
      ? { icon: "⚙️", title: "ADMIN", sub: "Settings & approvals" + (approvalCount > 0 ? ` · ${approvalCount} pending` : ""), tab: "admin" }
      : { icon: "👤", title: "MY ACCOUNT", sub: "Deposits & loan status", tab: "members" },
  ].filter(Boolean);

  return `
    <section class="dash-hero">
      <div class="dash-greeting">
        <p>${greeting}</p>
        <h2>${escapeHtml(user.name || "Member")}</h2>
      </div>
    </section>

    <section class="dash-tiles">
      ${tiles.map(tile => `
        <div class="dash-tile dash-tile-clickable"
          ${tile.action ? `data-action="${tile.action}"` : ""}
          ${tile.tab ? `data-tab="${tile.tab}"` : ""}>
          <div class="dash-tile-body">
            <span class="tile-icon">${tile.icon}</span>
            <div>
              <strong>${escapeHtml(tile.title)}</strong>
              <p>${escapeHtml(tile.sub)}</p>
            </div>
          </div>
          <span class="tile-chevron">›</span>
        </div>`).join("")}
    </section>

    <div class="dash-summary-card">
      <div class="dash-summary-top">
        <div class="dash-summary-brand">
          <span class="dash-summary-dot">●</span>
          <div>
            <p class="dash-summary-label">Banakar FinClub · Year 6 of 10</p>
            <p class="dash-summary-sub">Sri Mukkanneshwara Associate</p>
          </div>
        </div>
        <span class="badge warn">Active</span>
      </div>
      <div class="dash-summary-grid">
        <div class="dash-summary-col">
          <p>Pool Balance</p>
          <div class="bal-row">
            <strong class="bal-val" data-bal-key="pool" data-bal="${poolBal}">₹ ••••</strong>
            <button class="bal-eye" data-bal-key="pool" onclick="bfcToggleBal('pool')" aria-label="Toggle pool balance">${_EYE_SLASH}</button>
          </div>
          <small>Total association pool</small>
        </div>
        <div class="dash-summary-col">
          <p>Bank Balance</p>
          <div class="bal-row">
            <strong class="bal-val" data-bal-key="bank" data-bal="${bankBal}">₹ ••••</strong>
            <button class="bal-eye" data-bal-key="bank" onclick="bfcToggleBal('bank')" aria-label="Toggle bank balance">${_EYE_SLASH}</button>
          </div>
          <small>Estimated</small>
        </div>
        <div class="dash-summary-col">
          <p>Available Loan</p>
          <div class="bal-row">
            <strong class="bal-val" data-bal-key="loan" data-bal="${availLoan}">₹ ••••</strong>
            <button class="bal-eye" data-bal-key="loan" onclick="bfcToggleBal('loan')" aria-label="Toggle available loan">${_EYE_SLASH}</button>
          </div>
          <small>For new loans</small>
        </div>
        <div class="dash-summary-col">
          <p>Monthly Due</p>
          <strong data-count-up="${monthlyDue}">${money(monthlyDue)}</strong>
          ${paymentStatus === "paid"
            ? `<small style="color:#4ade80;font-weight:700;">✓ Paid</small>`
            : payInitiated
              ? `<small class="awaiting-label">⏳ Awaiting approval</small>`
              : `<button class="pay-now-btn" data-action="pay-now" data-amount="${monthlyDue}">Pay Now</button>`}
        </div>
      </div>
    </div>

    <section style="margin-top:14px;">
      <div class="card">
        <div class="card-header">
          <div><h3>🏛️ About Our Association</h3><p>Sri Mukkanneshwara Associate · Est. February 2021</p></div>
        </div>
        <div class="card-body">
          <p class="assoc-intro">A private member finance association by the Banakar family — pooling monthly deposits, earning interest, and providing low-interest loans to build a shared financial future.</p>
          <div class="row-list" style="margin-top:10px;">
            <div class="row-item"><div><strong>Founded</strong><span>February 2021</span></div></div>
            <div class="row-item"><div><strong>Active members</strong><span>7 (after 1 exit in Year 5)</span></div></div>
            <div class="row-item"><div><strong>Monthly deposit</strong><span>₹2,000 per member · ₹14,000 total</span></div></div>
            <div class="row-item"><div><strong>Duration</strong><span>10 years total · Year 6 of 10</span></div></div>
          </div>
        </div>
      </div>

    </section>
  `;
}

function renderProfile() {
  const user = currentUser();
  if (!user) return "";
  const relationships = ["Spouse", "Son", "Daughter", "Father", "Mother", "Brother", "Sister", "Other"];
  const hasNominee = !!user.nomineeName;
  return `
    <style>
      .prof-hero {
        margin: -14px -12px 20px;
        padding: 36px 24px 52px;
        background: linear-gradient(150deg, #0F172A 0%, #1E3A8A 55%, #1D4ED8 100%);
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      .prof-hero::before {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 70% 0%, rgba(96,165,250,0.18) 0%, transparent 60%);
        pointer-events: none;
      }
      .prof-av-ring {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 104px;
        height: 104px;
        border-radius: 50%;
        background: linear-gradient(135deg, #F59E0B, #D97706);
        padding: 3px;
        margin-bottom: 14px;
        position: relative;
      }
      .prof-av-inner {
        width: 98px;
        height: 98px;
        border-radius: 50%;
        overflow: hidden;
        background: linear-gradient(135deg, #2563EB, #1D4ED8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        font-weight: 900;
        color: white;
        flex-shrink: 0;
      }
      .prof-av-inner img { width: 100%; height: 100%; object-fit: cover; }
      .prof-cam-lbl {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 30px;
        height: 30px;
        background: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        border: 2px solid #EFF6FF;
      }
      .prof-hero-name {
        margin: 0 0 8px;
        font-size: 22px;
        font-weight: 800;
        color: #fff;
        letter-spacing: -0.2px;
      }
      .prof-hero-badge {
        display: inline-block;
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.22);
        color: rgba(255,255,255,0.88);
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        padding: 4px 12px;
        border-radius: 999px;
      }
      .prof-cards { display: grid; gap: 14px; }
      .prof-card {
        background: var(--panel);
        border: 1px solid rgba(229,231,235,0.9);
        border-radius: 16px;
        box-shadow: var(--shadow);
        overflow: hidden;
        animation: fadeInUp 0.28s ease-out both;
      }
      .prof-card:nth-child(1) { animation-delay: 40ms; }
      .prof-card:nth-child(2) { animation-delay: 90ms; }
      .prof-card:nth-child(3) { animation-delay: 140ms; }
      .prof-card-head {
        padding: 14px 16px;
        border-bottom: 1px solid rgba(229,231,235,0.7);
        border-left: 3px solid var(--prof-accent, #2563EB);
      }
      .prof-card-head h3 { margin: 0; font-size: 15px; font-weight: 800; color: var(--ink); }
      .prof-card-head p  { margin: 3px 0 0; font-size: 11px; color: var(--muted); font-weight: 500; }
      .prof-card-body { padding: 16px; display: flex; flex-direction: column; gap: 13px; }
      .prof-field label {
        display: block;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        color: var(--muted);
        margin-bottom: 5px;
      }
      .prof-field input,
      .prof-field select {
        width: 100%;
        min-height: 46px;
        border: 1.5px solid #E5E7EB;
        border-radius: 10px;
        background: #F9FAFB;
        color: var(--ink);
        padding: 11px 13px;
        font-size: 14px;
        transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
      }
      .prof-field input:focus,
      .prof-field select:focus {
        outline: none;
        border-color: #2563EB;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
      }
      .prof-btn {
        width: 100%;
        min-height: 48px;
        border: none;
        border-radius: 12px;
        font-weight: 800;
        font-size: 15px;
        letter-spacing: 0.2px;
        cursor: pointer;
        transition: transform 0.14s, box-shadow 0.14s;
        margin-top: 2px;
      }
      .prof-btn:hover  { transform: translateY(-1px); }
      .prof-btn:active { transform: scale(0.97); }
      .prof-btn-blue {
        background: linear-gradient(135deg, #2563EB, #1D4ED8);
        color: #fff;
        box-shadow: 0 4px 14px rgba(37,99,235,0.32);
      }
      .prof-btn-blue:hover  { box-shadow: 0 6px 22px rgba(37,99,235,0.42); }
      .prof-btn-gold {
        background: linear-gradient(135deg, #D97706, #B45309);
        color: #fff;
        box-shadow: 0 4px 14px rgba(180,83,9,0.28);
      }
      .prof-btn-gold:hover  { box-shadow: 0 6px 22px rgba(180,83,9,0.38); }
      .prof-btn-dark {
        background: linear-gradient(135deg, #374151, #1C1C2E);
        color: #fff;
        box-shadow: 0 4px 14px rgba(28,28,46,0.22);
      }
      .prof-btn-dark:hover  { box-shadow: 0 6px 22px rgba(28,28,46,0.32); }
      .prof-nominee-card { background: linear-gradient(160deg, #FFFBEB 0%, #FEF3C7 100%); border-color: #FDE68A; }
      .prof-nominee-status {
        padding: 9px 13px;
        border-radius: 9px;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 7px;
      }
      .prof-nominee-status.set   { background: rgba(5,150,105,0.1); color: #065F46; }
      .prof-nominee-status.unset { background: rgba(217,119,6,0.12); color: #92400E; }
      .prof-mpin-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .prof-mpin-input {
        letter-spacing: 8px;
        font-size: 20px;
        text-align: center;
        font-weight: 700;
      }
    </style>

    <!-- Hero -->
    <div class="prof-hero">
      <div class="prof-av-ring">
        <div class="prof-av-inner">
          ${user.avatarUrl ? `<img src="${escapeHtml(user.avatarUrl)}" alt="${escapeHtml(user.name)}" />` : initials(user.name || "?")}
        </div>
        ${liveBackendReady ? `
          <label for="profile-avatar-input" class="prof-cam-lbl" title="Change photo">📷</label>
          <input type="file" id="profile-avatar-input" accept="image/*" data-action="upload-avatar" style="display:none;" />
        ` : ""}
      </div>
      <h2 class="prof-hero-name">${escapeHtml(user.name || "Member")}</h2>
      <span class="prof-hero-badge">${escapeHtml(roleLabel(user.role))}</span>
    </div>

    <div class="prof-cards">
      <!-- Personal Info -->
      <div class="prof-card">
        <div class="prof-card-head" style="--prof-accent:#2563EB;">
          <h3>Personal Info</h3>
          <p>Name, phone and email on record</p>
        </div>
        <form data-form="save-profile-info" class="prof-card-body">
          <div class="prof-field">
            <label>Full Name</label>
            <input name="full_name" value="${escapeHtml(user.name || "")}" placeholder="Your full name" required />
          </div>
          <div class="prof-field">
            <label>Phone</label>
            <input name="phone" type="tel" value="${escapeHtml(user.phone || "")}" readonly style="background:#F3F4F6;color:var(--muted);cursor:not-allowed;" />
            <p style="margin:4px 0 0;font-size:11px;color:var(--muted);">To change your login phone, contact the admin.</p>
          </div>
          <div class="prof-field">
            <label>Email</label>
            <input name="email" type="email" value="${escapeHtml(user.email || "")}" placeholder="your@email.com" />
          </div>
          <button class="prof-btn prof-btn-blue" type="submit">Save Changes</button>
        </form>
      </div>

      <!-- Nominee -->
      <div class="prof-card prof-nominee-card">
        <div class="prof-card-head" style="--prof-accent:#D97706;border-bottom-color:rgba(253,230,138,0.8);">
          <h3>Nominee</h3>
          <p>Your designated beneficiary</p>
        </div>
        <form data-form="save-nominee" class="prof-card-body">
          <div class="prof-nominee-status ${hasNominee ? "set" : "unset"}">
            ${hasNominee ? `✓ ${escapeHtml(user.nomineeName)} · ${escapeHtml(user.nomineeRelationship)}` : "⚠ No nominee added yet"}
          </div>
          <div class="prof-field">
            <label>Nominee Name</label>
            <input name="nominee_name" value="${escapeHtml(user.nomineeName || "")}" placeholder="Full name" required style="background:#FFFBEB;" />
          </div>
          <div class="prof-field">
            <label>Relationship</label>
            <select name="nominee_relationship" style="background:#FFFBEB;">
              <option value="">Select relationship</option>
              ${relationships.map(r => `<option value="${r}" ${user.nomineeRelationship === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
          <div class="prof-field">
            <label>Nominee Phone</label>
            <input name="nominee_phone" type="tel" value="${escapeHtml(user.nomineePhone || "")}" placeholder="+91 XXXXX XXXXX" style="background:#FFFBEB;" />
          </div>
          <button class="prof-btn prof-btn-gold" type="submit">${hasNominee ? "Update Nominee" : "Add Nominee"}</button>
        </form>
      </div>

      <!-- Security -->
      <div class="prof-card">
        <div class="prof-card-head" style="--prof-accent:#374151;">
          <h3>Security</h3>
          <p>Change your 4-digit MPIN</p>
        </div>
        <form data-form="change-mpin" class="prof-card-body">
          <div class="prof-mpin-row">
            <div class="prof-field">
              <label>New MPIN</label>
              <input class="prof-mpin-input" name="new_mpin" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="····" required />
            </div>
            <div class="prof-field">
              <label>Confirm</label>
              <input class="prof-mpin-input" name="confirm_mpin" type="password" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="····" required />
            </div>
          </div>
          <button class="prof-btn prof-btn-dark" type="submit">Update MPIN</button>
        </form>
      </div>
    </div>
  `;
}

async function changePhone(profileId, newPhone) {
  if (!liveBackendReady) { showToast("Live backend required."); return; }
  const normalized = newPhone.replace(/\D/g, "").slice(-10);
  if (!/^[6-9]\d{9}$/.test(normalized)) { showToast("Enter a valid 10-digit Indian phone number."); return; }
  try {
    showToast("Updating phone number...");
    const { error } = await supabaseClient.functions.invoke("update-member-phone", {
      body: { profile_id: profileId, new_phone: normalized },
    });
    if (error) throw error;
    await loadLiveState();
    showToast("Phone updated. Member must now log in with the new number.");
    render();
  } catch (err) {
    showToast("Failed to update phone: " + (err.message || err));
  }
}

async function saveProfileInfo(data) {
  const userId = state.currentUserId;
  if (!liveBackendReady || !userId) { showToast("Live backend required."); return; }
  await liveQuery(supabaseClient.from("profiles").update({
    full_name: data.full_name.trim(),
    email: data.email.trim(),
  }).eq("id", userId));
  const member = state.members.find(m => m.id === userId);
  if (member) { member.name = data.full_name.trim(); member.email = data.email.trim(); }
  showToast("Profile updated.");
  render();
}

async function saveNominee(data) {
  const userId = state.currentUserId;
  if (!liveBackendReady || !userId) { showToast("Live backend required."); return; }
  if (!data.nominee_name.trim()) { showToast("Please enter nominee name."); return; }
  if (!data.nominee_relationship) { showToast("Please select relationship."); return; }
  const isNew = !currentUser()?.nomineeName;
  await liveQuery(supabaseClient.from("profiles").update({
    nominee_name: data.nominee_name.trim(),
    nominee_relationship: data.nominee_relationship,
    nominee_phone: data.nominee_phone.trim(),
  }).eq("id", userId));
  const member = state.members.find(m => m.id === userId);
  if (member) {
    member.nomineeName = data.nominee_name.trim();
    member.nomineeRelationship = data.nominee_relationship;
    member.nomineePhone = data.nominee_phone.trim();
  }
  if (isNew) {
    await notifyMember(userId, "nominee_added", "Nominee added",
      `Your nominee ${data.nominee_name.trim()} (${data.nominee_relationship}) has been added to your Banakar FinClub membership records.`);
  }
  showToast(isNew ? "Nominee added successfully." : "Nominee updated.");
  render();
}

function renderHistory() {
  const activeYearNum = state.settings.activeYearNumber || 6;
  const STATIC_PHOTOS = [4, 3, 3, 3, 5];

  const closedYears = [];
  for (let y = activeYearNum - 1; y >= 1; y--) {
    const dbYear = 2020 + y;
    let meetingData, dep;
    if (y <= 5) {
      const im = initialState.meetings.find(m => m.year === y);
      const id = initialState.deposits.find(d => d.id === `d${dbYear}`);
      dep = id;
      meetingData = im
        ? { date: im.date, venue: im.venue, notes: "", decisions: im.decisions || [], photos: [], localPhotoCount: STATIC_PHOTOS[y - 1] || 0 }
        : null;
    } else {
      const mr = state.meetingRecords.find(r => r.year === dbYear);
      dep = state.deposits.find(d => d.year === dbYear);
      meetingData = {
        date: mr?.date || "", venue: mr?.venue || "", notes: mr?.notes || "",
        decisions: mr?.decisions || [], photos: mr?.photos || [], localPhotoCount: 0,
      };
    }
    if (!dep || !meetingData) continue;
    closedYears.push({ yearNum: y, dbYear, dep, meeting: meetingData });
  }

  if (closedYears.length === 0) {
    return `<section class="page-title"><p>Banakar FinClub</p><h2>Meetings</h2></section>
    <div class="card"><div class="card-body"><p style="color:var(--muted);font-style:italic;padding:8px 0;">No closed years yet.</p></div></div>`;
  }

  return `
    <section class="page-title"><p>Banakar FinClub</p><h2>Meetings</h2></section>
    ${closedYears.map(({ yearNum, dbYear, dep, meeting }) => {
      const canEdit = isAdmin() && yearNum >= 6;

      // Build the photos array — local files for years 1-5, DB URLs for 6+
      const photos = yearNum <= 5
        ? Array.from({ length: meeting.localPhotoCount }, (_, i) => `./images/meetings/yr${yearNum}/meeting${i + 1}.jpg`)
        : meeting.photos;
      const galleryJson = escapeHtml(JSON.stringify(photos));

      // Compact photo row — max 5 shown, overflow badge on last
      const MAX_VISIBLE = 5;
      const photoStripHtml = photos.length > 0 ? `
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">
          ${photos.slice(0, MAX_VISIBLE).map((url, i) => {
            const isLast = i === MAX_VISIBLE - 1 && photos.length > MAX_VISIBLE;
            return `<div style="position:relative;width:68px;height:68px;border-radius:8px;overflow:hidden;flex-shrink:0;cursor:pointer;"
                         data-action="open-photo" data-gallery="${galleryJson}" data-index="${i}">
              <img src="${escapeHtml(url)}" style="width:100%;height:100%;object-fit:cover;display:block;" loading="lazy" alt="Photo ${i + 1}" />
              ${isLast ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,0.52);display:flex;align-items:center;justify-content:center;color:#fff;font-size:15px;font-weight:700;">+${photos.length - MAX_VISIBLE + 1}</div>` : ""}
            </div>`;
          }).join("")}
        </div>` : "";

      // Text details
      const hasDetails = meeting.date || meeting.venue || meeting.notes || meeting.decisions.length > 0;
      const detailsHtml = hasDetails ? `
        ${meeting.date  ? `<div class="meeting-note-row"><span>📅</span><span>${escapeHtml(meeting.date)}</span></div>` : ""}
        ${meeting.venue ? `<div class="meeting-note-row"><span>📍</span><span>${escapeHtml(meeting.venue)}</span></div>` : ""}
        ${meeting.notes ? `<p class="meeting-note-text">${escapeHtml(meeting.notes)}</p>` : ""}
        ${meeting.decisions.length > 0 ? `
          <div class="meeting-decisions" style="margin-top:8px;">
            <span>Key Decisions</span>
            <ul>${meeting.decisions.map(d => `<li>${escapeHtml(d)}</li>`).join("")}</ul>
          </div>` : ""}` : (yearNum >= 6 && canEdit ? `<p class="meeting-notes-empty">No notes yet — tap Edit to add.</p>` : "");

      // Editor form (admin, year 6+ only)
      const editorHtml = canEdit ? `
        <div id="meeting-notes-editor-${dbYear}" class="meeting-notes-editor" style="display:none;">
          <div class="meeting-editor-row"><label>Date</label><input type="date" id="mn-date-${dbYear}" value="${escapeHtml(meeting.date)}" /></div>
          <div class="meeting-editor-row"><label>Venue / Location</label><input type="text" id="mn-venue-${dbYear}" value="${escapeHtml(meeting.venue)}" placeholder="e.g. Wonder Valley Resort, Dandeli" /></div>
          <div class="meeting-editor-row"><label>Notes / Highlights</label><textarea id="mn-notes-${dbYear}" placeholder="What happened at the meeting...">${escapeHtml(meeting.notes)}</textarea></div>
          <div class="meeting-editor-row"><label>Key Decisions (one per line)</label><textarea id="mn-decisions-${dbYear}" placeholder="Monthly deposit rate&#10;New loan approved...">${escapeHtml(meeting.decisions.join("\n"))}</textarea></div>
          <div class="meeting-editor-row">
            <label>Photos</label>
            <label for="mn-photo-input-${dbYear}" class="photos-btn" style="cursor:pointer;display:inline-block;margin-bottom:8px;">+ Add Photos</label>
            <input type="file" id="mn-photo-input-${dbYear}" accept="image/*" multiple data-action="upload-meeting-photo" data-year="${dbYear}" style="display:none;" />
            ${meeting.photos.length > 0 ? `
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
                ${meeting.photos.map((url, i) => `
                  <div style="position:relative;width:64px;height:64px;border-radius:8px;overflow:hidden;flex-shrink:0;">
                    <img src="${escapeHtml(url)}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" alt="Photo ${i + 1}" />
                    <button class="photo-delete-btn" data-action="delete-meeting-photo" data-year="${dbYear}" data-url="${escapeHtml(url)}">✕</button>
                  </div>`).join("")}
              </div>` : ""}
          </div>
          <div style="display:flex;gap:8px;margin-top:10px;">
            <button class="primary" style="font-size:13px;padding:7px 16px;" data-action="save-meeting-notes" data-year="${dbYear}">Save</button>
            <button class="secondary" style="font-size:13px;padding:7px 16px;" data-action="toggle-meeting-editor" data-year="${dbYear}">Cancel</button>
          </div>
        </div>` : "";

      return `
      <div class="card" style="margin-bottom:12px;">
        <div class="card-header" style="align-items:flex-start;">
          <div>
            <h3>${escapeHtml(dep.label || `Year ${yearNum}`)}</h3>
            <p>Closing Balance: ${money(dep.balance)}</p>
          </div>
          ${canEdit ? `<button class="meeting-link-btn" data-action="toggle-meeting-editor" data-year="${dbYear}" style="flex-shrink:0;">Edit</button>` : ""}
        </div>
        <div class="card-body">
          ${photoStripHtml}
          <div id="meeting-notes-display-${dbYear}">${detailsHtml}</div>
          ${editorHtml}
        </div>
      </div>`;
    }).join("")}
  `;
}

function metric(label, value, help) {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(help)}</small></article>`;
}

async function showRulesModal() {
  const existing = document.getElementById("rules-modal");
  if (existing) existing.remove();

  if (liveBackendReady && state.rules.length === 0) {
    const rulesData = await liveOptionalList(
      supabaseClient.from("rules").select("*").order("section", { ascending: true }).order("sort_order", { ascending: true })
    );
    state.rules = rulesData.filter((r) => r.is_active !== false).map((r) => ({ id: r.id, section: r.section, item: r.item, sort_order: r.sort_order ?? 0 }));
  }

  const sectionIcons = { "Membership Rules": "👥", "Loan Rules": "💳", "New Member Rules": "🆕", "Administrative Guidelines": "📋", "Exit Rules": "🚪" };
  const grouped = state.rules.reduce((acc, r) => {
    if (!acc[r.section]) acc[r.section] = [];
    acc[r.section].push(r.item);
    return acc;
  }, {});
  const rules = Object.entries(grouped).map(([title, items]) => ({ icon: sectionIcons[title] || "📌", title, items }));

  const html = `
    <div id="rules-modal" class="rules-modal-overlay" data-action="close-rules">
      <div class="rules-modal-sheet">
        <div class="rules-modal-header">
          <div>
            <h3>📜 Rules &amp; Regulations</h3>
            <p>Sri Mukkanneshwara Associate · Updated Oct 2025</p>
          </div>
          <button class="rules-modal-close" data-action="close-rules">✕</button>
        </div>
        <div class="rules-modal-body">
          ${rules.map(section => `
            <div class="rules-section-block">
              <h4>${section.icon} ${escapeHtml(section.title)}</h4>
              <ul>
                ${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
          <p class="rules-footer-note">Last updated: October 2025 · After 5th Year Annual Meeting</p>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";
}


function showLoansModal() {
  const existing = document.getElementById("loans-modal");
  if (existing) existing.remove();

  const user = currentUser();
  const myLoans = currentLoanBookRows().filter((loan) => loanBelongsToMember(loan, user));

  const noLoans = `<div style="text-align:center;padding:40px 20px;color:var(--muted);font-size:14px;">You have no active or past loans.</div>`;

  const loansHtml = myLoans.length === 0 ? noLoans : myLoans.map((loan) => {
    const isActive = loan.status === "active";
    const outstanding = loanOutstanding(loan);
    const statusColor = isActive ? "#16a34a" : "#6b7280";
    const isLegacyEmi = loan.notes === "emi_entry";
    const isEmi = loan.loanType === "emi";

    if (isLegacyEmi) {
      const prog = appannaEmiProgress();
      const paid = prog.paid;
      const total = prog.totalMonths;
      const remaining = prog.remaining;
      const pct = Math.round(paid / total * 100);
      return `
        <div class="rules-section-block" style="border-left:3px solid #16a34a;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <h4 style="margin:0;">💳 EMI Commitment</h4>
            <span class="badge info">EMI ${paid}/${total}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;font-size:13px;margin-bottom:14px;">
            <div><span style="color:var(--muted);">Total Amount</span><br/><strong>${money(prog.totalAmount)}</strong></div>
            <div><span style="color:var(--muted);">Monthly</span><br/><strong>${money(prog.monthlyEmi)}</strong></div>
            <div><span style="color:var(--muted);">Months Paid</span><br/><strong>${paid} of ${total}</strong></div>
            <div><span style="color:var(--muted);">Remaining</span><br/><strong>${remaining} months</strong></div>
          </div>
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:5px;">
              <span>Progress</span><span>${pct}%</span>
            </div>
            <div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
              <div style="height:100%;background:var(--saffron);border-radius:4px;width:${pct}%;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:4px;">
              <span>${paid} paid</span><span>${remaining} remaining</span>
            </div>
          </div>
          <p style="font-size:12px;color:var(--muted);margin:0 0 12px;">No interest · Membership balance contribution</p>
          <span class="badge good">Active</span>
        </div>`;
    }

    if (isEmi) {
      const paid = loan.emisPaid || 0;
      const total = loan.tenureMonths || 1;
      const pct = Math.round(paid / total * 100);
      const nextEmi = state.loanEmis.find(e => e.loanId === loan.id && e.status === "pending");
      return `
        <div class="rules-section-block" style="border-left:3px solid ${statusColor};">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <h4 style="margin:0;">💳 EMI Loan</h4>
            <span class="badge info">EMI ${paid}/${total}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;font-size:13px;margin-bottom:14px;">
            <div><span style="color:var(--muted);">Loan Amount</span><br/><strong>${money(loan.amount)}</strong></div>
            <div><span style="color:var(--muted);">Monthly EMI</span><br/><strong>${money(loan.emiAmount)}</strong></div>
            <div><span style="color:var(--muted);">EMIs Paid</span><br/><strong>${paid} of ${total}</strong></div>
            <div><span style="color:var(--muted);">Amount Left</span><br/><strong>${money(outstanding)}</strong></div>
          </div>
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-bottom:5px;">
              <span>Repayment progress</span><span>${pct}%</span>
            </div>
            <div style="width:100%;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;">
              <div style="height:100%;background:var(--saffron);border-radius:4px;width:${pct}%;"></div>
            </div>
          </div>
          <p style="font-size:12px;color:var(--muted);margin:0 0 12px;">
            ${nextEmi ? `Next EMI: <strong>${money(nextEmi.amount)}</strong> due ${nextEmi.dueMonth}` : `<span style="color:#16a34a;font-weight:600;">✓ All EMIs paid</span>`}
          </p>
          <span class="badge ${isActive ? "good" : "info"}">${statusText(loan.status)}</span>
        </div>`;
    }

    const monthlyInt = loanBaseMonthlyInterest(loan);
    const dueThisMonth = isActive && isLoanDueThisMonth(loan);
    const extInfo = dueThisMonth ? loanExtensionStatus(loan.id) : null;
    let extHtml = "";
    if (dueThisMonth) {
      if (!extInfo || extInfo.status === "rejected") {
        extHtml = `<button class="secondary" data-action="request-extension" data-loan-id="${loan.id}" type="button" style="margin-top:10px;width:100%;">🔄 Request Extension (+1 year)</button>`;
      } else if (extInfo.status === "pending") {
        extHtml = `<div style="margin-top:10px;text-align:center;font-size:13px;color:#b45309;">⏳ Extension requested · Awaiting admin approval</div>`;
      } else if (extInfo.status === "approved") {
        extHtml = `<div style="margin-top:10px;text-align:center;font-size:13px;color:#16a34a;">✓ Extension approved</div>`;
      }
    }
    return `
      <div class="rules-section-block" style="border-left:3px solid ${statusColor};">
        <h4 style="margin-bottom:12px;">💳 ${isActive ? "Active Loan" : "Cleared Loan"}</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;font-size:13px;">
          <div><span style="color:var(--muted);">Loan Amount</span><br/><strong>${money(loan.amount)}</strong></div>
          <div><span style="color:var(--muted);">Outstanding</span><br/><strong>${money(outstanding)}</strong></div>
          <div><span style="color:var(--muted);">Monthly Interest</span><br/><strong>${money(monthlyInt)}</strong></div>
          <div><span style="color:var(--muted);">Interest Paid</span><br/><strong>${money(loan.interestPaid || 0)}</strong></div>
          <div><span style="color:var(--muted);">Loan Taken</span><br/><strong>${escapeHtml(loan.from || "-")}</strong></div>
          <div><span style="color:var(--muted);">Renewal Date</span><br/><strong>${escapeHtml(loanRenewalDate(loan) || "-")}</strong></div>
        </div>
        <div style="margin-top:12px;">
          <span class="badge ${isActive ? "good" : "info"}">${statusText(loan.status)}</span>
        </div>
        ${extHtml}
      </div>`;
  }).join("");

  const html = `
    <div id="loans-modal" class="rules-modal-overlay" data-action="close-loans">
      <div class="rules-modal-sheet">
        <div class="rules-modal-header">
          <div>
            <h3>💳 My Loans</h3>
            <p>${escapeHtml(user?.name || "")} · Loan details</p>
          </div>
          <button class="rules-modal-close" data-action="close-loans">✕</button>
        </div>
        <div class="rules-modal-body">
          ${loansHtml}
          <p class="rules-footer-note">Interest rate: ${state.settings.loanInterestRateMonthly}% per month on total loan amount</p>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";
}

function showMeetingPhotosModal(year) {
  const existing = document.getElementById("photos-modal");
  if (existing) existing.remove();

  const STATIC_COUNTS = { 1: 4, 2: 3, 3: 3, 4: 3, 5: 5 };
  const STATIC_LABELS = {
    1: "Year 1 · 2021 · M Thumbaraguddi",
    2: "Year 2 · 2022 · Sampige Heritage Resort, Koppal",
    3: "Year 3 · 2023 · Cotton County Club, Hubballi",
    4: "Year 4 · 2024 · Jungle Vibes Resort, Dandeli",
    5: "Year 5 · 2025 · Sandur Wonder Valley Resort",
  };

  let gallery = [];
  let label = "";

  if (year <= 5) {
    const count = STATIC_COUNTS[year] || 0;
    label = STATIC_LABELS[year] || `Year ${year}`;
    gallery = Array.from({ length: count }, (_, i) => `./images/meetings/yr${year}/meeting${i + 1}.jpg`);
  } else {
    const mr = state.meetingRecords.find(r => r.year === 2020 + year);
    gallery = mr?.photos || [];
    label = `Year ${year}${mr?.venue ? " · " + mr.venue : ""}`;
  }

  if (gallery.length === 0) {
    showToast("No photos available for this year yet.");
    return;
  }

  const galleryJson = escapeHtml(JSON.stringify(gallery));
  const photosHtml = gallery.map((src, i) => `
    <div class="photo-thumb-wrap" data-action="open-photo" data-gallery="${galleryJson}" data-index="${i}">
      <img src="${escapeHtml(src)}" class="photo-thumb" loading="lazy" alt="Meeting photo ${i + 1}" />
    </div>
  `).join("");

  const html = `
    <div id="photos-modal" class="rules-modal-overlay" data-action="close-photos">
      <div class="rules-modal-sheet">
        <div class="rules-modal-header">
          <div>
            <h3>📸 Meeting Photos</h3>
            <p>${escapeHtml(label)}</p>
          </div>
          <button class="rules-modal-close" data-action="close-photos">✕</button>
        </div>
        <div class="rules-modal-body">
          <div class="photo-grid">${photosHtml}</div>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    const sheet = document.querySelector("#photos-modal .rules-modal-sheet");
    if (sheet) sheet.style.transform = "translateY(0)";
  });
}

let lightboxSources = [];
let lightboxIndex = 0;
let lightboxTouchStartX = null;

function openPhotoLightbox(sources, startIndex = 0) {
  lightboxSources = Array.isArray(sources) ? sources : [sources];
  lightboxIndex = Math.min(Math.max(startIndex, 0), lightboxSources.length - 1);
  renderPhotoLightbox();
}

function renderPhotoLightbox() {
  const existing = document.getElementById("photo-lightbox");
  if (existing) existing.remove();

  const multi = lightboxSources.length > 1;
  const html = `
    <div id="photo-lightbox" class="photo-lightbox" data-action="close-lightbox">
      <button class="photo-lightbox-close" data-action="close-lightbox">✕</button>
      ${multi ? `<button class="photo-lightbox-nav photo-lightbox-prev" data-action="lightbox-prev">‹</button>` : ""}
      <img src="${escapeHtml(lightboxSources[lightboxIndex])}" class="photo-lightbox-img" alt="Meeting photo" />
      ${multi ? `<button class="photo-lightbox-nav photo-lightbox-next" data-action="lightbox-next">›</button>` : ""}
      ${multi ? `<div class="photo-lightbox-counter">${lightboxIndex + 1} / ${lightboxSources.length}</div>` : ""}
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);

  const lb = document.getElementById("photo-lightbox");
  lb.addEventListener("touchstart", (e) => { lightboxTouchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (lightboxTouchStartX === null) return;
    const dx = e.changedTouches[0].clientX - lightboxTouchStartX;
    lightboxTouchStartX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) lightboxShow(lightboxIndex + 1); else lightboxShow(lightboxIndex - 1);
  }, { passive: true });
}

function lightboxShow(index) {
  if (!lightboxSources.length) return;
  lightboxIndex = (index + lightboxSources.length) % lightboxSources.length;
  renderPhotoLightbox();
}

document.addEventListener("keydown", (e) => {
  if (!document.getElementById("photo-lightbox")) return;
  if (e.key === "ArrowRight") lightboxShow(lightboxIndex + 1);
  else if (e.key === "ArrowLeft") lightboxShow(lightboxIndex - 1);
  else if (e.key === "Escape") document.getElementById("photo-lightbox")?.remove();
});

function appannaEmiProgress() {
  const totalMonths = 18;
  const monthlyEmi = 7445.38;
  // Jan–Apr 2026 were paid before the app existed — fixed offset of 4
  const preAppPaid = 4;
  const legacyLoan = state.loans.find(l => l.notes === "emi_entry" && l.status === "active");
  const inAppPaid = legacyLoan
    ? state.monthlyPayments.filter(p =>
        p.memberId === legacyLoan.memberId && p.status === "paid" && p.month >= "2026-05"
      ).length
    : 0;
  const paid = Math.min(preAppPaid + inAppPaid, totalMonths);
  return { paid, remaining: totalMonths - paid, totalMonths, monthlyEmi, totalAmount: monthlyEmi * totalMonths };
}

function depositYearCard(d) {
  const ordinals = { d2021: "First", d2022: "Second", d2023: "Third", d2024: "Fourth", d2025: "Fifth" };
  return `
  <details class="card collapsible">
    <summary class="card-header">
      <div>
        <h3>${escapeHtml(d.label)}</h3>
        <p>Principal ${money(d.principal)} · Interest <span style="color:#16a34a;">${money(d.interest)}</span> · Expenditure <span style="color:#dc2626;">${money((Number(d.expenditure)||0) + (Number(d.exit_payouts)||0))}</span> · Balance <strong style="color:#2563eb;">${money(d.balance)}</strong></p>
      </div>
      <span class="collapse-icon">⌄</span>
    </summary>
    <div class="card-body">
      ${d.intro ? `<p style="margin:0 0 10px;font-size:13px;color:#444;">${escapeHtml(d.intro)}</p>` : ""}
      ${d.history?.length ? `<ul style="margin:0 0 16px;padding-left:18px;font-size:13px;color:#444;line-height:1.8;">${d.history.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
      <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#111;">Detailed ${escapeHtml(ordinals[d.id] || "")} Year Summary</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Description</th><th>Details</th><th>Amount</th></tr></thead>
          <tbody>
            ${(d.breakdown || []).map((row) => `
            <tr>
              <td data-label="Description">${escapeHtml(row.description)}</td>
              <td data-label="Details">${escapeHtml(row.details)}</td>
              <td data-label="Amount" style="font-weight:600;color:${row.amount < 0 ? "#dc2626" : "#16a34a"};">${row.amount < 0 ? "-" + money(Math.abs(row.amount)) : money(row.amount)}</td>
            </tr>`).join("")}
          </tbody>
          <tfoot>
            <tr style="font-weight:700;">
              <td colspan="2" data-label="Total Balance">Total Balance</td>
              <td data-label="Balance" style="color:#2563eb;">${money(d.balance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </details>`;
}

function renderStatement() {
  const rows = state.statementRows;
  const currentBal = expectedBankBalance();

  const rowsHtml = rows.length === 0
    ? `<div class="stmt-empty">No transactions yet. Monthly payments, loan disbursals and closures will appear here as they happen.</div>`
    : rows.map((s) => {
        const isCredit = s.type === "credit";
        return `
          <div class="stmt-row">
            <div class="stmt-left">
              <span class="stmt-type-dot ${isCredit ? "credit" : "debit"}"></span>
              <div class="stmt-info">
                <strong>${escapeHtml(s.description)}</strong>
                <span>${s.date}</span>
              </div>
            </div>
            <div class="stmt-right">
              <span class="stmt-amount ${isCredit ? "credit" : "debit"}">${isCredit ? "+" : "−"}${money(s.amount)}</span>
              <span class="stmt-balance">Bal: ${money(s.balance)}</span>
            </div>
          </div>`;
      }).join("");

  return `
    <div class="page-header"><h2>Statement</h2><p>Current bank balance</p><h3 style="margin:4px 0 0;font-size:22px;color:var(--saffron);">${money(currentBal)}</h3></div>
    <div class="stmt-legend">
      <span><span class="stmt-type-dot credit"></span> Credit (money in)</span>
      <span><span class="stmt-type-dot debit"></span> Debit (money out)</span>
    </div>
    <div class="stmt-list">${rowsHtml}</div>`;
}

function renderDeposits() {
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ORDINALS = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
  const _now = new Date();

  const activeYearNum = state.settings.activeYearNumber || 6;
  const activeYearStart = activeYearCutoffMonth();
  const activeYearLabel = state.settings.activeYearLabel || `${ORDINALS[(activeYearNum || 1) - 1] || "Current"} Year`;
  const activeYearRenewalFee = Number(state.settings.activeYearRenewalFee || 0);
  const activeYearExits = state.settings.activeYearExits || [];
  const exitPayouts = activeYearExits.reduce((s, e) => s + Number(e.payout || 0), 0);
  const activeYearDbYear = 2020 + activeYearNum;
  const activeHistBase = Number(state.deposits.find(d => d.year === activeYearDbYear)?.balance || 0);
  const livePayments = state.monthlyPayments
    .filter((p) => p.status === "paid" && p.month >= activeYearStart)
    .reduce((s, p) => s + Number(p.paidAmount || p.amount || 0), 0);

  let activeBalance;
  if (activeYearNum === 6) {
    // Year 6: DB balance cleared — use hardcoded pre-Jul hist total + live July+ payments
    const yr6HistFixed = 21000 + 14000 + 11250 + 84000 + 44672 + 65546 + 11171 - 121834; // 129805
    const yr6LiveTotal = state.monthlyPayments
      .filter(p => p.status === "paid" && p.month >= "2026-07")
      .reduce((s, p) => s + Number(p.paidAmount || p.amount || 0), 0);
    activeBalance = yr6HistFixed + yr6LiveTotal;
  } else {
    activeBalance = activeHistBase + activeYearRenewalFee - exitPayouts + livePayments;
  }

  const closedRows = state.deposits
    .filter(d => d.year < activeYearDbYear)
    .sort((a, b) => a.year - b.year);

  const years = [
    ...closedRows.map((d, i) => ({
      key: `d${d.year}`,
      label: ORDINALS[i] ? `${ORDINALS[i]} Year` : `Year ${i + 1}`,
      sub: d.label,
      balance: d.balance,
      active: false,
    })),
    {
      key: "active",
      label: activeYearLabel,
      sub: `${activeYearNum === 6 ? "Nov 2025" : `${MONTH_SHORT[new Date(activeYearStart + "-01").getMonth()]} ${new Date(activeYearStart + "-01").getFullYear()}`} – ${MONTH_SHORT[_now.getMonth()]} ${_now.getFullYear()}`,
      balance: activeBalance,
      active: true,
    },
  ];

  return `
    <section class="page-title"><p>${t("deposits")}</p><h2>Deposits & collections</h2></section>
    <section class="grid">
      ${years.map(y => `
        <div class="dash-tile dash-tile-clickable" data-action="show-deposit-year" data-year="${y.key}">
          <div class="dash-tile-body">
            <span class="tile-icon">🐷</span>
            <div>
              <strong>${y.label}</strong>
              <p>${y.sub}${y.active ? ' · <span class="badge warn" style="font-size:10px;">Active</span>' : ""}</p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            ${y.balance !== null ? `<strong style="font-size:15px;color:#2563eb;">${money(y.balance)}</strong><small style="color:#9ca3af;font-size:11px;">closing balance</small>` : `<small style="color:#f59e0b;font-size:11px;">in progress</small>`}
            <span class="tile-chevron">›</span>
          </div>
        </div>`).join("")}
    </section>
  `;
}

function showDepositYearModal(yearKey) {
  const existing = document.getElementById("deposit-year-modal");
  if (existing) existing.remove();

  const MNAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ORDINALS = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
  const _now = new Date();
  const emi = appannaEmiProgress();

  let title = "", bodyHtml = "";

  if (yearKey === "active") {
    const activeYearNum = state.settings.activeYearNumber || 6;
    const activeYearStart = activeYearCutoffMonth();
    const activeYearLabel = state.settings.activeYearLabel || `${ORDINALS[(activeYearNum || 1) - 1] || "Current"} Year`;
    const activeYearRenewalFee = Number(state.settings.activeYearRenewalFee || 0);
    const activeYearExits = state.settings.activeYearExits || [];
    const activeYearDbYear = 2020 + activeYearNum;
    const activeHistBase = Number(state.deposits.find(d => d.year === activeYearDbYear)?.balance || 0);

    if (activeYearNum === 6) {
      // Year 6 with existing historical base — show the rich Year 6 hardcoded breakdown + live rows
      const livePayments = state.monthlyPayments
        .filter((p) => p.status === "paid" && p.month >= "2026-07")
        .sort((a, b) => a.month.localeCompare(b.month));
      let liveTotalDeposit = 0, liveTotalInterest = 0;
      livePayments.forEach((p) => {
        const mem = memberById(p.memberId);
        if (!mem) return;
        const paid = Number(p.paidAmount || p.amount || 0);
        const { dep, interest } = paymentSplit(mem, p.month, paid);
        liveTotalDeposit += dep;
        liveTotalInterest += interest;
      });
      const latestMonth = livePayments.map(p => p.month).sort().pop();
      const latestLbl = latestMonth ? (() => { const [yr, mo] = latestMonth.split("-"); return `${MNAMES[Number(mo)-1]} ${yr}`; })() : "Jul 2026";
      const liveRows = [
        ...(liveTotalDeposit > 0 ? [{ label: "Monthly Deposits",   detail: `Jul 2026 – ${latestLbl} · collected`, amount: liveTotalDeposit }] : []),
        ...(liveTotalInterest > 0 ? [{ label: "Interest Collected", detail: `Jul 2026 – ${latestLbl} · loan interest`, amount: liveTotalInterest }] : []),
      ];
      const liveTotal = livePayments.reduce((s, p) => s + Number(p.paidAmount || p.amount || 0), 0);
      // Sum from hardcoded pre-Jul rows: renewal + Nov + Dec + Jan-Jun + EMI + interest + addl interest - member exit
      const yr6HistFixed = 21000 + 14000 + 11250 + 84000 + 44672 + 65546 + 11171 - 121834; // 129805
      const yr6RunningTotal = yr6HistFixed + liveTotal;
      const endDate = latestMonth ? new Date(latestMonth + "-01") : new Date(2026, 5, 30);
      const endLabel = `${MNAMES[endDate.getMonth()]} ${endDate.getFullYear()}`;
      title = `Sixth Year (Nov 2025 – ${endLabel})`;
      const points = [
        { text: "7 members · Appanna Banakar joined Nov 2025 · Sarpabhushana Banakar exited Oct 2025", meta: true },
        { label: "Yearly Renewal Fee",  detail: "November 2025 (₹3,000 × 7 members)",                                        amount:  21000 },
        { label: "Monthly Deposits",    detail: "November 2025 (₹2,000 × 7 members)",                                        amount:  14000 },
        { label: "Monthly Deposits",    detail: "December 2025 (5 members × ₹2,000 + 6th member × ₹1,250 + 7th exempted)",   amount:  11250 },
        { label: "Monthly Deposits",    detail: "January – June 2026 (₹2,000 × 7 members × 6 months)",                       amount:  84000 },
        { label: "New Member EMI",      detail: "Appanna Banakar – ₹7,445/month × 6 months",                                 amount:  44672 },
        { label: "Interest Earned",     detail: "Total interest earned (Nov 2025 – Jun 2026)",                                amount:  65546 },
        { label: "Additional Interest", detail: "Sarpabhushana ₹8,125 + Appanna ₹3,046 (outside loan table)",                amount:  11171 },
        { label: "Member Exited",       detail: "Sarpabhushana Banakar – amount paid out",                                   amount: -121834 },
        ...liveRows,
      ];
      bodyHtml = `
        <ul class="year-modal-list">
          ${points.map(p => p.meta
            ? `<li class="year-modal-meta">${p.text}</li>`
            : `<li class="year-modal-item"><div><span class="year-modal-label">${escapeHtml(p.label)}</span><span class="year-modal-detail">${escapeHtml(p.detail)}</span></div><strong class="year-modal-amount" style="color:${p.amount < 0 ? "#dc2626" : "#16a34a"};">${p.amount < 0 ? "−" + money(Math.abs(p.amount)) : money(p.amount)}</strong></li>`
          ).join("")}
        </ul>
        <div class="year-modal-total"><span>Running Balance (${endLabel})</span><strong style="color:#2563eb;">${money(yr6RunningTotal)}</strong></div>`;
    } else {
      // Year 7+ active: show renewal fee, exits, and live payment rows
      const exitPayouts = activeYearExits.reduce((s, e) => s + Number(e.payout || 0), 0);
      const livePayments = state.monthlyPayments
        .filter((p) => p.status === "paid" && p.month >= activeYearStart)
        .sort((a, b) => a.month.localeCompare(b.month));
      const liveByMonth = {};
      livePayments.forEach((p) => {
        const mem = memberById(p.memberId);
        if (!mem) return;
        const paid = Number(p.paidAmount || p.amount || 0);
        const { dep, interest } = paymentSplit(mem, p.month, paid);
        if (!liveByMonth[p.month]) liveByMonth[p.month] = { deposit: 0, interest: 0 };
        liveByMonth[p.month].deposit += dep;
        liveByMonth[p.month].interest += interest;
      });
      const liveRows = Object.entries(liveByMonth).flatMap(([month, data]) => {
        const [yr, mo] = month.split("-");
        const lbl = `${MNAMES[Number(mo) - 1]} ${yr}`;
        return [
          { label: "Monthly Deposits",   detail: `${lbl} – collected`, amount: data.deposit },
          ...(data.interest > 0 ? [{ label: "Interest Collected", detail: `${lbl} – loan interest`, amount: data.interest }] : []),
        ];
      });
      const liveTotal = livePayments.reduce((s, p) => s + Number(p.paidAmount || p.amount || 0), 0);
      const runningTotal = activeYearRenewalFee - exitPayouts + liveTotal;
      const latestPaidMonth = livePayments.map((p) => p.month).sort().pop();
      const startMo = new Date(activeYearStart + "-01");
      const startLabel = `${MNAMES[startMo.getMonth()]} ${startMo.getFullYear()}`;
      const endDate = latestPaidMonth ? new Date(latestPaidMonth + "-01") : _now;
      const endLabel = `${MNAMES[endDate.getMonth()]} ${endDate.getFullYear()}`;
      title = `${activeYearLabel} (${startLabel} – ${endLabel})`;
      const _perMem = Number(state.settings.activeYearRenewalFeePerMember || 0);
      const _memCount = activeMembers().length;
      const _renewalDetail = _perMem > 0
        ? `₹${_perMem.toLocaleString("en-IN")} × ${_memCount} members`
        : `Collected at year start`;
      const points = [
        ...(activeYearRenewalFee > 0 ? [{ label: "Yearly Renewal Fee", detail: _renewalDetail, amount: activeYearRenewalFee }] : []),
        ...activeYearExits.map(e => ({ label: "Member Exited", detail: `${e.name} – amount paid out`, amount: -Number(e.payout || 0) })),
        ...liveRows,
      ];
      bodyHtml = `
        <ul class="year-modal-list">
          ${points.length === 0 ? `<li class="year-modal-meta">No transactions recorded yet.</li>` : points.map(p => p.meta
            ? `<li class="year-modal-meta">${p.text}</li>`
            : `<li class="year-modal-item"><div><span class="year-modal-label">${escapeHtml(p.label)}</span><span class="year-modal-detail">${escapeHtml(p.detail)}</span></div><strong class="year-modal-amount" style="color:${p.amount < 0 ? "#dc2626" : "#16a34a"};">${p.amount < 0 ? "−" + money(Math.abs(p.amount)) : money(p.amount)}</strong></li>`
          ).join("")}
        </ul>
        <div class="year-modal-total"><span>Running Balance (${endLabel})</span><strong style="color:#2563eb;">${money(runningTotal)}</strong></div>`;
    }
  } else {
    // Closed historical year — check initialState first (Years 1-5 with rich breakdown)
    const yearNum = parseInt(yearKey.replace("d", ""), 10);
    const initDep = initialState.deposits.find(dep => dep.id === yearKey);
    if (initDep) {
      title = initDep.label;
      bodyHtml = `
        ${initDep.intro ? `<p class="year-modal-intro">${escapeHtml(initDep.intro)}</p>` : ""}
        <ul class="year-modal-list">
          ${(initDep.breakdown || []).map(row => `
            <li class="year-modal-item">
              <div><span class="year-modal-label">${escapeHtml(row.description)}</span><span class="year-modal-detail">${escapeHtml(row.details)}</span></div>
              <strong class="year-modal-amount" style="color:${row.amount < 0 ? "#dc2626" : "#16a34a"};">${row.amount < 0 ? "−" + money(Math.abs(row.amount)) : money(row.amount)}</strong>
            </li>`).join("")}
        </ul>
        <div class="year-modal-total"><span>Closing Balance</span><strong style="color:#2563eb;">${money(initDep.balance)}</strong></div>`;
    } else {
      // Year 6+ closed — use deposit_summaries DB row
      const dbRow = state.deposits.find(d => d.year === yearNum);
      if (!dbRow) return;
      title = dbRow.label || `Year ${yearNum}`;
      const savedBreakdown = Array.isArray(dbRow.breakdown) ? dbRow.breakdown : [];
      if (savedBreakdown.length > 0) {
        bodyHtml = `
          <ul class="year-modal-list">
            ${savedBreakdown.map(row => `
              <li class="year-modal-item">
                <div><span class="year-modal-label">${escapeHtml(row.description)}</span><span class="year-modal-detail">${escapeHtml(row.details)}</span></div>
                <strong class="year-modal-amount" style="color:${row.amount < 0 ? "#dc2626" : "#16a34a"};">${row.amount < 0 ? "−" + money(Math.abs(row.amount)) : money(row.amount)}</strong>
              </li>`).join("")}
          </ul>
          <div class="year-modal-total"><span>Closing Balance</span><strong style="color:#2563eb;">${money(dbRow.balance)}</strong></div>`;
      } else {
        bodyHtml = `
          <ul class="year-modal-list">
            <li class="year-modal-item"><div><span class="year-modal-label">Total Deposits Collected</span><span class="year-modal-detail">Principal collected</span></div><strong class="year-modal-amount" style="color:#16a34a;">${money(dbRow.principal)}</strong></li>
            <li class="year-modal-item"><div><span class="year-modal-label">Interest Earned</span><span class="year-modal-detail">From loan interest</span></div><strong class="year-modal-amount" style="color:#16a34a;">${money(dbRow.interest)}</strong></li>
            ${Number(dbRow.exit_payouts) > 0 ? `<li class="year-modal-item"><div><span class="year-modal-label">Member Exit Payouts</span><span class="year-modal-detail">Paid to exiting members</span></div><strong class="year-modal-amount" style="color:#dc2626;">−${money(dbRow.exit_payouts)}</strong></li>` : ""}
            ${Number(dbRow.expenditure) > 0 ? `<li class="year-modal-item"><div><span class="year-modal-label">Meeting Expenses</span><span class="year-modal-detail">Annual meeting cost</span></div><strong class="year-modal-amount" style="color:#dc2626;">−${money(dbRow.expenditure)}</strong></li>` : ""}
          </ul>
          <div class="year-modal-total"><span>Closing Balance</span><strong style="color:#2563eb;">${money(dbRow.balance)}</strong></div>`;
      }
    }
  }

  const html = `
    <div id="deposit-year-modal" class="rules-modal-overlay" data-action="close-deposit-year">
      <div class="rules-modal-sheet">
        <div class="rules-modal-header">
          <div><h3>🐷 ${escapeHtml(title)}</h3><p>Sri Mukkanneshwara Associate</p></div>
          <button class="rules-modal-close" data-action="close-deposit-year">✕</button>
        </div>
        <div class="rules-modal-body">${bodyHtml}</div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    const sheet = document.querySelector("#deposit-year-modal .rules-modal-sheet");
    if (sheet) sheet.style.transform = "translateY(0)";
  });
}

function fmtMonthYear(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" }).replace(" ", "-");
}

function renderLoans() {
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const _now = new Date();
  const activeYearNum = state.settings.activeYearNumber || 6;
  const ORDINALS_L = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
  const activeYearLabel = state.settings.activeYearLabel || `${ORDINALS_L[activeYearNum - 1]} Year`;
  const activeYearStart = activeYearCutoffMonth();
  const _asd = new Date(activeYearStart + "-01");
  const activeStartLabel = `${MONTH_SHORT[_asd.getMonth()]} ${_asd.getFullYear()}`;

  // Build closed year tiles from loan_history grouped by year label
  const _histByYear = {};
  state.loanHistory.forEach(h => {
    if (!_histByYear[h.year]) _histByYear[h.year] = [];
    _histByYear[h.year].push(h);
  });
  const closedLoanTiles = Object.entries(_histByYear)
    .sort((a, b) => (parseInt(a[0].replace(/\D/g,""),10)||0) - (parseInt(b[0].replace(/\D/g,""),10)||0))
    .map(([yLabel, loans]) => ({
      key: `lh_${yLabel.replace(/\s+/g,"_")}`,
      label: yLabel,
      sub: `Closed · ${loans.filter(l => l.status === "Carried Forward").length} carried forward`,
      count: loans.length,
      active: false,
    }));

  const activeCount = currentLoanBookRows().length;
  const loanYears = [
    { key: "l2021", label: "First Year",  sub: "2021 – 2022", tag: "Summary only", allClear: true },
    { key: "l2022", label: "Second Year", sub: "2022 – 2023", tag: "Summary only", allClear: true },
    { key: "l2023", label: "Third Year",  sub: "2023 – 2024", count: 8,  allClear: true },
    { key: "l2024", label: "Fourth Year", sub: "2024 – 2025", count: 13, allClear: true },
    ...closedLoanTiles,
    {
      key: "active",
      label: activeYearLabel,
      sub: `${activeStartLabel} – ${MONTH_SHORT[_now.getMonth()]} ${_now.getFullYear()}`,
      count: activeCount,
      active: true,
    },
  ];
  return `
    <section class="page-title"><p>${t("loans")}</p><h2>Loan records</h2></section>
    <section class="grid">
      <details class="card collapsible">
        <summary class="card-header"><div><h3>${t("loanRequest")}</h3><p>Submit request for admin approval</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <form class="form" data-form="loan-request">
            <label class="field"><span>${t("amount")}</span><input name="amount" type="number" min="1" required id="lr-amount" oninput="updateEmiPreview()" /></label>
            ${state.settings.emiEnabled ? `
              <div class="field">
                <span>Loan Type</span>
                <div style="display:flex;gap:20px;margin-top:6px;">
                  <label style="display:flex;align-items:center;gap:6px;font-size:14px;">
                    <input type="radio" name="loan_type" value="full" checked onchange="document.getElementById('lr-tenure-row').style.display='none';document.getElementById('lr-emi-preview').innerHTML=''" />
                    Full Repayment <small style="color:var(--muted);">(1.25%/mo)</small>
                  </label>
                  <label style="display:flex;align-items:center;gap:6px;font-size:14px;">
                    <input type="radio" name="loan_type" value="emi" onchange="document.getElementById('lr-tenure-row').style.display='block';updateEmiPreview()" />
                    EMI <small style="color:var(--muted);">(1.5%/mo)</small>
                  </label>
                </div>
              </div>
              <div class="field" id="lr-tenure-row" style="display:none;">
                <span>Tenure (months)</span>
                <input name="tenure_months" type="number" min="1" max="36" placeholder="e.g. 12" id="lr-tenure" oninput="updateEmiPreview()" />
              </div>
              <div id="lr-emi-preview" style="font-size:13px;color:#2563eb;padding:4px 0 0;min-height:20px;"></div>
            ` : ""}
            <label class="field"><span>${t("reason")}</span><textarea name="reason" required></textarea></label>
            <button class="primary" type="submit">${t("submit")}</button>
          </form>
        </div>
      </details>
      ${loanYears.map(y => `
        <div class="dash-tile dash-tile-clickable" data-action="show-loan-year" data-year="${y.key}">
          <div class="dash-tile-body">
            <span class="tile-icon">💳</span>
            <div>
              <strong>${y.label}</strong>
              <p>${y.sub}${y.active ? ' · <span class="badge warn" style="font-size:10px;">Active</span>' : ""}${y.tag ? ` · <small style="color:#9ca3af;">${y.tag}</small>` : ""}</p>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            ${y.allClear ? `<span class="badge good" style="font-size:10px;">All Cleared</span>` : `<span class="badge info" style="font-size:10px;">${y.count} loan${y.count !== 1 ? "s" : ""}</span>`}
            <span class="tile-chevron">›</span>
          </div>
        </div>`).join("")}
    </section>`;
}

function showLoanYearModal(yearKey) {
  const existing = document.getElementById("loan-year-modal");
  if (existing) existing.remove();

  const HISTORICAL = {
    l2021: {
      label: "First Year (2021-22)", note: "Summary data — individual records not available",
      loans: [
        { member: "Example Member", amount: 30000, interest: 450, renewal: "Jul-2021", status: "clear", totalPaid: 8700 },
      ]
    },
    l2022: {
      label: "Second Year (2022-23)", note: "Summary data — individual records not available",
      loans: [
        { member: "Example Member", amount: 50000, interest: 750, renewal: "Nov-2022", status: "clear", totalPaid: 33600 },
      ]
    },
    l2023: {
      label: "Third Year (2023-24)",
      loans: [
        { member: "Santosh",    amount: 30000,  interest: 450,  renewal: "May-2024", status: "clear", totalPaid: 450 },
        { member: "Pratap",     amount: 140000, interest: 2100, renewal: "Jun-2025", status: "clear", totalPaid: 14700 },
        { member: "Manjunath",  amount: 100000, interest: 1500, renewal: "Dec-2024", status: "clear", totalPaid: 10500 },
        { member: "Pratap",     amount: 50000,  interest: 750,  renewal: "Dec-2024", status: "clear", totalPaid: 5250 },
        { member: "Pradeep",    amount: 100000, interest: 1500, renewal: "Mar-2025", status: "clear", totalPaid: 10500 },
        { member: "Santosh",    amount: 100000, interest: 1500, renewal: "Apr-2025", status: "clear", totalPaid: 10500 },
        { member: "Pratap",     amount: 60000,  interest: 900,  renewal: "May-2025", status: "clear", totalPaid: 5400 },
        { member: "Pradeep",    amount: 100000, interest: 1500, renewal: "Nov-2025", status: "clear", totalPaid: 0 },
      ]
    },
    l2024: {
      label: "Fourth Year (2024-25)",
      loans: [
        { member: "Manjunath",      amount: 100000, interest: 1500, renewal: "Dec-2024", status: "clear", totalPaid: 1500 },
        { member: "Santosh",        amount: 100000, interest: 1500, renewal: "Apr-2025", status: "clear", totalPaid: 6000 },
        { member: "Pratap",         amount: 140000, interest: 2100, renewal: "Jun-2026", status: "clear", totalPaid: 21000 },
        { member: "Pratap",         amount: 50000,  interest: 750,  renewal: "Dec-2025", status: "clear", totalPaid: 7500 },
        { member: "Pradeep",        amount: 100000, interest: 1500, renewal: "Mar-2026", status: "clear", totalPaid: 15000 },
        { member: "Pratap",         amount: 60000,  interest: 900,  renewal: "May-2026", status: "clear", totalPaid: 9000 },
        { member: "Pradeep",        amount: 100000, interest: 1500, renewal: "Nov-2025", status: "clear", totalPaid: 16500 },
        { member: "Sarpabhushana",  amount: 30000,  interest: 450,  renewal: "Dec-2025", status: "clear", totalPaid: 4500 },
        { member: "Santosh",        amount: 40000,  interest: 600,  renewal: "Jul-2025", status: "clear", totalPaid: 4200 },
        { member: "Praveen",        amount: 70000,  interest: 1050, renewal: "May-2026", status: "clear", totalPaid: 3150 },
        { member: "Manjunath",      amount: 100000, interest: 1500, renewal: "Jul-2025", status: "clear", totalPaid: 4500 },
        { member: "Manjunath",      amount: 100000, interest: 1500, renewal: "Jun-2026", status: "clear", totalPaid: 6000 },
        { member: "Praveen",        amount: 100000, interest: 1500, renewal: "Oct-2025", status: "clear", totalPaid: 4500 },
      ]
    }
  };

  let title = "", bodyHtml = "";

  if (yearKey === "active") {
    const _activeNum = state.settings.activeYearNumber || 6;
    const _activeLabel = state.settings.activeYearLabel || `Year ${_activeNum}`;
    title = `${_activeLabel} · Current`;
    const loans = currentLoanBookRows();
    const user = currentUser();
    const _activeNumT = Number(state.settings.activeYearNumber) || 6;
    const _yrStart2 = _activeNumT === 6 ? "2025-11-01" : (activeYearCutoffMonth() + "-01");

    // Total year interest
    let _totalYrInt = 0;
    if (_activeNumT === 6) {
      const _yr6LiveInt = state.monthlyPayments
        .filter(p => p.status === "paid" && p.month >= "2026-07")
        .reduce((s, p) => {
          const _mem = memberById(p.memberId);
          if (!_mem) return s;
          const { interest } = paymentSplit(_mem, p.month, Number(p.paidAmount || p.amount || 0));
          return s + interest;
        }, 0);
      _totalYrInt = 65546 + _yr6LiveInt;
    } else {
      const _yrPayStart = activeYearCutoffMonth();
      _totalYrInt = state.monthlyPayments
        .filter(p => p.status === "paid" && p.month >= _yrPayStart)
        .reduce((s, p) => {
          const _mem = memberById(p.memberId);
          if (!_mem) return s;
          const { interest } = paymentSplit(_mem, p.month, Number(p.paidAmount || p.amount || 0));
          return s + interest;
        }, 0);
    }

    const totalPrincipal = loans.reduce((s, l) => s + Number(l.amount || 0), 0);
    const activeCount = loans.filter(l => l.status === "active").length;
    const dueCount = loans.filter(l => isLoanDueThisMonth(l)).length;

    // Register filter helpers globally (inline oninput/onclick call these)
    window.bfcLoanFilter = "all";
    window.bfcFilterLoanTable = function() {
      const term = (document.getElementById("lm-search")?.value || "").toLowerCase().trim();
      const filter = window.bfcLoanFilter;
      document.querySelectorAll("#loan-year-modal .lm-row").forEach(row => {
        const matchSearch = !term || (row.dataset.member || "").includes(term);
        const matchFilter = filter === "all" || (filter === "due" && row.dataset.status === "due");
        if (matchSearch && matchFilter) {
          row.style.removeProperty("display");
        } else {
          row.style.setProperty("display", "none", "important");
        }
      });
    };
    window.bfcSetLoanChip = function(chip, filter) {
      document.querySelectorAll("#loan-year-modal .lm-chip").forEach(c => c.classList.remove("lm-chip-active"));
      chip.classList.add("lm-chip-active");
      window.bfcLoanFilter = filter;
      window.bfcFilterLoanTable();
    };

    const tableRows = loans.map(loan => {
      const dueThisMonth = loan.status === "active" && isLoanDueThisMonth(loan);
      const myLoan = loanBelongsToMember(loan, user);
      const extInfo = dueThisMonth ? loanExtensionStatus(loan.id) : null;
      const rowStatus = dueThisMonth ? "due" : loan.status;
      const memberName = loanMemberName(loan);

      let actionCell = "";
      if (isAdmin()) {
        actionCell = `<div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${loan.status === "active" ? `<button class="primary" data-action="clear-current-loan" data-id="${loan.id}" type="button" style="font-size:10px;padding:3px 7px;min-height:0;">Clear</button>` : ""}
          <button class="danger" data-action="delete-current-loan" data-id="${loan.id}" type="button" style="font-size:10px;padding:3px 7px;min-height:0;">Del</button>
        </div>`;
      } else if (dueThisMonth && myLoan) {
        if (!extInfo || extInfo.status === "rejected") {
          actionCell = `<button class="secondary" data-action="request-extension" data-loan-id="${loan.id}" type="button" style="font-size:10px;padding:3px 7px;min-height:0;">Extend</button>`;
        } else if (extInfo.status === "pending") {
          actionCell = `<span style="font-size:10px;color:#b45309;">⏳ Awaiting</span>`;
        } else if (extInfo.status === "approved") {
          actionCell = `<span style="font-size:10px;color:#16a34a;">✓ Extended</span>`;
        }
      }

      const statusDisplay = dueThisMonth
        ? `<span class="badge warn" style="font-size:10px;">Due</span>`
        : statusBadge(loan.notes === "emi_entry" ? "EMI" : loan.status);

      // Always 3 columns — action goes inline below the status badge for everyone
      const actionInline = actionCell
        ? `<div style="margin-top:4px;">${actionCell}</div>` : "";

      const intPerMo = loan.status === "active" ? loanMonthlyInterest(loan) : 0;
      return `<tr class="lm-row" data-member="${escapeHtml(memberName.toLowerCase())}" data-status="${rowStatus}">
        <td>
          <strong style="font-size:13px;">${escapeHtml(memberName)}</strong>
          <br><small style="color:#9ca3af;font-size:10px;">Due: ${fmtMonthYear(loanRenewalDate(loan))}</small>
        </td>
        <td style="font-weight:700;color:#2563EB;font-variant-numeric:tabular-nums;white-space:nowrap;">
          ${money(loan.amount)}
          ${intPerMo > 0 ? `<br><small style="color:#9ca3af;font-size:10px;font-weight:400;">${money(intPerMo)}/mo</small>` : ""}
        </td>
        <td>${statusDisplay}${actionInline}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:20px;">No active loans.</td></tr>`;

    bodyHtml = `
      <div class="lm-stats">
        <div class="lm-stat">
          <div class="lbl">Loans</div>
          <div class="val">${loans.length}</div>
          <div class="sub">${activeCount} active</div>
        </div>
        <div class="lm-stat">
          <div class="lbl">Principal</div>
          <div class="val" style="font-size:13px;">${money(totalPrincipal)}</div>
          <div class="sub">Outstanding</div>
        </div>
        <div class="lm-stat">
          <div class="lbl">Yr Interest</div>
          <div class="val" style="font-size:13px;color:#059669;">${money(_totalYrInt)}</div>
          <div class="sub">Earned</div>
        </div>
      </div>
      <div class="lm-filter">
        <div class="lm-search-wrap">
          <span class="lm-search-icon">🔍</span>
          <input id="lm-search" class="lm-search" placeholder="Search member…" oninput="bfcFilterLoanTable()" />
        </div>
        <button class="lm-chip lm-chip-active" onclick="bfcSetLoanChip(this,'all')">All</button>
        ${dueCount > 0 ? `<button class="lm-chip" onclick="bfcSetLoanChip(this,'due')">Due (${dueCount})</button>` : ""}
      </div>
      <div class="lm-table-card">
        <div class="lm-table-head">
          <h4>Loan Book</h4>
          <span>${loans.length} record${loans.length !== 1 ? "s" : ""}</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="lm-tbl">
            <thead><tr>
              <th>Member · Due</th><th style="white-space:nowrap;">Amount · /mo</th><th>Status</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
            <tfoot><tr>
              <td style="font-weight:600;">Yr ${_activeNumT} Interest</td>
              <td style="color:#059669;font-weight:700;">${money(_totalYrInt)}</td>
              <td></td>
            </tr></tfoot>
          </table>
        </div>
      </div>`;
  } else if (yearKey.startsWith("lh_")) {
    const yearLabel = yearKey.slice(3).replace(/_/g, " ");
    const loans = state.loanHistory.filter(h => h.year === yearLabel);
    if (!loans.length) return;
    title = `${yearLabel} (Closed)`;
    const rows = loans.map(l => {
      const isEmi = l.notes === "emi_entry" || l.status.toLowerCase().includes("emi");
      const detail = isEmi
        ? `EMI loan · Carried forward`
        : `Interest ${money(l.interest || 0)}/mo · Yr Paid ${money(l.totalPaid)}`;
      return `
      <li class="year-modal-item">
        <div>
          <span class="year-modal-label">${escapeHtml(l.memberName)}</span>
          <span class="year-modal-detail">${detail}</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
          <strong class="year-modal-amount" style="color:#2563eb;">${money(l.amount)}</strong>
          <span class="badge ${isEmi ? "warn" : (l.status === "carried_forward" ? "info" : "good")}" style="font-size:10px;">${escapeHtml(l.status)}</span>
        </div>
      </li>`;
    }).join("");
    const totalPrincipal = loans.reduce((s, l) => s + l.amount, 0);
    const totalInterestPaid = loans
      .filter(l => l.notes !== "emi_entry" && !l.status.toLowerCase().includes("emi"))
      .reduce((s, l) => s + l.totalPaid, 0);
    bodyHtml = `
      <ul class="year-modal-list">${rows}</ul>
      <div class="year-modal-total" style="margin-top:10px;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span>Total Outstanding</span>
          <small style="font-weight:400;color:#6b7280;">Year interest paid: ${money(totalInterestPaid)}</small>
        </div>
        <strong>${money(totalPrincipal)}</strong>
      </div>`;
  } else {
    const data = HISTORICAL[yearKey];
    if (!data) return;
    title = data.label;
    const totalAmount = data.loans.reduce((s, l) => s + l.amount, 0);
    const totalPaid = data.loans.reduce((s, l) => s + l.totalPaid, 0);
    const rows = data.loans.map(l => `
      <li class="year-modal-item">
        <div>
          <span class="year-modal-label">${escapeHtml(l.member)}</span>
          <span class="year-modal-detail">Renewal ${escapeHtml(l.renewal)} · Interest ${money(l.interest)}/mo · Paid ${money(l.totalPaid)}</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;">
          <strong class="year-modal-amount" style="color:#2563eb;">${money(l.amount)}</strong>
          <span class="badge good" style="font-size:10px;">Cleared</span>
        </div>
      </li>`).join("");
    bodyHtml = `
      ${data.note ? `<p class="year-modal-intro" style="color:#f59e0b;">${escapeHtml(data.note)}</p>` : ""}
      <ul class="year-modal-list">${rows}</ul>
      <div class="year-modal-total" style="margin-top:10px;">
        <div style="display:flex;flex-direction:column;gap:2px;">
          <span>Total Loan Amount</span>
          <small style="font-weight:400;color:#6b7280;">Interest paid: ${money(totalPaid)}</small>
        </div>
        <strong>${money(totalAmount)}</strong>
      </div>`;
  }

  const html = `
    <div id="loan-year-modal" class="rules-modal-overlay" data-action="close-loan-year">
      <div class="rules-modal-sheet">
        <div class="rules-modal-header">
          <div><h3>💳 ${escapeHtml(title)}</h3><p>Sri Mukkanneshwara Associate</p></div>
          <button class="rules-modal-close" data-action="close-loan-year">✕</button>
        </div>
        <div class="rules-modal-body">${bodyHtml}</div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    const sheet = document.querySelector("#loan-year-modal .rules-modal-sheet");
    if (sheet) sheet.style.transform = "translateY(0)";
  });
}

function renderMembers() {
  const rows = state.members;
  return `
    <section class="page-title"><p>${t("members")}</p><h2>Member directory</h2></section>
    <section class="card">
      <div class="card-body row-list">
        ${rows.map((member) => `
          <div class="row-item">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
              ${memberAvatarHtml(member, "md")}
              <div style="min-width:0;">
                <strong>${escapeHtml(member.name)}</strong>
                <span>
                  ${escapeHtml(member.phone)} · ${escapeHtml(roleLabel(member.role))}
                  ${isAdmin() ? `<button type="button" data-action="change-phone" data-id="${member.id}" data-name="${escapeHtml(member.name)}" data-phone="${escapeHtml(member.phone)}" style="font-size:11px;padding:2px 7px;margin-left:6px;min-height:0;vertical-align:middle;background:var(--bg2,#F3F4F6);border:1px solid var(--border,#E5E7EB);border-radius:4px;cursor:pointer;color:var(--muted);">✏️</button>` : ""}
                </span>
                ${member.id === currentProfileId() && liveBackendReady ? `
                  <label class="change-photo-link" for="member-avatar-input">📷 Change photo</label>
                  <input type="file" id="member-avatar-input" accept="image/*" data-action="upload-avatar" style="display:none;" />
                ` : ""}
              </div>
            </div>
            <div class="member-actions">
              ${statusBadge(member.status)}
              ${isAdmin() && member.id !== currentProfileId() ? `<button class="danger" data-action="revoke-member" data-id="${member.id}" type="button">Revoke</button>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderMeetings() {
  const now = new Date();
  const activeYearNum = state.settings.activeYearNumber || 6;
  const activeYearDbYear = 2020 + activeYearNum;
  const activeYearStart = activeYearCutoffMonth();

  // Closed years: net deposits = principal - exit_payouts - expenditure; interest unchanged
  const closedYearsForChart = (state.deposits.length ? state.deposits : initialState.deposits)
    .filter(d => d.year < activeYearDbYear)
    .sort((a, b) => a.year - b.year)
    .map((d, i) => ({
      label: `Yr${i + 1}`,
      deposits: Math.max(0, (d.principal || 0) - (d.exit_payouts || 0) - (d.expenditure || 0)),
      interest: d.interest || 0,
    }));

  const currentExpenditure = Number(state.deposits.find(d => d.year === activeYearDbYear)?.expenditure || 0);

  let activeChartDeposits, activeChartInterest;
  if (activeYearNum === 6) {
    // Year 6 totals through July 2026 are user-verified from manual records.
    // These are net of member exit (196367 − 121834) and cover Nov 2025 – Jul 2026.
    const yr6HistDeposits = 74533;
    const yr6HistInterest = 87967;
    // Live loop: only add August 2026 onwards (Jul and earlier are in the hist base).
    // paymentSplit handles legacy-EMI (Appanna) correctly: full payment → deposit, 0 interest.
    let yr6LiveDeposits = 0, yr6LiveInterest = 0;
    state.monthlyPayments
      .filter((p) => p.status === "paid" && p.month >= "2026-08")
      .forEach((p) => {
        const mem = memberById(p.memberId);
        if (!mem) return;
        const paid = Number(p.paidAmount || p.amount || 0);
        const { dep, interest } = paymentSplit(mem, p.month, paid);
        yr6LiveDeposits += dep;
        yr6LiveInterest += interest;
      });
    activeChartDeposits = Math.max(0, yr6HistDeposits + yr6LiveDeposits - currentExpenditure);
    activeChartInterest = yr6HistInterest + yr6LiveInterest;
  } else {
    let activeLiveDeposits = 0, activeLiveInterest = 0;
    state.monthlyPayments
      .filter((p) => p.status === "paid" && p.month >= activeYearStart)
      .forEach((p) => {
        const mem = memberById(p.memberId);
        if (!mem) return;
        const paid = Number(p.paidAmount || p.amount || 0);
        const { dep, interest } = paymentSplit(mem, p.month, paid);
        activeLiveDeposits += dep;
        activeLiveInterest += interest;
      });
    const activeRenewalFee = Number(state.settings.activeYearRenewalFee || 0);
    activeChartDeposits = Math.max(0, activeRenewalFee + activeLiveDeposits - currentExpenditure);
    activeChartInterest = activeLiveInterest;
  }

  const chartData = [
    ...closedYearsForChart,
    { label: `Yr${activeYearNum}`, deposits: activeChartDeposits, interest: activeChartInterest, live: true },
  ];
  const maxVal = Math.max(...chartData.flatMap(d => [d.deposits, d.interest]), 1);

  function compactMoney(v) {
    const n = Number(v || 0);
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
    return `₹${n}`;
  }

  const thisMonth = currentMonth();
  const paidThisMonth = state.monthlyPayments.filter(p => p.month === thisMonth && p.status === "paid").length;
  const totalDepositMembers = depositMembers().length;
  const collectionPct = totalDepositMembers > 0 ? Math.round((paidThisMonth / totalDepositMembers) * 100) : 0;

  const totalFund = expectedBankBalance();

  return `
    <section class="page-title"><p>Association Analytics</p><h2>${t("meetings")}</h2></section>

    <div class="analytics-stat-row">
      <div class="analytics-stat">
        <span>Total Fund</span>
        <strong>${compactMoney(totalFund)}</strong>
        <small>Estimated</small>
      </div>
      <div class="analytics-stat">
        <span>Members</span>
        <strong>${activeMembers().length}</strong>
        <small>Active</small>
      </div>
      <div class="analytics-stat">
        <span>Year</span>
        <strong>6 of 10</strong>
        <small>Since 2021</small>
      </div>
    </div>

    <div class="card" style="margin-top:14px;">
      <div class="card-header"><div><h3>📈 Deposits vs Interest</h3><p>Collective year-wise data · all members</p></div></div>
      <div class="card-body">
        <div class="analytics-chart">
          ${chartData.map(d => `
            <div class="analytics-chart-row">
              <span class="analytics-chart-label">${escapeHtml(d.label)}${d.live ? "*" : ""}</span>
              <div class="analytics-chart-bars">
                <div class="analytics-bar-row">
                  <div class="analytics-bar-track"><div class="analytics-bar-fill dep" style="width:${Math.round(d.deposits / maxVal * 100)}%"></div></div>
                  <span class="analytics-bar-val">${compactMoney(d.deposits)}</span>
                </div>
                <div class="analytics-bar-row">
                  <div class="analytics-bar-track"><div class="analytics-bar-fill int" style="width:${Math.round(d.interest / maxVal * 100)}%"></div></div>
                  <span class="analytics-bar-val">${compactMoney(d.interest)}</span>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="analytics-legend">
          <div class="analytics-legend-item"><span class="analytics-legend-dot dep"></span>Deposits</div>
          <div class="analytics-legend-item"><span class="analytics-legend-dot int"></span>Interest</div>
          <small style="margin-left:auto;color:var(--muted);">* Live data</small>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:12px;">
      <div class="card-header"><div><h3>📅 This Month's Collection</h3><p>${now.toLocaleString("en-IN", { month: "long", year: "numeric" })}</p></div></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <strong style="font-size:26px;color:var(--ink);">${paidThisMonth}</strong>
          <span style="color:var(--muted);font-size:14px;">of ${totalDepositMembers} members paid</span>
        </div>
        <div style="height:10px;background:#e8edf4;border-radius:5px;overflow:hidden;">
          <div style="height:100%;width:${collectionPct}%;background:#16a34a;border-radius:5px;transition:width 0.4s;"></div>
        </div>
        <p style="font-size:12px;color:var(--muted);margin-top:6px;">${collectionPct}% collected · Target ${money(totalDepositMembers * 2000)}/month</p>
      </div>
    </div>

    ${(() => {
      const loanGroups = {};
      currentLoans()
        .filter(l => l.notes !== "emi_entry")
        .forEach(loan => {
          const name = (loan.memberName || "Unknown").split(" ")[0];
          loanGroups[name] = (loanGroups[name] || 0) + loanOutstanding(loan);
        });
      const availBal = expectedBankBalance();
      const totalPool = Object.values(loanGroups).reduce((s, v) => s + v, 0) + availBal;
      const bars = [
        ...Object.entries(loanGroups).map(([name, amt]) => ({ label: name, amount: amt, type: "loan" })),
        { label: "Available", amount: availBal, type: "avail" },
      ];
      const maxAmt = Math.max(...bars.map(b => b.amount), 1);
      return `
      <div class="card" style="margin-top:12px;">
        <div class="card-header">
          <div><h3>💰 Fund Allocation</h3><p>Loans outstanding + available balance</p></div>
        </div>
        <div class="card-body">
          <div class="fund-pool-badge">Total Pool <span>${money(totalPool)}</span></div>
          <div class="fund-chart">
            ${bars.map(b => `
              <div class="fund-bar-wrap">
                <span class="fund-bar-val">${compactMoney(b.amount)}</span>
                <div class="fund-bar ${b.type}" style="height:${Math.max(4, Math.round(b.amount / maxAmt * 140))}px"></div>
                <span class="fund-bar-label">${escapeHtml(b.label)}</span>
              </div>`).join("")}
          </div>
          <div class="analytics-legend" style="margin-top:28px;">
            <div class="analytics-legend-item"><span class="analytics-legend-dot" style="background:#f59e0b;"></span>Loan outstanding</div>
            <div class="analytics-legend-item"><span class="analytics-legend-dot" style="background:#16a34a;"></span>Available</div>
          </div>
        </div>
      </div>`;
    })()}

  `;
}

function renderAdmin() {
  if (!isAdmin()) {
    return `
      <section class="page-title"><p>${t("admin")}</p><h2>${t("adminOnly")}</h2></section>
      <div class="alert">Only the president/admin can approve members and manage transactions.</div>
    `;
  }

  const pendingLoanRequests = state.loanRequests.filter((request) => request.status === "pending");
  const monthlyInterestPreview = (Number(0) * state.settings.loanInterestRateMonthly) / 100;
  return `
    <section class="page-title"><p>${t("admin")}</p><h2>Operations</h2></section>
    <section class="grid">
      <details class="card collapsible" open>
        <summary class="card-header"><div><h3>Payment Collection</h3><p>${new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })} · Mark members as paid</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body" style="padding:12px 14px;">
          ${(() => {
            const members = depositMembers();
            const paidCount = members.filter(m => state.monthlyPayments.find(p => p.memberId === m.id && p.month === currentMonth() && p.status === "paid")).length;
            const nextMonthName = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString("en-IN", { month: "long" });
            return `
              <div class="pc-summary">
                <span class="pc-summary-stat"><strong>${paidCount}</strong> paid</span>
                <span class="pc-summary-divider">·</span>
                <span class="pc-summary-stat pending-stat"><strong>${members.length - paidCount}</strong> pending</span>
                <span class="pc-summary-divider">·</span>
                <span class="pc-summary-stat">${members.length} total</span>
              </div>
              <div class="pc-list">
                ${members.map((member) => {
                  const payment = state.monthlyPayments.find(p => p.memberId === member.id && p.month === currentMonth());
                  const isPaid = payment?.status === "paid";
                  const due = money(memberMonthlyDue(member));
                  const initials = (member.name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  return `
                    <div class="pc-row ${isPaid ? "pc-row-paid" : "pc-row-pending"}">
                      <div class="pc-avatar ${isPaid ? "pc-avatar-paid" : "pc-avatar-pending"}">${escapeHtml(initials)}</div>
                      <div class="pc-info">
                        <strong>${escapeHtml(member.name)}</strong>
                        <span>${isPaid ? `Next: 1–5 ${nextMonthName}` : `Due: ${due}`}</span>
                      </div>
                      <div class="pc-right">
                        <span class="pc-amount">${due}</span>
                        ${isPaid
                          ? `<span class="badge good" style="font-size:11px;">✓ Paid</span>`
                          : `<button class="primary small" data-action="mark-payment-paid" data-member-id="${member.id}" type="button">Mark Paid</button>`}
                      </div>
                    </div>`;
                }).join("")}
              </div>`;
          })()}
        </div>
      </details>

      <details class="card collapsible">
        <summary class="card-header"><div><h3>Add current loan</h3><p>Admin entry saved to current loan book</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <form class="form" data-form="manual-loan">
            <label class="field"><span>Member name</span>
              <select name="memberName" required data-loan-member-select>
                <option value="">— Select member —</option>
                ${state.members.filter((m) => m.status === "active").map((m) => `<option value="${escapeHtml(m.name)}" data-phone="${escapeHtml(m.phone || "")}">${escapeHtml(m.name)}</option>`).join("")}
              </select>
            </label>
            <label class="field"><span>Phone number</span><input name="memberPhone" inputmode="numeric" required placeholder="Auto-filled on member select" readonly data-loan-member-phone /></label>
            <label class="field"><span>Loan amount</span><input name="amount" inputmode="numeric" pattern="[0-9,]*" required data-loan-amount /></label>
            <label class="field"><span>Interest to be paid / month</span><input value="${money(monthlyInterestPreview)}" readonly data-loan-interest-preview /></label>
            <label class="field"><span>Loan taken date</span><input name="from" type="date" value="${today()}" required /></label>
            <label class="field"><span>Renewal date</span><input name="renewalOrReturnDate" type="date" required /></label>
            <button class="primary" type="submit">Add loan</button>
          </form>
        </div>
      </details>

      ${(() => {
        const pendingExtensions = (state.extensionRequests || []).filter((e) => e.status === "pending");
        const pendingCount = state.signupRequests.length + pendingLoanRequests.length + pendingExtensions.length;
        return `
      <details class="card collapsible">
        <summary class="card-header">
          <div><h3>Pending Approvals</h3><p>Signups · Loans · Extensions</p></div>
          ${pendingCount > 0 ? `<span class="badge bad" style="margin-left:auto;margin-right:8px;">${pendingCount}</span>` : ""}
          <span class="collapse-icon">⌄</span>
        </summary>
        <div class="card-body">
          <p style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Member Signups</p>
          <div class="row-list" style="margin-bottom:16px;">
            ${state.signupRequests.map((request) => `
              <div class="row-item">
                <div><strong>${escapeHtml(request.name)}</strong><span>${escapeHtml(request.phone)}</span></div>
                <div class="actions">
                  <button class="primary" data-action="approve-signup" data-id="${request.id}" type="button">${t("approve")}</button>
                  <button class="danger" data-action="reject-signup" data-id="${request.id}" type="button">${t("reject")}</button>
                </div>
              </div>
            `).join("") || `<div class="empty">No signup requests.</div>`}
          </div>
          <p style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Loan Requests</p>
          <div class="row-list" style="margin-bottom:16px;">
            ${pendingLoanRequests.map((request) => {
              const emiTag = request.loanType === "emi" ? ` · <span class="badge info" style="font-size:10px;">EMI ${request.tenureMonths}mo</span>` : "";
              return `
              <div class="row-item">
                <div><strong>${escapeHtml(memberById(request.memberId)?.name || "-")} · ${money(request.amount)}${emiTag}</strong><span>${escapeHtml(request.reason)} · ${escapeHtml(request.date)}</span></div>
                <div class="actions">
                  <button class="primary" data-action="approve-loan" data-id="${request.id}" type="button">${t("approve")}</button>
                  <button class="danger" data-action="reject-loan" data-id="${request.id}" type="button">${t("reject")}</button>
                </div>
              </div>`;
            }).join("") || `<div class="empty">No loan requests.</div>`}
          </div>
          <p style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Loan Extensions</p>
          <div class="row-list">
            ${pendingExtensions.length === 0 ? `<div class="empty">No pending extension requests.</div>` : pendingExtensions.map((ext) => {
              const loan = state.loans.find((l) => l.id === ext.loanId);
              const memberName = loan ? loanMemberName(loan) : memberById(ext.profileId)?.name || "-";
              const amount = loan ? money(loan.amount) : "-";
              const renewal = loan ? loanRenewalDate(loan) : "-";
              return `
                <div class="row-item">
                  <div>
                    <strong>${escapeHtml(memberName)} · ${amount}</strong>
                    <span>Renewal: ${escapeHtml(renewal)} · Requested extension +1 year</span>
                  </div>
                  <div class="actions">
                    <button class="primary" data-action="approve-extension" data-id="${ext.id}" data-loan-id="${ext.loanId}" data-profile-id="${ext.profileId}" type="button">${t("approve")}</button>
                    <button class="danger" data-action="reject-extension" data-id="${ext.id}" data-profile-id="${ext.profileId}" type="button">${t("reject")}</button>
                  </div>
                </div>`;
            }).join("")}
          </div>
        </div>
      </details>`;
      })()}

      <details class="card collapsible">
        <summary class="card-header"><div><h3>📜 Rules Management</h3><p>Add, edit or delete association rules</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          ${state.rules.length === 0 ? `<div class="empty" style="margin-bottom:16px;">Rules are loading… expand again in a moment or reload.</div>` : ""}
          <form class="form" data-form="add-rule" style="margin-bottom:20px;">
            <label class="field">
              <span>Section</span>
              <select name="section-pick" data-action="rule-section-pick" style="width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;background:var(--panel);color:var(--ink);">
                ${[...new Set(state.rules.map((r) => r.section))].map((s) => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("")}
                <option value="__new__">+ New section…</option>
              </select>
            </label>
            <label class="field" id="rule-new-section-field" style="display:none;">
              <span>New section name</span>
              <input name="section-custom" id="rule-new-section-input" placeholder="e.g. Investment Rules" />
            </label>
            <input type="hidden" name="section" id="rule-section-hidden" value="${escapeHtml([...new Set(state.rules.map((r) => r.section))][0] || "")}" />
            <label class="field"><span>Rule text</span><textarea name="item" rows="2" placeholder="Enter the rule..." required></textarea></label>
            <button class="primary" type="submit">Add Rule</button>
          </form>

          ${(() => {
            const grouped = state.rules.reduce((acc, r) => { if (!acc[r.section]) acc[r.section] = []; acc[r.section].push(r); return acc; }, {});
            return Object.entries(grouped).map(([section, items]) => `
              <p style="margin:16px 0 8px;font-size:13px;font-weight:700;color:var(--ink);">${escapeHtml(section)}</p>
              ${items.map((r) => `
                <div class="row-item" id="rule-row-${r.id}">
                  <div style="flex:1;" id="rule-text-${r.id}">
                    <span style="font-size:13px;">${escapeHtml(r.item)}</span>
                  </div>
                  <div class="actions" id="rule-actions-${r.id}">
                    <button class="secondary" data-action="edit-rule" data-id="${r.id}" data-item="${escapeHtml(r.item)}" type="button">Edit</button>
                    <button class="danger" data-action="delete-rule" data-id="${r.id}" type="button">Delete</button>
                  </div>
                </div>`).join("")}
            `).join("") || `<div class="empty">No rules yet. Add one above.</div>`;
          })()}
        </div>
      </details>

      ${(() => {
        const yearClosed = state.settings.yearClosed === true;
        const activeYearNum = state.settings.activeYearNumber || 6;
        const ORDINALS = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
        const activeLoans = currentLoans().filter(l => l.notes !== "emi_entry");
        const newYearNum = activeYearNum + 1;
        const newYearLabel = ORDINALS[newYearNum - 1] ? `${ORDINALS[newYearNum - 1]} Year` : `Year ${newYearNum}`;

        const activeYearDbYear = 2020 + activeYearNum;
        const currentExpenditure = Number(state.deposits.find(d => d.year === activeYearDbYear)?.expenditure || 0);

        // --- Year close readiness checks ---
        const activeYearStart = activeYearCutoffMonth();
        const MNAMES_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const latestPaidMonth = state.monthlyPayments
          .filter(p => p.month >= activeYearStart && p.status === "paid")
          .map(p => p.month).sort().pop();
        const allMembersPaid = latestPaidMonth
          ? activeMembers().every(m => state.monthlyPayments.some(p => p.memberId === m.id && p.month === latestPaidMonth && p.status === "paid"))
          : false;
        const latestMonthLabel = latestPaidMonth
          ? `${MNAMES_SHORT[Number(latestPaidMonth.split("-")[1]) - 1]} ${latestPaidMonth.split("-")[0]}`
          : "—";
        const pendingLoans = state.loanRequests.filter(r => r.status === "pending").length;
        const _now2 = new Date();
        const _thisMonth = `${_now2.getFullYear()}-${String(_now2.getMonth() + 1).padStart(2, "0")}`;
        const _lastMonth = (() => { const d = new Date(_now2.getFullYear(), _now2.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; })();
        const bankCurrent = state.statementRows.some(s => s.date && (s.date.startsWith(_thisMonth) || s.date.startsWith(_lastMonth)));

        const readinessChecks = [
          { ok: allMembersPaid,       label: allMembersPaid ? `All members paid for ${latestMonthLabel}` : `Not all members paid for ${latestMonthLabel}` },
          { ok: currentExpenditure > 0, label: currentExpenditure > 0 ? `Meeting expense recorded (${money(currentExpenditure)})` : "Meeting expense not recorded yet" },
          { ok: pendingLoans === 0,   label: pendingLoans === 0 ? "No pending loan requests" : `${pendingLoans} loan request${pendingLoans > 1 ? "s" : ""} pending approval` },
          { ok: bankCurrent,          label: bankCurrent ? "Bank statement up to date" : "Bank statement not updated this month" },
        ];
        const allReady = readinessChecks.every(c => c.ok);

        const openBody = `
          <div style="margin-bottom:12px;">
            <p style="color:var(--muted);font-size:13px;margin-bottom:8px;">Run this after the annual meeting to finalize Year ${activeYearNum} and start Year ${newYearNum}.</p>
            <div style="background:var(--panel-alt,#f8fafc);border-radius:8px;padding:10px 12px;font-size:13px;margin-bottom:12px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Pool Balance (live)</span><strong>${money(currentLoans().filter(l => l.notes !== "emi_entry").reduce((s, l) => s + loanOutstanding(l), 0) + expectedBankBalance())}</strong></div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span>Active loans to carry forward</span><strong>${activeLoans.length}</strong></div>
              <div style="display:flex;justify-content:space-between;"><span>Active members</span><strong>${activeMembers().length}</strong></div>
            </div>
          </div>
          <div style="margin-bottom:12px;">
            <p style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Year Close Readiness</p>
            <div style="background:var(--panel-alt,#f8fafc);border-radius:8px;padding:10px 12px;">
              ${readinessChecks.map(c => `
                <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:5px;font-size:13px;">
                  <span>${c.ok ? "✅" : "❌"}</span>
                  <span style="color:${c.ok ? "inherit" : "#dc2626"};">${c.label}</span>
                </div>`).join("")}
            </div>
            ${!allReady ? `<p style="font-size:12px;color:#b45309;margin-top:6px;">⚠️ Resolve the above items before closing the year.</p>` : `<p style="font-size:12px;color:#16a34a;margin-top:6px;">✓ All checks passed — ready to close Year ${activeYearNum}.</p>`}
          </div>
          <div style="margin-bottom:12px;">
            <p style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Annual Meeting Expense</p>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="number" id="meeting-expense-input" placeholder="e.g. 20000" min="0"
                value="${currentExpenditure > 0 ? currentExpenditure : ''}"
                style="flex:1;padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;" />
              <button class="secondary" data-action="save-meeting-expense" type="button" style="white-space:nowrap;">Save</button>
            </div>
            ${currentExpenditure > 0 ? `<p style="font-size:12px;color:var(--muted);margin-top:4px;">Saved: ${money(currentExpenditure)}</p>` : `<p style="font-size:12px;color:var(--muted);margin-top:4px;">Add after the annual meeting is done.</p>`}
          </div>
          <button class="danger" data-action="close-current-year" type="button" style="width:100%;">
            Close Year ${activeYearNum} &amp; Finalize Records
          </button>`;

        const closedBody = `
          <div class="alert" style="background:#dcfce7;border:1px solid #16a34a;border-radius:8px;padding:10px 12px;margin-bottom:16px;font-size:13px;color:#15803d;">
            ✓ Year ${activeYearNum} has been closed. Fill in the details below to start Year ${newYearNum}.
          </div>
          <form class="form" data-form="start-new-year">
            <label class="field">
              <span>Renewal Fee per Member (₹)</span>
              <input type="number" name="renewalFee" placeholder="e.g. 3000" min="0" required
                oninput="var n=${activeMembers().length};document.getElementById('renewal-calc').textContent=this.value>0?n+' members × ₹'+Number(this.value).toLocaleString('en-IN')+' = ₹'+(Number(this.value)*n).toLocaleString('en-IN')+' total':'';" />
              <span id="renewal-calc" style="font-size:12px;color:var(--muted);margin-top:2px;"></span>
            </label>
            <label class="field">
              <span>Monthly Deposit Amount (₹ per member)</span>
              <input type="number" name="monthlyDeposit" value="${state.settings.monthlyDeposit}" min="0" required />
            </label>
            <div style="margin-bottom:12px;">
              <p style="font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Member Exits (if any)</p>
              <div id="exit-member-list">
                ${activeMembers().map(m => `
                  <div class="row-item" style="flex-wrap:wrap;gap:8px;">
                    <label style="display:flex;align-items:center;gap:8px;flex:1;min-width:160px;">
                      <input type="checkbox" class="exit-member-check" data-member-id="${m.id}" data-member-name="${escapeHtml(m.name)}" />
                      <span>${escapeHtml(m.name)}</span>
                    </label>
                    <input type="number" id="exit-payout-${m.id}" placeholder="Payout ₹" min="0"
                      style="width:130px;display:none;padding:6px 10px;border:1px solid var(--border);border-radius:6px;font-size:13px;" />
                  </div>`).join("")}
              </div>
            </div>
            <button class="primary" type="submit" style="width:100%;">Start ${newYearLabel}</button>
          </form>`;

        return `
      <details class="card collapsible">
        <summary class="card-header"><div><h3>EMI Loans</h3><p>Enable after members vote to allow EMI-type loans</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:4px 0;">
            <div>
              <p style="font-size:13px;color:var(--muted);margin:0 0 4px;">When enabled, members can request loans in EMI format at <strong>1.5%/month</strong> with a custom tenure.</p>
              <p style="font-size:13px;color:var(--muted);margin:0;">Full-repayment loans remain available at <strong>1.25%/month</strong>.</p>
            </div>
            <label class="toggle-switch" aria-label="Enable EMI loans">
              <input type="checkbox" data-action="toggle-emi" ${state.settings.emiEnabled ? "checked" : ""} />
              <span class="toggle-switch-track"><span class="toggle-switch-thumb"></span></span>
            </label>
          </div>
          ${state.settings.emiEnabled ? `
            <div style="margin-top:12px;">
              ${(() => {
                const emiActive = state.loans.filter(l => l.loanType === "emi" && l.status === "active");
                if (emiActive.length === 0) return `<div class="empty">No active EMI loans.</div>`;
                return emiActive.map(loan => {
                  const memberName = loanMemberName(loan);
                  const paid = loan.emisPaid;
                  const total = loan.tenureMonths;
                  const pct = total > 0 ? Math.round(paid / total * 100) : 0;
                  const nextEmi = state.loanEmis.find(e => e.loanId === loan.id && e.status === "pending");
                  return `
                    <div class="row-item" style="flex-direction:column;align-items:flex-start;gap:8px;">
                      <div style="display:flex;justify-content:space-between;align-items:flex-start;width:100%;">
                        <div>
                          <strong>${escapeHtml(memberName)}</strong>
                          <div style="font-size:12px;color:var(--muted);margin-top:2px;">${money(loan.amount)} · ${money(loan.emiAmount)}/mo</div>
                        </div>
                        <span class="badge info" style="font-size:10px;flex-shrink:0;">EMI ${paid}/${total}</span>
                      </div>
                      <div style="width:100%;">
                        <div style="width:100%;height:6px;background:#e5e7eb;border-radius:3px;overflow:hidden;">
                          <div style="height:100%;background:var(--saffron);border-radius:3px;width:${pct}%;"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-top:3px;font-size:11px;color:var(--muted);">
                          <span>${paid} paid</span><span>${total - paid} remaining</span>
                        </div>
                      </div>
                      ${nextEmi ? `<p style="font-size:12px;color:var(--muted);margin:0;">Next: <strong>${money(nextEmi.amount)}</strong> due ${nextEmi.dueMonth}</p>` : `<p style="font-size:12px;color:#16a34a;margin:0;font-weight:600;">✓ All EMIs paid</p>`}
                    </div>`;
                }).join("");
              })()}
            </div>
          ` : ""}
        </div>
      </details>

          <details class="card collapsible">
            <summary class="card-header">
              <div><h3>Year Management</h3><p>${yearClosed ? `Year ${activeYearNum} closed · Start Year ${newYearNum}` : `Year ${activeYearNum} active · Close after meeting`}</p></div>
              ${yearClosed ? `<span class="badge good" style="margin-left:auto;margin-right:8px;">Closed</span>` : ""}
              <span class="collapse-icon">⌄</span>
            </summary>
            <div class="card-body">
              ${yearClosed ? closedBody : openBody}
            </div>
          </details>`;
      })()}
    </section>
  `;
}

function statusBadge(status) {
  const normalized = String(status || "").toLowerCase();
  const type = normalized.includes("paid") || normalized.includes("active") || normalized.includes("approved") || normalized.includes("clear") ? "good" :
    normalized.includes("pending") || normalized.includes("interest_free") || normalized.includes("onboarding") ? "warn" :
    normalized.includes("reject") ? "bad" : "info";
  return `<span class="badge ${type}">${escapeHtml(status || "-")}</span>`;
}

function statusText(status) {
  const value = String(status || "none");
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest(".primary, .danger, .secondary, .dash-tile, .nav button, .icon-button");
  if (!el) return;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2.2;
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  el.style.overflow = "hidden";
  el.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
});

document.addEventListener("click", async (event) => {
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    state.activeTab = tabButton.dataset.tab;
    saveState();
    history.pushState({ bfc: true, tab: state.activeTab }, "");
    render();
    return;
  }

  const authButton = event.target.closest("[data-auth-mode]");
  if (authButton) {
    renderAuth(authButton.dataset.authMode);
    return;
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;

  // If the resolved action element is a modal overlay, only fire when the user
  // clicked the dark background itself or an explicit ✕ close button —
  // not when clicking search inputs, chips, or other content inside the sheet.
  if (action.classList.contains("rules-modal-overlay")) {
    const onBackground = action === event.target;
    const onCloseBtn   = !!event.target.closest(".rules-modal-close");
    if (!onBackground && !onCloseBtn) return;
  }

  if (action.dataset.action === "open-profile") {
    state.activeTab = "profile";
    saveState();
    history.pushState({ bfc: true, tab: "profile" }, "");
    render();
    return;
  }

  if (action.dataset.action === "show-rules") {
    showRulesModal();
    return;
  }

  if (action.dataset.action === "close-rules") {
    const modal = document.getElementById("rules-modal");
    if (modal) { modal.remove(); document.body.style.overflow = ""; }
    return;
  }

  if (action.dataset.action === "show-loans") {
    showLoansModal();
    return;
  }

  if (action.dataset.action === "close-loans") {
    const modal = document.getElementById("loans-modal");
    if (modal) { modal.remove(); document.body.style.overflow = ""; }
    return;
  }

  if (action.dataset.action === "open-chat") {
    openChatPanel();
    return;
  }

  if (action.dataset.action === "close-chat") {
    closeChatPanel();
    return;
  }

  if (action.dataset.action === "send-chat") {
    await sendChatMessage();
    return;
  }

  if (action.dataset.action === "open-ai-chat") {
    openAiPanel();
    return;
  }

  if (action.dataset.action === "close-ai-chat") {
    closeAiPanel();
    return;
  }

  if (action.dataset.action === "send-ai-message") {
    await sendAiMessage();
    return;
  }

  if (action.dataset.action === "clear-ai-chat") {
    aiHistory = [];
    const messagesEl = document.getElementById("ai-messages");
    if (messagesEl) messagesEl.innerHTML = aiEmptyHtml();
    return;
  }

  if (action.dataset.action === "show-deposit-year") {
    showDepositYearModal(action.dataset.year);
    return;
  }

  if (action.dataset.action === "close-deposit-year") {
    // If the click bubbled from inside the sheet to the overlay, ignore it
    if (action.classList.contains("rules-modal-overlay") && event.target !== action) return;
    const modal = document.getElementById("deposit-year-modal");
    if (modal) { modal.remove(); document.body.style.overflow = ""; }
    return;
  }

  if (action.dataset.action === "show-loan-year") {
    showLoanYearModal(action.dataset.year);
    return;
  }

  if (action.dataset.action === "close-loan-year") {
    const modal = document.getElementById("loan-year-modal");
    if (modal) { modal.remove(); document.body.style.overflow = ""; }
    return;
  }

  if (action.dataset.action === "show-meeting-photos") {
    showMeetingPhotosModal(Number(action.dataset.year));
    return;
  }

  if (action.dataset.action === "close-photos") {
    const modal = document.getElementById("photos-modal");
    if (modal) { modal.remove(); document.body.style.overflow = ""; }
    return;
  }

  if (action.dataset.action === "toggle-meeting-editor") {
    const yr = action.dataset.year;
    const disp = document.getElementById(`meeting-notes-display-${yr}`);
    const ed = document.getElementById(`meeting-notes-editor-${yr}`);
    if (!disp || !ed) return;
    const isEditing = ed.style.display !== "none";
    ed.style.display = isEditing ? "none" : "block";
    disp.style.display = isEditing ? "" : "none";
    return;
  }

  if (action.dataset.action === "save-meeting-notes") {
    const yr = Number(action.dataset.year);
    action.disabled = true;
    action.textContent = "Saving…";
    await saveMeetingNotes(yr, {
      date: document.getElementById(`mn-date-${yr}`)?.value || "",
      venue: (document.getElementById(`mn-venue-${yr}`)?.value || "").trim(),
      notes: (document.getElementById(`mn-notes-${yr}`)?.value || "").trim(),
      decisions: (document.getElementById(`mn-decisions-${yr}`)?.value || "")
        .split("\n").map(d => d.trim()).filter(Boolean),
    });
    render();
    return;
  }

  if (action.dataset.action === "delete-meeting-photo") {
    const yr = Number(action.dataset.year);
    const url = action.dataset.url;
    if (!confirm("Remove this photo?")) return;
    action.disabled = true;
    await deleteMeetingPhoto(yr, url);
    render();
    return;
  }

  if (action.dataset.action === "close-post-close") {
    if (action.classList.contains("rules-modal-overlay") && event.target !== action) return;
    document.getElementById("post-close-modal")?.remove();
    document.body.style.overflow = "";
    return;
  }

  if (action.dataset.action === "skip-post-close") {
    document.getElementById("post-close-modal")?.remove();
    document.body.style.overflow = "";
    return;
  }

  if (action.dataset.action === "save-post-close") {
    const yr = Number(action.dataset.year);
    const closedYearNum = yr - 2020;
    const dateVal = document.getElementById("pc-date")?.value || "";
    const venueVal = (document.getElementById("pc-venue")?.value || "").trim();
    const expVal = Number(document.getElementById("pc-expenditure")?.value || 0);
    const notesVal = (document.getElementById("pc-notes")?.value || "").trim();
    const decisionsRaw = document.getElementById("pc-decisions")?.value || "";
    const decisions = decisionsRaw.split("\n").map(d => d.trim()).filter(Boolean);
    action.disabled = true;
    action.textContent = "Saving…";
    document.getElementById("post-close-modal")?.remove();
    document.body.style.overflow = "";
    await savePostCloseData(closedYearNum, { date: dateVal, venue: venueVal, expenditure: expVal, notes: notesVal, decisions });
    return;
  }

  if (action.dataset.action === "open-photo") {
    if (action.dataset.gallery) {
      openPhotoLightbox(JSON.parse(action.dataset.gallery), Number(action.dataset.index || 0));
    } else {
      openPhotoLightbox(action.dataset.src);
    }
    return;
  }

  if (action.dataset.action === "close-lightbox") {
    const lb = document.getElementById("photo-lightbox");
    if (lb) lb.remove();
    return;
  }

  if (action.dataset.action === "lightbox-prev") {
    lightboxShow(lightboxIndex - 1);
    return;
  }

  if (action.dataset.action === "lightbox-next") {
    lightboxShow(lightboxIndex + 1);
    return;
  }

  if (action.dataset.action === "pay-now") {
    const amount = action.dataset.amount;
    const now = new Date();
    const note = `Monthly deposit ${now.toLocaleString("en-IN", { month: "short", year: "numeric" })}`;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(ASSOCIATION_UPI_ID)}&pn=${encodeURIComponent(ASSOCIATION_UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    localStorage.setItem(`payInitiated_${currentMonth()}`, "1");
    window.location.href = upiUrl;
    return;
  }

  if (action.dataset.action === "open-notifications") {
    await openNotifications();
    return;
  }

  if (action.dataset.action === "close-notifications") {
    closeNotificationPanel();
    return;
  }

  if (action.dataset.action === "toggle-password") {
    const wrapper = action.closest(".input-wrapper");
    const input = wrapper?.querySelector("input");
    if (!input) return;
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    action.innerHTML = eyeIcon(!isHidden);
    return;
  }

  if (action.dataset.action === "toggle-lang") {
    state.lang = state.lang === "en" ? "kn" : "en";
    saveState();
    render();
  }


  if (action.dataset.action === "logout") {
    if (mpinSet()) {
      mpinPending = true;
      mpinEntry = "";
      render();
    } else {
      sessionStorage.removeItem("mpinVerified");
      if (liveBackendReady) await supabaseClient.auth.signOut({ scope: "local" });
      state.currentUserId = null;
      saveState();
      render();
    }
  }

  if (action.dataset.action === "edit-rule") {
    const id = action.dataset.id;
    const textDiv = document.getElementById(`rule-text-${id}`);
    const actionsDiv = document.getElementById(`rule-actions-${id}`);
    if (!textDiv || !actionsDiv) return;
    const currentItem = action.dataset.item;
    textDiv.innerHTML = `<textarea class="inline-edit-input" id="rule-edit-input-${id}" rows="2" style="width:100%;font-size:13px;padding:4px 6px;border:1px solid var(--border);border-radius:6px;resize:vertical;">${escapeHtml(currentItem)}</textarea>`;
    actionsDiv.innerHTML = `<button class="primary" data-action="save-rule" data-id="${id}" type="button">Save</button><button class="secondary" data-action="cancel-edit-rule" data-id="${id}" data-item="${escapeHtml(currentItem)}" type="button">Cancel</button>`;
    document.getElementById(`rule-edit-input-${id}`)?.focus();
    return;
  }

  if (action.dataset.action === "cancel-edit-rule") {
    const id = action.dataset.id;
    const textDiv = document.getElementById(`rule-text-${id}`);
    const actionsDiv = document.getElementById(`rule-actions-${id}`);
    if (!textDiv || !actionsDiv) return;
    const originalItem = action.dataset.item;
    textDiv.innerHTML = `<span style="font-size:13px;">${escapeHtml(originalItem)}</span>`;
    actionsDiv.innerHTML = `<button class="secondary" data-action="edit-rule" data-id="${id}" data-item="${escapeHtml(originalItem)}" type="button">Edit</button><button class="danger" data-action="delete-rule" data-id="${id}" type="button">Delete</button>`;
    return;
  }

  try {
    if (action.dataset.action === "approve-signup") await approveSignup(action.dataset.id);
    if (action.dataset.action === "reject-signup") await rejectSignup(action.dataset.id);
    if (action.dataset.action === "approve-loan") await approveLoan(action.dataset.id);
    if (action.dataset.action === "reject-loan") await rejectLoan(action.dataset.id);
    if (action.dataset.action === "mark-payment-paid") await markPaymentPaid(action.dataset.memberId);
    if (action.dataset.action === "revoke-member") await revokeMemberAccess(action.dataset.id);
    if (action.dataset.action === "change-phone") {
      const newPhone = window.prompt(`Change phone for ${action.dataset.name}\nCurrent: ${action.dataset.phone}\n\nEnter new 10-digit phone number:`);
      if (newPhone && newPhone.replace(/\D/g, "").slice(-10) !== action.dataset.phone.replace(/\D/g, "").slice(-10)) {
        await changePhone(action.dataset.id, newPhone);
      }
      return;
    }
    if (action.dataset.action === "clear-current-loan") await clearCurrentLoan(action.dataset.id);
    if (action.dataset.action === "delete-current-loan") await deleteCurrentLoan(action.dataset.id);
    if (action.dataset.action === "request-extension") await requestExtension(action.dataset.loanId);
    if (action.dataset.action === "approve-extension") await approveExtension(action.dataset.id, action.dataset.loanId);
    if (action.dataset.action === "reject-extension") await rejectExtension(action.dataset.id, action.dataset.profileId);
    if (action.dataset.action === "close-current-year") await closeCurrentYear();
    if (action.dataset.action === "save-meeting-expense") {
      const input = document.getElementById("meeting-expense-input");
      const amount = Number(input?.value || 0);
      if (amount <= 0) { showToast("Please enter a valid amount."); return; }
      await saveMeetingExpense(amount);
    }
    if (action.dataset.action === "toggle-emi") { event.preventDefault(); await toggleEmiEnabled(); }

    if (action.dataset.action === "save-rule") {
      const id = action.dataset.id;
      const input = document.getElementById(`rule-edit-input-${id}`);
      const newItem = (input?.value || "").trim();
      if (!newItem) { showToast("Rule text cannot be empty."); return; }
      if (!liveBackendReady) { showToast("Live backend required."); return; }
      action.disabled = true;
      await liveQuery(supabaseClient.from("rules").update({ item: newItem }).eq("id", id));
      await loadLiveState();
      render();
      showToast("Rule updated.");
    }

    if (action.dataset.action === "delete-rule") {
      const id = action.dataset.id;
      if (!liveBackendReady) { showToast("Live backend required."); return; }
      action.disabled = true;
      await liveQuery(supabaseClient.from("rules").delete().eq("id", id));
      await loadLiveState();
      render();
      showToast("Rule deleted.");
    }
  } catch (error) {
    showToast(error.message || "Something went wrong.");
  }
});

document.addEventListener("change", (event) => {
  const sel = event.target.closest("[data-action='rule-section-pick']");
  if (sel) {
    const newField = document.getElementById("rule-new-section-field");
    const hiddenInput = document.getElementById("rule-section-hidden");
    if (sel.value === "__new__") {
      newField.style.display = "";
      hiddenInput.value = "";
    } else {
      newField.style.display = "none";
      hiddenInput.value = sel.value;
    }
    return;
  }

  // Signup form photo preview
  if (event.target.name === "avatar" && event.target.files?.[0]) {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const label = document.querySelector(".avatar-pick-label");
      if (label) {
        label.style.backgroundImage = `url(${evt.target.result})`;
        label.style.backgroundSize = "cover";
        label.style.backgroundPosition = "center";
        const placeholder = label.querySelector(".avatar-pick-placeholder");
        if (placeholder) placeholder.style.display = "none";
      }
    };
    reader.readAsDataURL(event.target.files[0]);
    return;
  }

  // Meeting photo upload
  const mtPhotoInput = event.target.closest("[data-action='upload-meeting-photo']");
  if (mtPhotoInput && mtPhotoInput.files?.length > 0) {
    const yr = Number(mtPhotoInput.dataset.year);
    const files = Array.from(mtPhotoInput.files);
    showToast(`Uploading ${files.length} photo${files.length !== 1 ? "s" : ""}…`);
    (async () => {
      let failed = 0;
      for (const file of files) {
        try { await uploadMeetingPhoto(yr, file); }
        catch(e) { failed++; }
      }
      await loadLiveState();
      render();
      if (failed > 0) showToast(`${files.length - failed} uploaded, ${failed} failed.`);
      else showToast("Photos uploaded.");
    })();
    return;
  }

  // Home / Members avatar upload
  const avatarInput = event.target.closest("[data-action='upload-avatar']");
  if (avatarInput && avatarInput.files?.[0]) {
    handleAvatarUpload(avatarInput.files[0]);
    return;
  }

  // Exit member checkbox — toggle payout field visibility
  const exitCheck = event.target.closest(".exit-member-check");
  if (exitCheck) {
    const payoutField = document.getElementById(`exit-payout-${exitCheck.dataset.memberId}`);
    if (payoutField) payoutField.style.display = exitCheck.checked ? "block" : "none";
  }
});

document.addEventListener("input", (event) => {
  const customInput = event.target.closest("#rule-new-section-input");
  if (customInput) {
    const hiddenInput = document.getElementById("rule-section-hidden");
    if (hiddenInput) hiddenInput.value = customInput.value.trim();
    return;
  }
  const amountInput = event.target.closest("[data-loan-amount]");
  if (!amountInput) return;
  const form = amountInput.closest("form");
  const preview = form?.querySelector("[data-loan-interest-preview]");
  if (!preview) return;
  const amount = parseRupeeAmount(amountInput.value);
  preview.value = Number.isFinite(amount) ? money((amount * state.settings.loanInterestRateMonthly) / 100) : money(0);
});

document.addEventListener("change", (event) => {
  const select = event.target.closest("[data-loan-member-select]");
  if (!select) return;
  const form = select.closest("form");
  const phoneInput = form?.querySelector("[data-loan-member-phone]");
  if (!phoneInput) return;
  const selected = select.options[select.selectedIndex];
  phoneInput.value = selected?.dataset.phone || "";
});

// ── MPIN screen & setup ──────────────────────────────────────────────────────

function renderMpinScreen() {
  const member = currentUser() || mpinIdentity();
  const name = member?.name?.split(" ")[0] || "Member";
  const dots = Array.from({ length: 4 }, (_, i) =>
    `<div class="mpin-dot ${i < mpinEntry.length ? "mpin-dot-filled" : ""}"></div>`
  ).join("");
  const keys = [1,2,3,4,5,6,7,8,9,"","0","⌫"];
  const pad = keys.map(k => k === ""
    ? `<div></div>`
    : `<button class="mpin-key" data-mpin-key="${k}" type="button">${k}</button>`
  ).join("");
  document.getElementById("app").innerHTML = `
    <div class="mpin-screen">
      <div class="mpin-inner">
        <div class="mpin-avatar">${name[0].toUpperCase()}</div>
        <p class="mpin-welcome">Welcome back, <strong>${escapeHtml(name)}</strong></p>
        <p class="mpin-label">Enter your 4-digit MPIN</p>
        <div class="mpin-dots">${dots}</div>
        <div class="mpin-pad">${pad}</div>
        <button class="text-link" id="mpin-use-password" type="button" style="margin-top:24px;font-size:13px;">Use password instead</button>
        <button class="text-link" id="mpin-reset" type="button" style="margin-top:8px;font-size:12px;color:var(--muted);">Forgot MPIN? Reset</button>
      </div>
    </div>
  `;
  document.getElementById("mpin-use-password").addEventListener("click", async () => {
    mpinPending = false;
    mpinEntry = "";
    sessionStorage.removeItem("mpinVerified");
    clearMpinIdentity();
    if (liveBackendReady) await supabaseClient.auth.signOut({ scope: "local" });
    state.currentUserId = null;
    saveState();
    render();
  });
  document.getElementById("mpin-reset").addEventListener("click", () => showMpinResetModal());
  document.querySelectorAll(".mpin-key").forEach(btn => {
    btn.addEventListener("click", () => handleMpinKey(btn.dataset.mpinKey));
  });
}

async function handleMpinKey(key) {
  if (key === "⌫") {
    mpinEntry = mpinEntry.slice(0, -1);
  } else if (mpinEntry.length < 4) {
    mpinEntry += key;
  }
  if (mpinEntry.length === 4) {
    if (await validateMpin(mpinEntry)) {
      mpinEntry = "";
      sessionStorage.setItem("mpinVerified", "1");
      // If the live session isn't loaded yet (app reopened after a long gap),
      // restore it now that the member has proven identity via MPIN.
      if (liveBackendReady && !state.currentUserId) {
        try { await loadLiveState(); } catch (_) {}
      }
      if (!liveBackendReady || state.currentUserId) {
        mpinPending = false;
        render();
      } else {
        // Refresh token is truly dead — password is required to re-authenticate.
        // Keep it painless: drop to login with the phone pre-filled.
        mpinPending = false;
        sessionStorage.removeItem("mpinVerified");
        const phone = mpinIdentity()?.phone || "";
        renderAuth("login");
        const phoneInput = document.querySelector('[data-form="login"] [name="phone"]');
        if (phoneInput && phone) phoneInput.value = phone;
        showToast("Session expired — please enter your password once to continue.");
      }
    } else {
      const dots = document.querySelectorAll(".mpin-dot");
      dots.forEach(d => d.classList.add("mpin-dot-error"));
      setTimeout(() => {
        mpinEntry = "";
        renderMpinScreen();
      }, 600);
      return;
    }
  } else {
    renderMpinScreen();
  }
}

function showMpinResetModal() {
  const modal = document.createElement("div");
  modal.className = "rules-modal-overlay";
  modal.style.alignItems = "center";
  modal.innerHTML = `
    <div style="background:var(--panel);border-radius:20px;padding:28px 24px 24px;width:288px;text-align:center;box-shadow:0 24px 60px rgba(28,28,46,0.22);">
      <h3 style="margin:0 0 6px;font-size:17px;font-weight:700;color:var(--ink);">Reset MPIN</h3>
      <p style="margin:0 0 20px;font-size:13px;color:var(--muted);line-height:1.45;">Enter your password to confirm your identity</p>
      <div class="form-group" style="text-align:left;">
        <label style="font-size:13px;font-weight:600;color:var(--ink);">Password</label>
        <input type="password" class="form-input mpin-reset-pw" placeholder="Your password" autocomplete="current-password" style="margin-top:6px;width:100%;"/>
      </div>
      <p class="mpin-reset-error" style="color:#dc2626;font-size:13px;margin:8px 0 0;display:none;text-align:left;"></p>
      <div style="display:flex;gap:10px;margin-top:20px;">
        <button class="btn btn-outline mpin-reset-cancel" style="flex:1;">Cancel</button>
        <button class="btn btn-primary mpin-reset-submit" style="flex:1;">Verify &amp; Reset</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
  modal.querySelector(".mpin-reset-pw").focus();
  modal.querySelector(".mpin-reset-cancel").addEventListener("click", () => {
    modal.remove();
    document.body.style.overflow = "";
  });
  modal.querySelector(".mpin-reset-submit").addEventListener("click", async () => {
    const pw = modal.querySelector(".mpin-reset-pw").value;
    const errorEl = modal.querySelector(".mpin-reset-error");
    const submitBtn = modal.querySelector(".mpin-reset-submit");
    if (!pw) { errorEl.textContent = "Please enter your password."; errorEl.style.display = ""; return; }
    submitBtn.disabled = true;
    submitBtn.textContent = "Verifying…";
    const email = currentUser()?.email;
    if (!email) {
      errorEl.textContent = "Could not verify identity. Try logging out and back in.";
      errorEl.style.display = "";
      submitBtn.disabled = false;
      submitBtn.textContent = "Verify & Reset";
      return;
    }
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password: pw });
    if (error) {
      errorEl.textContent = "Wrong password. Try again.";
      errorEl.style.display = "";
      submitBtn.disabled = false;
      submitBtn.textContent = "Verify & Reset";
      return;
    }
    await clearMpin();
    modal.remove();
    document.body.style.overflow = "";
    mpinPending = false;
    mpinEntry = "";
    render();
    setTimeout(showMpinSetupModal, 400);
  });
}

function showMpinSetupModal() {
  if (document.getElementById("mpin-setup-modal")) return;
  let pin1 = "";
  const modal = document.createElement("div");
  modal.id = "mpin-setup-modal";
  modal.className = "rules-modal-overlay";
  modal.style.alignItems = "center";
  const render = () => {
    const dots = Array.from({ length: 4 }, (_, i) =>
      `<div class="mpin-dot ${i < pin1.length ? "mpin-dot-filled" : ""}"></div>`
    ).join("");
    const keys = [1,2,3,4,5,6,7,8,9,"","0","⌫"];
    const pad = keys.map(k => k === ""
      ? `<div></div>`
      : `<button class="mpin-key mpin-key-sm" data-setup-key="${k}" type="button">${k}</button>`
    ).join("");
    modal.innerHTML = `
      <div style="background:var(--panel);border-radius:20px;padding:28px 24px 24px;width:288px;text-align:center;box-shadow:0 24px 60px rgba(28,28,46,0.22);">
        <h3 style="margin:0 0 6px;font-size:17px;font-weight:700;color:var(--ink);">Set your MPIN</h3>
        <p style="margin:0 0 20px;font-size:13px;color:var(--muted);line-height:1.45;">Choose a 4-digit PIN for quick access next time</p>
        <div class="mpin-dots" style="margin-bottom:20px;">${dots}</div>
        <div class="mpin-pad mpin-pad-sm">${pad}</div>
        <button class="text-link" id="mpin-setup-skip" type="button" style="margin-top:16px;font-size:12px;color:var(--muted);">Skip for now</button>
      </div>`;
    modal.querySelector("#mpin-setup-skip").addEventListener("click", () => {
      modal.remove();
      document.body.style.overflow = "";
    });
    modal.querySelectorAll("[data-setup-key]").forEach(btn => {
      btn.addEventListener("click", async () => {
        const k = btn.dataset.setupKey;
        if (k === "⌫") { pin1 = pin1.slice(0, -1); render(); return; }
        if (pin1.length < 4) pin1 += k;
        if (pin1.length === 4) {
          await saveMpin(pin1);
          modal.remove();
          document.body.style.overflow = "";
          showToast("MPIN set! Use it next time you open the app.");
        } else { render(); }
      });
    });
  };
  render();
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
}

// ── Form / event wiring ─────────────────────────────────────────────────────

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.form;
  setFormLoading(form, true);
  try {
    if (type === "login") await login(data);
    if (type === "signup") await signup(data);
    if (type === "reset") await resetPassword(data);
    if (type === "set-new-password") await setNewPassword(data);
    if (type === "loan-request") await requestLoan(data);
    if (type === "manual-loan") await addManualLoan(data);
    if (type === "save-profile-info") await saveProfileInfo(data);
    if (type === "save-nominee") await saveNominee(data);
    if (type === "change-mpin") {
      if (data.new_mpin !== data.confirm_mpin) throw new Error("MPINs do not match.");
      if (!/^\d{4}$/.test(data.new_mpin)) throw new Error("MPIN must be exactly 4 digits.");
      await saveMpin(data.new_mpin);
      showToast("MPIN updated successfully.");
      form.reset();
    }
    if (type === "start-new-year") await startNewYear(data);
    if (type === "add-rule") {
      const section = (data.section || "").trim();
      const item = (data.item || "").trim();
      if (!section || !item) throw new Error("Section and rule text are required.");
      if (!liveBackendReady) throw new Error("Live backend required.");
      const maxOrder = Math.max(0, ...state.rules.filter((r) => r.section === section).map((r) => r.sort_order || 0));
      await liveQuery(supabaseClient.from("rules").insert({ section, item, sort_order: maxOrder + 1 }));
      await loadLiveState();
      render();
      showToast("Rule added.");
    }
  } catch (error) {
    showToast(error.message || "Something went wrong.");
    setFormLoading(form, false);
  }
});

async function login(data) {
  const phone = requireValidPhone(data.phone);
  if (liveBackendReady) {
    const authEmail = await resolveAuthEmail(phone);
    // Drop any previously-cached MPIN identity so only the freshly authenticated
    // user can be cached (loadLiveState re-caches them if they have an MPIN).
    clearMpinIdentity();
    await liveQuery(supabaseClient.auth.signInWithPassword({
      email: authEmail,
      password: data.password,
    }));
    await loadLiveState();
    const member = currentUser();
    const { data: authData } = await supabaseClient.auth.getUser();
    const profile = state.members.find((item) => item.authUserId === authData?.user?.id);
    if (!member) {
      if (!profile) {
        await liveQuery(supabaseClient.rpc("register_profile", {
          p_full_name: "",
          p_phone: phone,
        }));
        await loadLiveState();
        const claimedMember = currentUser();
        if (claimedMember) {
          await addLiveAudit(`${claimedMember.name} logged in.`, "login");
          await loadLiveState();
          state.activeTab = "dashboard";
          render();
          return;
        }
      }
      if (profile && profile.status === "exited") {
        await supabaseClient.auth.signOut();
        state.currentUserId = null;
        showToast("Your access has been revoked. Use the Signup form to re-request access.");
        render();
        return;
      }
      if (profile && profile.status !== "active") {
        await supabaseClient.auth.signOut();
        state.currentUserId = null;
        showToast("Account is pending admin approval.");
        render();
        return;
      }
      showToast("Profile not found. Please signup first.");
      return;
    }
    if (member.status === "exited") {
      await supabaseClient.auth.signOut();
      state.currentUserId = null;
      showToast("Your access has been revoked. Use the Signup form to re-request access.");
      render();
      return;
    }
    if (member.status !== "active") {
      await supabaseClient.auth.signOut();
      state.currentUserId = null;
      showToast("Account is pending admin approval.");
      render();
      return;
    }
    await addLiveAudit(`${member.name} logged in.`, "login");
    await loadLiveState();
    state.activeTab = "dashboard";
    if (mpinSet()) {
      mpinPending = true;
      render();
      return;
    }
    render();
    setTimeout(showMpinSetupModal, 600);
    return;
  }

  const member = state.members.find((item) => item.phone === phone && item.password === data.password);
  if (!member) {
    showToast("Invalid phone or password.");
    return;
  }
  if (member.status !== "active") {
    showToast("Account is pending admin approval.");
    return;
  }
  state.currentUserId = member.id;
  state.activeTab = "dashboard";
  state.audit.push({ id: uid("a"), date: today(), text: `${member.name} logged in.` });
  saveState();
  render();
}

async function signup(data) {
  const phone = requireValidPhone(data.phone);
  const name = data.name.trim();
  if (!name) {
    throw new Error("Enter member name.");
  }

  if (liveBackendReady) {
    const signupEmail = (data.email || "").trim().toLowerCase() || phoneEmail(phone);
    const { error: signUpError } = await supabaseClient.auth.signUp({
      email: signupEmail,
      password: data.password,
    });
    if (signUpError) {
      const msg = signUpError.message?.toLowerCase() || "";
      if (msg.includes("already registered") || msg.includes("already exists") || signUpError.status === 422) {
        // Auth account exists — member was previously revoked and is re-registering.
        // Sign in with their credentials to get a session so register_profile can run.
        const resolvedEmail = await resolveAuthEmail(phone);
        const { error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: resolvedEmail,
          password: data.password,
        });
        if (signInError) {
          throw new Error("Your account exists with a different password. Use your original password to re-register, or contact Manjunath Banakar.");
        }
      } else {
        throw signUpError;
      }
    }
    await liveQuery(supabaseClient.rpc("register_profile", {
      p_full_name: name,
      p_phone: phone,
      p_email: signupEmail,
    }));
    if (data.avatar instanceof File && data.avatar.size > 0) {
      const { data: authUser } = await supabaseClient.auth.getUser();
      if (authUser?.user) {
        const { data: profile } = await supabaseClient.from("profiles").select("id").eq("auth_user_id", authUser.user.id).single();
        if (profile?.id) await uploadAvatarPhoto(data.avatar, profile.id).catch(() => {});
      }
    }
    await supabaseClient.auth.signOut();
    await loadLiveState();
    showToast(phone === PRESIDENT_PHONE ? "President signup complete. Login now." : "Signup sent to admin for approval.");
    renderAuth("login");
    return;
  }

  if (state.members.some((member) => member.phone === phone) || state.signupRequests.some((request) => request.phone === phone)) {
    showToast("Phone number already exists or is pending.");
    return;
  }
  state.signupRequests.push({ id: uid("s"), name, phone, password: data.password, date: today() });
  state.audit.push({ id: uid("a"), date: today(), text: `Signup requested by ${name}.` });
  saveState();
  showToast("Signup request sent to admin.");
  renderAuth("login");
}

async function resetPassword(data) {
  if (liveBackendReady) {
    const input = (data.phone_or_email || "").trim();
    if (!input) throw new Error("Enter your phone number or email.");
    let email;
    if (input.includes("@")) {
      email = input.toLowerCase();
    } else {
      const phone = requireValidPhone(input);
      email = await resolveAuthEmail(phone);
    }
    await liveQuery(supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: "https://manjunathbscloud.github.io/banaFinClub/",
    }));
    showToast("Password reset email sent. Check your inbox.");
    renderAuth("login");
    return;
  }

  state.audit.push({ id: uid("a"), date: today(), text: `Password reset requested for ${data.phone_or_email || "unknown"}.` });
  saveState();
  showToast("Reset request recorded. Backend OTP will be connected later.");
}

async function setNewPassword(data) {
  if (!data.password || data.password.length < 6) throw new Error("Password must be at least 6 characters.");
  await liveQuery(supabaseClient.auth.updateUser({ password: data.password }));
  await supabaseClient.auth.signOut();
  showToast("Password updated. Please login with your new password.");
  renderAuth("login");
}

function updateEmiPreview() {
  const previewEl = document.getElementById("lr-emi-preview");
  if (!previewEl) return;
  const amountEl = document.getElementById("lr-amount");
  const tenureEl = document.getElementById("lr-tenure");
  const tenureRow = document.getElementById("lr-tenure-row");
  if (!amountEl || !tenureEl || tenureRow?.style.display === "none") { previewEl.innerHTML = ""; return; }
  const principal = Number(amountEl.value);
  const tenure = Number(tenureEl.value);
  if (!principal || !tenure || tenure < 1) { previewEl.innerHTML = ""; return; }
  const { emiAmount } = calcEmi(principal, tenure);
  previewEl.innerHTML = `EMI: <strong>${money(emiAmount)}/month</strong> for ${tenure} months`;
}

async function toggleEmiEnabled() {
  if (!liveBackendReady) { showToast("Live backend required."); return; }
  const newVal = !state.settings.emiEnabled;
  await liveQuery(supabaseClient.from("settings").upsert({
    id: "emi_settings",
    value: { enabled: newVal, interestRate: Number(state.settings.emiLoanInterestRateMonthly || 1.5) },
  }));
  await loadLiveState();
  showToast(`EMI loans ${newVal ? "enabled" : "disabled"}.`);
  render();
}

async function requestLoan(data) {
  const user = currentUser();
  const loanType = data.loan_type || "full";
  const tenureMonths = loanType === "emi" ? Number(data.tenure_months) : null;
  if (loanType === "emi" && (!tenureMonths || tenureMonths < 1)) throw new Error("Please enter a valid tenure (months).");
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("loan_requests").insert({
      profile_id: user.id,
      amount: Number(data.amount),
      reason: data.reason.trim(),
      loan_type: loanType,
      tenure_months: tenureMonths,
    }));
    await addLiveAudit(`${user.name} requested loan ${money(data.amount)}${loanType === "emi" ? ` (EMI ${tenureMonths}mo)` : ""}.`, "loan_requested");
    const admins = state.members.filter(m => m.role === "admin" && m.status === "active");
    for (const admin of admins) {
      await notifyMember(admin.id, "loan_requested", "New loan request", `${user.name} has requested a ${loanType === "emi" ? `EMI loan of ${money(Number(data.amount))} for ${tenureMonths} months` : `loan of ${money(Number(data.amount))}`}. Please review it in the admin panel.`);
    }
    const allMemberBody = loanType === "emi"
      ? `${user.name} has applied for an EMI loan of ${money(Number(data.amount))} for ${tenureMonths} months. Pending admin approval.`
      : `${user.name} has applied for a loan of ${money(Number(data.amount))} (full repayment). Pending admin approval.`;
    await notifyAllActiveMembers("loan_requested", "New Loan Application", allMemberBody);
    await loadLiveState();
    showToast("Loan request submitted.");
    render();
    return;
  }

  state.loanRequests.push({ id: uid("q"), memberId: user.id, amount: Number(data.amount), reason: data.reason.trim(), status: "pending", date: today(), loanType, tenureMonths });
  state.audit.push({ id: uid("a"), date: today(), text: `${user.name} requested loan ${money(data.amount)}.` });
  saveState();
  showToast("Loan request submitted.");
  render();
}

async function addManualLoan(data) {
  if (!isAdmin()) throw new Error("Only admin can add current loans.");
  const memberName = String(data.memberName || "").trim();
  if (!memberName) throw new Error("Enter member name.");
  const memberPhone = requireValidPhone(data.memberPhone);
  const amount = parseRupeeAmount(data.amount);
  const loanDate = data.from || today();
  const renewalDate = data.renewalOrReturnDate || "";
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a valid loan amount.");
  if (!renewalDate) throw new Error("Enter renewal date.");

  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("current_loans").insert({
      member_name: memberName,
      member_phone: memberPhone,
      principal: amount,
      principal_paid: 0,
      interest_paid: 0,
      interest_rate_monthly: state.settings.loanInterestRateMonthly,
      status: "active",
      disbursed_at: loanDate,
      renewal_or_return_date: renewalDate,
      created_by: currentProfileId(),
    }));
    await addLiveAudit(`Added current loan ${money(amount)} for ${memberName}.`, "current_loan_added");
    await loadLiveState();
    showToast("Current loan added.");
    render();
    return;
  }

  state.loans.unshift({
    id: uid("l"),
    memberName,
    memberPhone,
    amount,
    principalPaid: 0,
    interestPaid: 0,
    interestRateMonthly: state.settings.loanInterestRateMonthly,
    from: loanDate,
    renewalOrReturnDate: renewalDate,
    status: "active",
  });
  state.audit.push({ id: uid("a"), date: today(), text: `Added current loan ${money(amount)} for ${memberName}.` });
  saveState();
  showToast("Current loan added.");
  render();
}

async function clearCurrentLoan(id) {
  if (!isAdmin()) throw new Error("Only admin can clear current loans.");
  const loan = state.loans.find((item) => item.id === id);
  if (!loan) throw new Error("Loan not found.");
  const closedAt = today();
  const interestPaid = calculatedInterestPaid(loan, closedAt);

  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("current_loans").update({
      status: "clear",
      principal_paid: loan.amount,
      interest_paid: interestPaid,
      closed_at: closedAt,
    }).eq("id", id));
    await addLiveAudit(`Marked loan clear for ${loanMemberName(loan)}. Interest paid ${money(interestPaid)}.`, "current_loan_cleared");
    await loadLiveState();
    await insertStatement("credit", loan.amount, `${loanMemberName(loan)} credited`, id);
    showToast("Loan marked clear.");
    render();
    return;
  }

  loan.status = "clear";
  loan.principalPaid = loan.amount;
  loan.interestPaid = interestPaid;
  loan.closedAt = closedAt;
  state.audit.push({ id: uid("a"), date: today(), text: `Marked loan clear for ${loanMemberName(loan)}. Interest paid ${money(interestPaid)}.` });
  saveState();
  showToast("Loan marked clear.");
  render();
}

async function deleteCurrentLoan(id) {
  if (!isAdmin()) throw new Error("Only admin can delete current loans.");
  const loan = state.loans.find((item) => item.id === id);
  if (!loan) throw new Error("Loan not found.");

  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("current_loans").delete().eq("id", id));
    await addLiveAudit(`Deleted current loan for ${loanMemberName(loan)}.`, "current_loan_deleted");
    await loadLiveState();
    showToast("Current loan deleted.");
    render();
    return;
  }

  state.loans = state.loans.filter((item) => item.id !== id);
  state.audit.push({ id: uid("a"), date: today(), text: `Deleted current loan for ${loanMemberName(loan)}.` });
  saveState();
  showToast("Current loan deleted.");
  render();
}

async function approveSignup(id) {
  const request = state.signupRequests.find((item) => item.id === id);
  if (!request) return;
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("profiles").update({
      status: "active",
      role: "member",
      approved_at: new Date().toISOString(),
      approved_by: currentProfileId(),
    }).eq("id", id));
    await addLiveAudit(`Approved new member ${request.name}.`, "member_approved");
    await notifyMember(id, "signup_approved", "Welcome to Banakar FinClub!", `Hi ${request.name}, your membership has been approved! You can now log in to the app.`);
    await loadLiveState();
    showToast("Member approved.");
    render();
    return;
  }

  state.members.push({ id: uid("m"), name: request.name, phone: request.phone, role: "member", status: "active", password: request.password });
  state.signupRequests = state.signupRequests.filter((item) => item.id !== id);
  state.audit.push({ id: uid("a"), date: today(), text: `Approved new member ${request.name}.` });
  saveState();
  showToast("Member approved.");
  render();
}

async function rejectSignup(id) {
  const request = state.signupRequests.find((item) => item.id === id);
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("profiles").update({ status: "rejected" }).eq("id", id));
    await addLiveAudit(`Rejected signup ${request?.name || id}.`, "member_rejected");
    await notifyMember(id, "signup_rejected", "Membership request not approved", `Hi ${request?.name || "there"}, your membership request could not be approved at this time. Please contact the admin for more details.`);
    await loadLiveState();
    render();
    return;
  }

  state.signupRequests = state.signupRequests.filter((item) => item.id !== id);
  state.audit.push({ id: uid("a"), date: today(), text: `Rejected signup ${request?.name || id}.` });
  saveState();
  render();
}

async function revokeMemberAccess(id) {
  const member = memberById(id);
  if (!member || !isAdmin()) return;
  if (member.id === currentProfileId()) {
    showToast("Cannot revoke your own access.");
    return;
  }
  const confirmed = window.confirm(`Revoke ${member.name}'s access?\n\nThey will be blocked from logging in but can signup again to re-request access.`);
  if (!confirmed) return;

  if (liveBackendReady) {
    await liveQuery(supabaseClient.rpc("revoke_member_access", { p_profile_id: id }));
    await addLiveAudit(`Revoked access for ${member.name}.`, "member_access_revoked");
    await loadLiveState();
    showToast("Access revoked.");
    render();
    return;
  }

  state.members = state.members.filter((item) => item.id !== id);
  state.signupRequests = state.signupRequests.filter((item) => item.id !== id);
  state.audit.push({ id: uid("a"), date: today(), text: `Revoked access for ${member.name}.` });
  saveState();
  showToast("Access revoked.");
  render();
}

async function approveLoan(id) {
  const request = state.loanRequests.find((item) => item.id === id);
  if (!request) return;
  const member = memberById(request.memberId);
  const loanType = request.loanType || "full";
  const tenure = request.tenureMonths || null;
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  const renewalDateStr = renewalDate.toISOString().slice(0, 10);
  const interestRate = loanType === "emi"
    ? Number(state.settings.emiLoanInterestRateMonthly || 1.5)
    : Number(state.settings.loanInterestRateMonthly || 1.25);
  const emiCalc = loanType === "emi" ? calcEmi(request.amount, tenure) : null;

  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("loan_requests").update({
      status: "approved",
      decided_at: new Date().toISOString(),
      decided_by: currentProfileId(),
    }).eq("id", id));
    const loanRow = await liveQuery(supabaseClient.from("current_loans").insert({
      member_name: member?.name || "",
      member_phone: member?.phone || "",
      principal: request.amount,
      principal_paid: 0,
      interest_paid: 0,
      interest_rate_monthly: interestRate,
      monthly_interest: loanType === "full" ? Math.round(request.amount * interestRate / 100) : 0,
      status: "active",
      purpose: request.reason,
      disbursed_at: today(),
      renewal_or_return_date: renewalDateStr,
      created_by: currentProfileId(),
      loan_type: loanType,
      tenure_months: tenure,
      emi_amount: emiCalc ? emiCalc.emiAmount : null,
      emis_paid: 0,
    }).select("id").single());
    // Generate EMI schedule for EMI-type loans
    if (loanType === "emi" && loanRow?.id && tenure) {
      const startMonth = currentMonth();
      const [sy, sm] = startMonth.split("-").map(Number);
      const emiRows = Array.from({ length: tenure }, (_, i) => {
        const d = new Date(sy, sm - 1 + i);
        const dueMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return {
          loan_id: loanRow.id, emi_number: i + 1, due_month: dueMonth,
          amount: emiCalc.emiAmount, principal_part: emiCalc.principalPart,
          interest_part: emiCalc.interestPart, status: "pending",
        };
      });
      await liveQuery(supabaseClient.from("loan_emis").insert(emiRows));
    }
    await addLiveAudit(`Approved ${loanType === "emi" ? `EMI loan (${tenure}mo)` : "loan"} ${money(request.amount)} for ${member?.name}.`, "loan_approved");
    if (request.memberId) {
      await notifyMember(
        request.memberId, "loan_approved", "Loan approved",
        `Your ${loanType === "emi" ? `EMI loan of ${money(request.amount)} (${tenure} months, ${money(emiCalc?.emiAmount)}/mo)` : `loan of ${money(request.amount)}`} has been approved.`,
        id
      );
    }
    await notifyAllActiveMembers(
      "loan_disbursed",
      loanType === "emi" ? "EMI Loan disbursed" : "Loan disbursed",
      loanType === "emi"
        ? `An EMI loan of ${money(request.amount)} (${tenure} months · ${money(emiCalc?.emiAmount)}/mo) has been disbursed to ${member?.name || "a member"}.`
        : `A loan of ${money(request.amount)} has been disbursed to ${member?.name || "a member"}.`,
      id
    );
    await loadLiveState();
    await insertStatement("debit", request.amount, `${member?.name || "Member"} debited`, id);
    showToast("Loan approved.");
    render();
    return;
  }

  request.status = "approved";
  state.loans.push({ id: uid("l"), memberId: request.memberId, memberName: member?.name || "", amount: request.amount, principalPaid: 0, from: today(), renewalOrReturnDate: renewalDateStr, status: "active", purpose: request.reason, loanType, tenureMonths: tenure, emiAmount: emiCalc?.emiAmount || 0, emisPaid: 0 });
  state.audit.push({ id: uid("a"), date: today(), text: `Approved loan ${money(request.amount)} for ${member?.name}.` });
  saveState();
  showToast("Loan approved.");
  render();
}

async function rejectLoan(id) {
  const request = state.loanRequests.find((item) => item.id === id);
  if (!request) return;
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("loan_requests").update({
      status: "rejected",
      decided_at: new Date().toISOString(),
      decided_by: currentProfileId(),
    }).eq("id", id));
    await addLiveAudit(`Rejected loan request for ${memberById(request.memberId)?.name}.`, "loan_rejected");
    await notifyMember(request.memberId, "loan_rejected", "Loan request not approved", `Your ${request.loanType === "emi" ? "EMI loan" : "loan"} request of ${money(request.amount)} could not be approved at this time. Please contact the admin for more information.`);
    await loadLiveState();
    render();
    return;
  }

  request.status = "rejected";
  state.audit.push({ id: uid("a"), date: today(), text: `Rejected loan request for ${memberById(request.memberId)?.name}.` });
  saveState();
  render();
}

async function notifyAllActiveMembers(type, title, body, relatedId = null) {
  if (!liveBackendReady) return;
  const active = state.members.filter((m) => m.status === "active");
  const rows = active.map((m) => ({ profile_id: m.id, type, title, body, related_id: relatedId }));
  await liveQuery(supabaseClient.from("notifications").insert(rows));
  for (const m of active) {
    supabaseClient.functions.invoke("send-push", { body: { profile_id: m.id, title, body } }).catch(() => {});
    supabaseClient.functions.invoke("send-sms", { body: { profile_id: m.id, message: body } }).catch(() => {});
  }
}

async function notifyMember(profileId, type, title, body, relatedId = null) {
  if (!liveBackendReady || !profileId) return;
  await liveQuery(supabaseClient.from("notifications").insert({ profile_id: profileId, type, title, body, related_id: relatedId }));
  supabaseClient.functions.invoke("send-push", { body: { profile_id: profileId, title, body } }).catch(() => {});
  supabaseClient.functions.invoke("send-sms", { body: { profile_id: profileId, message: body } }).catch(() => {});
}

async function requestExtension(loanId) {
  const loan = state.loans.find((l) => l.id === loanId);
  if (!loan) { showToast("Loan not found."); return; }
  if (!liveBackendReady) { showToast("Live backend required for extension requests."); return; }

  const existing = (state.extensionRequests || []).find((e) => e.loanId === loanId && e.status === "pending");
  if (existing) { showToast("Extension already requested."); return; }

  await liveQuery(supabaseClient.from("loan_extension_requests").insert({
    loan_id: loanId,
    profile_id: currentProfileId(),
    status: "pending",
  }));

  const memberName = loanMemberName(loan);
  await notifyAllActiveMembers(
    "loan_extension_requested",
    "Loan extension requested",
    `${memberName} has requested a 1-year extension for their loan of ${money(loan.amount)} (renewal: ${loanRenewalDate(loan) || "-"}).`,
    loanId
  );

  await addLiveAudit(`${memberName} requested loan extension for ${money(loan.amount)}.`, "loan_extension_requested");
  await loadLiveState();
  showToast("Extension request submitted. All members notified.");
  render();
}

async function approveExtension(id, loanId) {
  const loan = state.loans.find((l) => l.id === loanId);
  if (!loan || !liveBackendReady) { showToast("Cannot approve extension."); return; }

  const newRenewal = new Date(loanRenewalDate(loan) || today());
  newRenewal.setFullYear(newRenewal.getFullYear() + 1);
  const newRenewalStr = newRenewal.toISOString().slice(0, 10);

  await liveQuery(supabaseClient.from("loan_extension_requests").update({
    status: "approved",
    decided_at: new Date().toISOString(),
    decided_by: currentProfileId(),
  }).eq("id", id));

  await liveQuery(supabaseClient.from("current_loans").update({
    renewal_or_return_date: newRenewalStr,
  }).eq("id", loanId));

  const memberName = loanMemberName(loan);
  await notifyAllActiveMembers(
    "loan_extension_approved",
    "Loan extension approved",
    `${memberName}'s loan of ${money(loan.amount)} has been extended. New renewal date: ${newRenewalStr}.`,
    loanId
  );

  await addLiveAudit(`Approved loan extension for ${memberName}. New renewal: ${newRenewalStr}.`, "loan_extension_approved");
  await loadLiveState();
  showToast("Extension approved. New renewal date set to " + newRenewalStr + ".");
  render();
}

async function rejectExtension(id, profileId) {
  if (!liveBackendReady) { showToast("Live backend required."); return; }

  await liveQuery(supabaseClient.from("loan_extension_requests").update({
    status: "rejected",
    decided_at: new Date().toISOString(),
    decided_by: currentProfileId(),
  }).eq("id", id));

  await notifyMember(
    profileId,
    "loan_extension_rejected",
    "Loan extension request rejected",
    "Your loan extension request has been rejected by the admin. Please contact the president for details.",
    id
  );

  await addLiveAudit(`Rejected loan extension request ${id}.`, "loan_extension_rejected");
  await loadLiveState();
  showToast("Extension request rejected.");
  render();
}

// ── Year Close / New Year Start ───────────────────────────────────────────────

async function saveMeetingExpense(amount) {
  if (!liveBackendReady) { showToast("Live backend required."); return; }
  const activeYearDbYear = 2020 + (state.settings.activeYearNumber || 6);
  const roundedAmount = Math.round(amount);
  await liveQuery(supabaseClient.from("deposit_summaries")
    .update({ expenditure: roundedAmount })
    .eq("year", activeYearDbYear));
  const lastBalance = state.statementRows[0]?.balance || 0;
  await liveQuery(supabaseClient.from("statements").insert({
    date: today(),
    type: "debit",
    amount: roundedAmount,
    description: `Year ${state.settings.activeYearNumber || 6} annual meeting expense`,
    balance: lastBalance - roundedAmount,
  }));
  await loadLiveState();
  showToast(`Meeting expense of ${money(roundedAmount)} saved.`);
  render();
}

async function saveMeetingNotes(yearDbYear, data) {
  if (!liveBackendReady || !isAdmin()) { showToast("Admin access required."); return; }
  const existing = state.meetingRecords.find(r => r.year === yearDbYear);
  if (existing) {
    await liveQuery(supabaseClient.from("meeting_records")
      .update({ date: data.date, venue: data.venue, notes: data.notes, decisions: data.decisions, updated_at: new Date().toISOString() })
      .eq("year", yearDbYear));
  } else {
    await liveQuery(supabaseClient.from("meeting_records")
      .insert({ year: yearDbYear, date: data.date, venue: data.venue, notes: data.notes, decisions: data.decisions }));
  }
  await loadLiveState();
  showToast("Meeting notes saved.");
}

async function uploadMeetingPhoto(yearDbYear, file) {
  if (!liveBackendReady || !isAdmin()) throw new Error("Admin access required.");
  const blob = await compressImage(file, 1200, 0.85);
  const suffix = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const path = `year-${yearDbYear}/${suffix}.jpg`;
  const { error } = await supabaseClient.storage.from("meeting-photos").upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  const { data: urlData } = supabaseClient.storage.from("meeting-photos").getPublicUrl(path);
  const existing = state.meetingRecords.find(r => r.year === yearDbYear);
  const currentPhotos = existing?.photos || [];
  if (existing) {
    await liveQuery(supabaseClient.from("meeting_records")
      .update({ photos: [...currentPhotos, urlData.publicUrl], updated_at: new Date().toISOString() })
      .eq("year", yearDbYear));
  } else {
    await liveQuery(supabaseClient.from("meeting_records")
      .insert({ year: yearDbYear, photos: [urlData.publicUrl] }));
  }
}

async function deleteMeetingPhoto(yearDbYear, urlToRemove) {
  if (!liveBackendReady || !isAdmin()) { showToast("Admin access required."); return; }
  const existing = state.meetingRecords.find(r => r.year === yearDbYear);
  const currentPhotos = existing?.photos || [];
  await liveQuery(supabaseClient.from("meeting_records")
    .update({ photos: currentPhotos.filter(u => u !== urlToRemove), updated_at: new Date().toISOString() })
    .eq("year", yearDbYear));
  await loadLiveState();
  showToast("Photo removed.");
}

function showPostCloseDialog(closedYearNum) {
  const existing = document.getElementById("post-close-modal");
  if (existing) existing.remove();
  const yearDbYear = 2020 + closedYearNum;
  const existingPhotos = state.meetingRecords.find(r => r.year === yearDbYear)?.photos || [];
  const html = `
    <div id="post-close-modal" class="rules-modal-overlay" data-action="close-post-close">
      <div class="rules-modal-sheet">
        <div class="rules-modal-header">
          <div><h3>🎉 Year ${closedYearNum} Closed</h3><p>Record your annual meeting details</p></div>
          <button class="rules-modal-close" data-action="close-post-close">✕</button>
        </div>
        <div class="rules-modal-body">
          <div class="meeting-editor-row" style="margin-bottom:12px;">
            <label>Meeting Date</label>
            <input type="date" id="pc-date" />
          </div>
          <div class="meeting-editor-row" style="margin-bottom:12px;">
            <label>Venue / Location</label>
            <input type="text" id="pc-venue" placeholder="e.g. Wonder Valley Resort, Dandeli" />
          </div>
          <div class="meeting-editor-row" style="margin-bottom:12px;">
            <label>Meeting Expenditure (₹)</label>
            <input type="number" id="pc-expenditure" placeholder="0" min="0" />
          </div>
          <div class="meeting-editor-row" style="margin-bottom:12px;">
            <label>Notes / Highlights</label>
            <textarea id="pc-notes" rows="3" placeholder="What happened at the meeting..." style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:13px;resize:vertical;"></textarea>
          </div>
          <div class="meeting-editor-row" style="margin-bottom:16px;">
            <label>Key Decisions (one per line)</label>
            <textarea id="pc-decisions" rows="4" placeholder="Monthly deposit rate for next year&#10;New loan approved for..." style="width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:8px;padding:8px 10px;font-size:13px;resize:vertical;"></textarea>
          </div>
          <div style="margin-bottom:16px;">
            <p class="meeting-notes-title" style="margin-bottom:8px;">📸 Photos</p>
            <label for="pc-photo-input" class="photos-btn" style="cursor:pointer;display:inline-block;">+ Add Photos</label>
            <input type="file" id="pc-photo-input" accept="image/*" multiple
                   data-action="upload-meeting-photo" data-year="${yearDbYear}" style="display:none;" />
            <div id="pc-photo-count" style="font-size:12px;color:var(--muted);margin-top:6px;">
              ${existingPhotos.length > 0 ? `${existingPhotos.length} photo${existingPhotos.length !== 1 ? "s" : ""} uploaded` : ""}
            </div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="primary" style="flex:1;" data-action="save-post-close" data-year="${yearDbYear}">Save &amp; Finish</button>
            <button class="secondary" data-action="skip-post-close">Skip</button>
          </div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";
}

async function savePostCloseData(closedYearNum, data) {
  if (!liveBackendReady || !isAdmin()) { showToast("Admin access required."); return; }
  const yearDbYear = 2020 + closedYearNum;
  if (data.date || data.venue || data.notes || data.decisions.length > 0) {
    await saveMeetingNotes(yearDbYear, data);
  }
  const expenditure = Math.round(data.expenditure || 0);
  if (expenditure > 0) {
    const depRow = state.deposits.find(d => d.year === yearDbYear);
    const currentBalance = Number(depRow?.balance || 0);
    const currentExp = Number(depRow?.expenditure || 0);
    const newBalance = currentBalance - expenditure + currentExp;
    await liveQuery(supabaseClient.from("deposit_summaries")
      .update({ expenditure, balance: newBalance })
      .eq("year", yearDbYear));
    const lastBalance = state.statementRows[0]?.balance || 0;
    await liveQuery(supabaseClient.from("statements").insert({
      date: today(), type: "debit", amount: expenditure,
      description: `Year ${closedYearNum} annual meeting expense`,
      balance: lastBalance - expenditure,
    }));
  }
  await loadLiveState();
  showToast("Meeting details saved.");
  render();
}

async function closeCurrentYear() {
  if (!liveBackendReady) { showToast("Live backend required."); return; }
  const activeYearNum = state.settings.activeYearNumber || 6;
  const activeYearStart = activeYearCutoffMonth();
  const activeYearDbYear = 2020 + activeYearNum;
  const ORDINALS = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];

  // histRow used only for mid-year admin entries (expenditure from meeting, exit_payouts display)
  // Principal and interest are always calculated fresh from monthly_payments — no partial snapshots
  const histRow = state.deposits.find(d => d.year === activeYearDbYear);
  const histExpenditure = Number(histRow?.expenditure || 0);

  // Decide closing cutoff: include current month only if ALL active members have paid it.
  // If some are still pending, exclude current month from Year N so Year N+1 can capture it.
  const _closingMonth = currentMonth();
  const _allPaidThisMonth = activeMembers().every(m =>
    state.monthlyPayments.some(p => p.memberId === m.id && p.month === _closingMonth && p.status === "paid")
  );
  const _pm = new Date(); const _pmd = new Date(_pm.getFullYear(), _pm.getMonth() - 1);
  const _prevMonth = `${_pmd.getFullYear()}-${String(_pmd.getMonth() + 1).padStart(2, "0")}`;
  const closingCutoff = _allPaidThisMonth ? _closingMonth : _prevMonth;

  let allDeposits = 0, allInterest = 0;
  state.monthlyPayments
    .filter(p => p.status === "paid" && p.month >= activeYearStart && p.month <= closingCutoff)
    .forEach(p => {
      const mem = memberById(p.memberId);
      if (!mem) return;
      const paid = Number(p.paidAmount || p.amount || 0);
      const { dep, interest } = paymentSplit(mem, p.month, paid);
      allDeposits += dep;
      allInterest += interest;
    });

  // Year 6 started Nov 2025, but monthly_payments only has clean data from Jul 2026.
  // Add the verified pre-Jul hist totals so closeCurrentYear() produces correct final figures.
  if (activeYearNum === 6) {
    allDeposits += 153922; // Nov 2025–Jun 2026: monthly deposits (₹1,13,250) + Appanna EMI (₹44,672) — user-verified
    allInterest += 76717;  // Nov 2025–Jun 2026: loan interest — user-verified (₹87,967 total − ₹11,250 Jul)
  }

  const renewalFee = Number(state.settings.activeYearRenewalFee || 0);
  const activeYearExits = state.settings.activeYearExits || [];
  const exitPayouts = activeYearExits.reduce((s, e) => s + Number(e.payout || 0), 0);

  const finalPrincipal = renewalFee + allDeposits;
  const finalInterest = allInterest;
  const finalExpenditure = histExpenditure;
  const finalExitPayouts = exitPayouts;
  const finalBalance = finalPrincipal + finalInterest - finalExpenditure - finalExitPayouts;

  const activeLoans = currentLoans().filter(l => l.notes !== "emi_entry");
  const emiLoans = currentLoans().filter(l => l.notes === "emi_entry");
  const loanSummary = activeLoans.length
    ? activeLoans.map(l => `${loanMemberName(l)} (${money(loanOutstanding(l))})`).join(", ")
    : "None";

  const exitNames = activeYearExits.map(e => e.name || "Member").join(", ");
  const confirmed = confirm(
    `Close Year ${activeYearNum}?\n\n` +
    `── Financial Summary ──\n` +
    `Monthly Deposits : ${money(Math.round(allDeposits))}\n` +
    `Renewal Fee      : ${money(Math.round(renewalFee))}\n` +
    `Interest Earned  : ${money(Math.round(finalInterest))}\n` +
    (finalExpenditure > 0 ? `Meeting Expense  : −${money(Math.round(finalExpenditure))}\n` : "") +
    (exitPayouts > 0 ? `Exit Payouts     : −${money(Math.round(exitPayouts))} (${exitNames})\n` : "") +
    `Final Balance    : ${money(Math.round(finalBalance))}\n\n` +
    `── Loans ──\n` +
    `Carried forward  : ${activeLoans.length} loans\n` +
    `EMI in progress  : ${emiLoans.length ? emiLoans.map(l => loanMemberName(l)).join(", ") : "None"}\n\n` +
    `This will finalize Year ${activeYearNum} records and cannot be undone.`
  );
  if (!confirmed) return;

  const yearLabel = `${ORDINALS[activeYearNum - 1] || "Year " + activeYearNum} Year (${activeYearDbYear})`;

  const breakdownItems = [];
  if (renewalFee > 0) {
    breakdownItems.push({ description: "Yearly Renewal Fee", details: "Collected at year start", amount: Math.round(renewalFee) });
  }
  const monthlyDepositsTotal = Math.round(finalPrincipal - renewalFee);
  if (monthlyDepositsTotal > 0) {
    breakdownItems.push({ description: "Total Monthly Deposits", details: "Member contributions for the year", amount: monthlyDepositsTotal });
  }
  if (activeYearNum === 6) {
    const _regularInt = Math.round(finalInterest) - 11171;
    breakdownItems.push({ description: "Interest Earned", details: "From loan table (Nov 2025 – close)", amount: _regularInt });
    breakdownItems.push({ description: "Additional Interest", details: "Sarpabhushana ₹8,125 + Appanna ₹3,046 (outside loan table)", amount: 11171 });
  } else {
    breakdownItems.push({ description: "Total Interest Earned", details: "From outstanding loans", amount: Math.round(finalInterest) });
  }
  if (finalExpenditure > 0) {
    breakdownItems.push({ description: "Meeting Expenses", details: "Annual meeting cost", amount: -Math.round(finalExpenditure) });
  }
  if (finalExitPayouts > 0) {
    const exitNames = activeYearExits.map(e => e.name || "Member").join(", ");
    breakdownItems.push({ description: "Member Exit", details: `${exitNames} – amount paid out`, amount: -Math.round(finalExitPayouts) });
  }

  await liveQuery(supabaseClient.from("deposit_summaries").upsert({
    year: activeYearDbYear,
    label: yearLabel,
    principal: Math.round(finalPrincipal),
    interest: Math.round(finalInterest),
    expenditure: Math.round(finalExpenditure),
    exit_payouts: Math.round(finalExitPayouts),
    balance: Math.round(finalBalance),
    breakdown: breakdownItems,
  }, { onConflict: "year" }));

  const closingDate = today();
  const _yearStartStr = activeYearNum === 6 ? "2025-11-01" : (activeYearStart + "-01");
  for (const loan of activeLoans) {
    const interestPaid = yearBoundedInterest(loan, _yearStartStr, closingDate);
    await liveQuery(supabaseClient.from("loan_history").insert({
      year: `Year ${activeYearNum}`,
      member_name: loanMemberName(loan),
      from_date: loan.disbursedAt || loan.from || null,
      principal: loan.amount,
      monthly_interest: loanBaseMonthlyInterest(loan),
      renewal_or_return: loanRenewalDate(loan) || null,
      status: "Carried Forward",
      total_paid: interestPaid,
      notes: `Carried forward to Year ${activeYearNum + 1}`,
    }));
  }

  for (const loan of emiLoans) {
    const prog = appannaEmiProgress();
    const paidAmount = Math.round(prog.paid * prog.monthlyEmi);
    const remainingMonths = prog.remaining;
    await liveQuery(supabaseClient.from("loan_history").insert({
      year: `Year ${activeYearNum}`,
      member_name: loanMemberName(loan),
      from_date: loan.disbursedAt || loan.from || null,
      principal: loan.amount,
      monthly_interest: 0,
      renewal_or_return: null,
      status: "EMI – In Progress",
      total_paid: paidAmount,
      notes: `EMI: ${prog.paid} of ${prog.totalMonths} months paid. ${remainingMonths} months remaining into Year ${activeYearNum + 1}.`,
    }));
  }

  await liveQuery(supabaseClient.from("settings").upsert({
    id: "active_year_info",
    value: {
      activeYearNumber: activeYearNum,
      activeYearStart: activeYearStart,
      activeYearLabel: state.settings.activeYearLabel || `${ORDINALS[activeYearNum - 1]} Year`,
      activeYearRenewalFee: renewalFee,
      activeYearExits: activeYearExits,
      yearClosed: true,
    },
    updated_at: new Date().toISOString(),
  }));

  await addLiveAudit(`Year ${activeYearNum} closed. Final balance: ${money(Math.round(finalBalance))}. ${activeLoans.length} loans carried forward.`, "year_closed");
  await loadLiveState();
  showToast(`Year ${activeYearNum} closed successfully. Go to Meetings tab to add meeting details.`);
  render();
}

async function startNewYear(data) {
  if (!liveBackendReady) { showToast("Live backend required."); return; }
  const currentYearNum = state.settings.activeYearNumber || 6;
  const newYearNum = currentYearNum + 1;
  const ORDINALS = ["First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth"];
  const newYearLabel = `${ORDINALS[newYearNum - 1] || "Year " + newYearNum} Year`;
  const renewalFeePerMember = Number(data.renewalFee || 0);
  const renewalFee = renewalFeePerMember * activeMembers().length;
  const newMonthlyDeposit = Number(data.monthlyDeposit || state.settings.monthlyDeposit);
  // Start next year from next month if all members paid this month, else from this month
  const _allPaid = activeMembers().every(m =>
    state.monthlyPayments.some(p => p.memberId === m.id && p.month === currentMonth() && p.status === "paid")
  );
  const _nd = new Date(); const _ndm = new Date(_nd.getFullYear(), _nd.getMonth() + 1);
  const startMonth = _allPaid
    ? `${_ndm.getFullYear()}-${String(_ndm.getMonth() + 1).padStart(2, "0")}`
    : currentMonth();

  // Collect exits from DOM (checkboxes)
  const exitChecks = document.querySelectorAll(".exit-member-check:checked");
  const exits = Array.from(exitChecks).map(cb => ({
    memberId: cb.dataset.memberId,
    name: cb.dataset.memberName,
    payout: Number(document.getElementById(`exit-payout-${cb.dataset.memberId}`)?.value || 0),
  })).filter(e => e.payout > 0 || e.memberId);

  await liveQuery(supabaseClient.from("settings").upsert({
    id: "active_year_info",
    value: {
      activeYearNumber: newYearNum,
      activeYearStart: startMonth,
      activeYearLabel: newYearLabel,
      activeYearRenewalFee: renewalFee,
      activeYearRenewalFeePerMember: renewalFeePerMember,
      activeYearExits: exits,
      yearClosed: false,
    },
    updated_at: new Date().toISOString(),
  }));

  if (newMonthlyDeposit !== state.settings.monthlyDeposit) {
    await liveQuery(supabaseClient.from("settings").upsert({
      id: "rules",
      value: { monthlyDeposit: newMonthlyDeposit },
      updated_at: new Date().toISOString(),
    }));
  }

  for (const exit of exits) {
    if (exit.memberId) {
      await liveQuery(supabaseClient.from("profiles").update({ status: "exited" }).eq("id", exit.memberId));
    }
  }

  // Record renewal fee as a credit in statements so bank balance reflects it
  if (renewalFee > 0) {
    const _lastBal = state.statementRows[0]?.balance || 0;
    await liveQuery(supabaseClient.from("statements").insert({
      date: today(),
      type: "credit",
      amount: renewalFee,
      description: `Year ${newYearNum} renewal fee (₹${renewalFeePerMember.toLocaleString("en-IN")} × ${activeMembers().length} members)`,
      balance: _lastBal + renewalFee,
    }));
  }

  await addLiveAudit(`Year ${newYearNum} started. Renewal fee: ${money(renewalFee)}. Monthly deposit: ${money(newMonthlyDeposit)}. Exits: ${exits.length}.`, "year_started");
  await loadLiveState();
  showToast(`Year ${newYearNum} started successfully.`);
  render();
}

// ── Session idle timeout (40 minutes) ────────────────────────────────────────
const IDLE_TIMEOUT_MS = 40 * 60 * 1000;
const IDLE_TS_KEY = "bfc_last_activity";
let idleTimer = null;

function resetIdleTimer() {
  if (!state.currentUserId) return;
  localStorage.setItem(IDLE_TS_KEY, Date.now().toString());
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (!state.currentUserId) return;
    if (mpinSet()) {
      sessionStorage.removeItem("mpinVerified");
      mpinPending = true;
      mpinEntry = "";
      render();
    } else {
      state.currentUserId = null;
      localStorage.removeItem(IDLE_TS_KEY);
      saveState();
      render();
    }
  }, IDLE_TIMEOUT_MS);
}

async function checkIdleExpiry() {
  const last = parseInt(localStorage.getItem(IDLE_TS_KEY) || "0", 10);
  if (!last) return;
  if (Date.now() - last > IDLE_TIMEOUT_MS) {
    if (mpinSet()) {
      sessionStorage.removeItem("mpinVerified");
      mpinPending = true;
      mpinEntry = "";
    } else {
      state.currentUserId = null;
      localStorage.removeItem(IDLE_TS_KEY);
      saveState();
    }
  }
}

["click", "touchstart", "keydown", "scroll", "mousemove"].forEach((evt) =>
  document.addEventListener(evt, resetIdleTimer, { passive: true })
);
// ─────────────────────────────────────────────────────────────────────────────

function showPaymentReturnPopup() {
  if (document.querySelector(".pay-return-overlay")) return;
  const overlay = document.createElement("div");
  overlay.className = "pay-return-overlay";
  overlay.innerHTML = `
    <div class="pay-return-popup">
      <div class="pay-return-header">
        <div class="pay-return-icon">✅</div>
        <h3>Payment Done!</h3>
        <p>Your payment has been initiated successfully.</p>
      </div>
      <div class="pay-return-body">
        <div class="pay-return-step">
          <span class="pay-return-num">1</span>
          <span>Take a screenshot of your payment confirmation</span>
        </div>
        <div class="pay-return-step">
          <span class="pay-return-num">2</span>
          <span>Share it to admin on WhatsApp for approval</span>
        </div>
        <div class="pay-return-step">
          <span class="pay-return-num">3</span>
          <span>Your status will update to <strong>Paid</strong> once approved</span>
        </div>
      </div>
      <button class="primary pay-return-close-btn">Got it</button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector(".pay-return-close-btn").addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && localStorage.getItem(`payInitiated_${currentMonth()}`)) {
    localStorage.removeItem(`payInitiated_${currentMonth()}`);
    showPaymentReturnPopup();
  }
});

async function markPaymentPaid(memberId) {
  const member = memberById(memberId);
  if (!member) return;
  const month = currentMonth();
  const amount = memberMonthlyDue(member);
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("monthly_payments").upsert({
      profile_id: memberId,
      month,
      expected_amount: amount,
      paid_amount: amount,
      status: "paid",
      source: "manual",
    }, { onConflict: "profile_id,month" }));
    await loadLiveState();
    // Auto-mark the current pending EMI for all EMI loans of this member
    const emiLoans = state.loans.filter(l =>
      l.loanType === "emi" && l.status === "active" && loanBelongsToMember(l, member)
    );
    for (const loan of emiLoans) {
      const nextEmi = state.loanEmis.find(e => e.loanId === loan.id && e.status === "pending");
      if (nextEmi) {
        await liveQuery(supabaseClient.from("loan_emis").update({ status: "paid", paid_at: today() }).eq("id", nextEmi.id));
        const newEmisPaid = loan.emisPaid + 1;
        const allPaid = newEmisPaid >= loan.tenureMonths;
        await liveQuery(supabaseClient.from("current_loans").update({
          emis_paid: newEmisPaid,
          ...(allPaid ? { status: "clear", principal_paid: loan.amount, closed_at: today() } : {}),
        }).eq("id", loan.id));
        if (allPaid) showToast(`${loanMemberName(loan)} — all EMIs paid, loan closed!`);
      }
    }
    if (emiLoans.length > 0) await loadLiveState();
    await insertStatement("credit", amount, `${member.name} credited`);
    await notifyMember(memberId, "payment_confirmed", "Payment confirmed ✓", `Hi ${member.name}, your payment of ${money(amount)} for ${month} has been recorded successfully. Thank you!`);
  } else {
    const existing = state.monthlyPayments.find((p) => p.memberId === memberId && p.month === month);
    if (existing) existing.status = "paid";
    else state.monthlyPayments.push({ id: uid("p"), memberId, month, amount, status: "paid", source: "manual" });
  }
  render();
  showToast(`${member.name} marked as paid.`);
}

async function initApp() {
  // Splash screen — show immediately, run app load in parallel
  const splash = document.createElement("div");
  splash.id = "splash-screen";
  // 16 particles: [left%, size_px, delay_s, duration_s]
  const pts = [
    [4,3,0.2,3.8],[10,5,0.9,3.2],[17,2,0.4,4.1],[24,6,1.1,2.9],
    [31,4,0.1,3.6],[40,3,0.7,3.3],[50,7,0.3,2.8],[58,4,0.8,3.5],
    [66,5,0.5,3.0],[73,3,1.2,3.9],[80,6,0.2,3.1],[88,4,0.6,3.7],
    [94,3,1.0,3.4],[20,2,1.5,2.7],[62,5,1.3,3.6],[45,4,0.4,4.0],
  ];
  const pHtml = pts.map(([l,s,d,dur]) =>
    `<div class="sp-dot" style="left:${l}%;width:${s}px;height:${s}px;animation-duration:${dur}s;animation-delay:${d}s"></div>`
  ).join("");

  splash.innerHTML = `
    <div class="sp-particles">${pHtml}</div>

    <div class="sp-center">
      <div class="sp-glow-orb"></div>
      <svg class="sp-emblem-svg" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sp-gv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#F8E878"/>
            <stop offset="45%"  stop-color="#D4A020"/>
            <stop offset="100%" stop-color="#8C6008"/>
          </linearGradient>
          <linearGradient id="sp-gh" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#F0D050"/>
            <stop offset="100%" stop-color="#B07810"/>
          </linearGradient>
          <filter id="sp-glow-f" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="sp-shadow-f">
            <feDropShadow dx="0" dy="2" stdDeviation="5" flood-color="#D4A020" flood-opacity="0.55"/>
          </filter>
        </defs>

        <!-- Outer ring — draws itself -->
        <circle class="sp-ring-outer" cx="110" cy="110" r="104"
          stroke="url(#sp-gv)" stroke-width="2" fill="none"
          filter="url(#sp-glow-f)"/>

        <!-- Dashed ring — rotates slowly -->
        <circle class="sp-ring-deco" cx="110" cy="110" r="95"
          stroke="#C89018" stroke-width="0.7"
          stroke-dasharray="7 5" fill="none" opacity="0.5"/>

        <!-- Inner ring — draws itself -->
        <circle class="sp-ring-inner" cx="110" cy="110" r="84"
          stroke="url(#sp-gv)" stroke-width="1.5" fill="none"/>

        <!-- Four cardinal diamonds -->
        <polygon class="sp-cardinal sp-c1" fill="url(#sp-gv)"
          points="110,3 114,12 110,21 106,12" filter="url(#sp-shadow-f)"/>
        <polygon class="sp-cardinal sp-c2" fill="url(#sp-gv)"
          points="217,110 208,106 199,110 208,114" filter="url(#sp-shadow-f)"/>
        <polygon class="sp-cardinal sp-c3" fill="url(#sp-gv)"
          points="110,217 114,208 110,199 106,208" filter="url(#sp-shadow-f)"/>
        <polygon class="sp-cardinal sp-c4" fill="url(#sp-gv)"
          points="3,110 12,106 21,110 12,114" filter="url(#sp-shadow-f)"/>

        <!-- Centre monogram -->
        <g class="sp-mono" filter="url(#sp-shadow-f)">
          <text x="110" y="150"
            text-anchor="middle"
            font-family="Georgia,'Times New Roman',serif"
            font-weight="900" font-size="170"
            fill="url(#sp-gv)" opacity="0.16">$</text>
          <text x="110" y="150"
            text-anchor="middle"
            font-family="Georgia,'Times New Roman',serif"
            font-weight="900" font-size="115"
            fill="url(#sp-gv)">B</text>
          <rect x="64" y="156" width="92" height="3" rx="1.5"
            fill="url(#sp-gh)" opacity="0.9"/>
        </g>
      </svg>
    </div>

    <div class="sp-brand">
      <div class="sp-brand-name">BANAKAR</div>
      <div class="sp-brand-row">
        <em></em><span>FINCLUB</span><em></em>
      </div>
      <div class="sp-tagline">SAVE &bull; INVEST &bull; GROW TOGETHER</div>
    </div>

    <div class="sp-progress-wrap">
      <div class="sp-progress-bar"></div>
    </div>`;
  document.body.appendChild(splash);
  const splashTimer = new Promise((r) => setTimeout(r, 5000));

  document.querySelector("#app").innerHTML = "";

  if (liveBackendReady) {
    if (window.location.hash.includes("type=recovery")) {
      supabaseClient.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") renderSetNewPassword();
      });
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) renderSetNewPassword();
      await splashTimer;
      splash.classList.add("splash-exit");
      setTimeout(() => splash.remove(), 700);
      return;
    }
    try {
      await checkIdleExpiry();
      await loadLiveState();
    } catch (error) {
      showToast(error.message || "Could not load live data.");
    }
  }

  await splashTimer;
  splash.classList.add("splash-exit");
  await new Promise((r) => setTimeout(r, 700));
  splash.remove();
  // Require MPIN before entering the app whenever one is set — whether the live
  // session is available or only the cached identity is (app reopened after a
  // long gap). mpinSet() checks both, so this also covers the expired-session case.
  if (mpinSet() && !sessionStorage.getItem("mpinVerified")) mpinPending = true;
  render();
}

function initPullToRefresh() {
  const THRESHOLD = 72;
  let startY = 0;
  let pulling = false;
  let refreshing = false;

  function indicator() {
    let el = document.getElementById("ptr-bar");
    if (!el) {
      el = document.createElement("div");
      el.id = "ptr-bar";
      el.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:9999;height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--panel,#fff);box-shadow:0 1px 4px rgba(0,0,0,.08);transition:height .15s;";
      el.innerHTML = '<div id="ptr-spinner" style="width:22px;height:22px;border:2.5px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;"></div>';
      document.body.appendChild(el);
    }
    return el;
  }

  document.addEventListener("touchstart", (e) => {
    if (refreshing) return;
    if ((document.documentElement.scrollTop || document.body.scrollTop) === 0) {
      startY = e.touches[0].clientY;
      pulling = true;
    }
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    if (!pulling || refreshing) return;
    const dist = e.touches[0].clientY - startY;
    if (dist > 8) {
      indicator().style.height = Math.min(dist * 0.55, 56) + "px";
    }
  }, { passive: true });

  document.addEventListener("touchend", async (e) => {
    if (!pulling) return;
    pulling = false;
    const dist = e.changedTouches[0].clientY - startY;
    const bar = indicator();
    if (dist >= THRESHOLD && liveBackendReady && !refreshing) {
      refreshing = true;
      bar.style.height = "52px";
      const spinner = document.getElementById("ptr-spinner");
      if (spinner) spinner.style.animation = "spin 0.7s linear infinite";
      try {
        await loadLiveState();
        render();
      } catch (_) {
        showToast("Refresh failed. Check connection.");
      }
      refreshing = false;
    }
    bar.style.height = "0";
  });
}

// ── Chat ──────────────────────────────────────────────────────────────────

let chatOpen = false;
let chatChannel = null;

// ── AI Chat ───────────────────────────────────────────────────────────────

let aiChatOpen = false;
let aiHistory = [];
let aiLoading = false;

function chatUnreadCount() {
  if (!currentProfileId()) return 0;
  const lastRead = localStorage.getItem("chatLastRead") || "1970-01-01T00:00:00Z";
  return (state.messages || []).filter(
    (m) => m.profileId !== currentProfileId() && m.createdAt > lastRead
  ).length;
}

function renderChatFab() {
  const existing = document.getElementById("chat-fab");
  if (existing) existing.remove();
  if (!currentUser() || !liveBackendReady) return;

  const unread = chatUnreadCount();
  const fab = document.createElement("button");
  fab.id = "chat-fab";
  fab.setAttribute("aria-label", "Open group chat");
  fab.innerHTML = `💬${unread > 0 ? `<span id="chat-fab-badge">${unread > 99 ? "99+" : unread}</span>` : ""}`;
  document.body.appendChild(fab);
  makeChatFabDraggable(fab);
}

function makeChatFabDraggable(fab) {
  const DRAG_THRESHOLD = 8;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;
  let dragging = false, moved = false;

  function clamp(top, left) {
    const maxTop = window.innerHeight - fab.offsetHeight - 8;
    const maxLeft = window.innerWidth - fab.offsetWidth - 8;
    return { top: Math.max(8, Math.min(top, maxTop)), left: Math.max(8, Math.min(left, maxLeft)) };
  }

  function applyPos(top, left) {
    const pos = clamp(top, left);
    fab.style.top = pos.top + "px";
    fab.style.left = pos.left + "px";
    fab.style.bottom = "auto";
    fab.style.right = "auto";
  }

  // Restore saved position
  try {
    const saved = JSON.parse(localStorage.getItem("chatFabPos") || "null");
    if (saved) applyPos(saved.top, saved.left);
  } catch (_) {}

  fab.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX; startY = t.clientY;
    const r = fab.getBoundingClientRect();
    startLeft = r.left; startTop = r.top;
    dragging = true; moved = false;
  }, { passive: true });

  fab.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      moved = true;
      e.preventDefault();
      applyPos(startTop + dy, startLeft + dx);
    }
  }, { passive: false });

  fab.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      const r = fab.getBoundingClientRect();
      localStorage.setItem("chatFabPos", JSON.stringify({ top: r.top, left: r.left }));
    } else {
      openChatPanel();
    }
  });

  // Mouse drag (desktop/dev)
  fab.addEventListener("mousedown", (e) => {
    startX = e.clientX; startY = e.clientY;
    const r = fab.getBoundingClientRect();
    startLeft = r.left; startTop = r.top;
    dragging = true; moved = false;
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      moved = true;
      applyPos(startTop + dy, startLeft + dx);
    }
  });
  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      const r = fab.getBoundingClientRect();
      localStorage.setItem("chatFabPos", JSON.stringify({ top: r.top, left: r.left }));
    } else {
      openChatPanel();
    }
  });

  // Click fallback for non-drag taps (when no touchend fires as a click)
  fab.addEventListener("click", () => {
    if (!moved) openChatPanel();
    moved = false;
  });
}

function updateChatBadge() {
  const fab = document.getElementById("chat-fab");
  if (!fab) return;
  const unread = chatUnreadCount();
  let badge = document.getElementById("chat-fab-badge");
  if (unread > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.id = "chat-fab-badge";
      fab.appendChild(badge);
    }
    badge.textContent = unread > 99 ? "99+" : String(unread);
  } else if (badge) {
    badge.remove();
  }
}

function fmtChatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function fmtChatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function buildChatMessagesHtml(msgs) {
  if (!msgs.length) return `<div style="text-align:center;padding:40px 16px;color:var(--muted);font-size:14px;">No messages yet. Say hello! 👋</div>`;
  let html = "";
  let lastDate = "";
  for (const msg of msgs) {
    const msgDate = fmtChatDate(msg.createdAt);
    if (msgDate !== lastDate) {
      html += `<div class="chat-date-divider">${escapeHtml(msgDate)}</div>`;
      lastDate = msgDate;
    }
    const mine = msg.profileId === currentProfileId();
    const sender = state.members.find((m) => m.id === msg.profileId);
    const name = sender?.name || "Member";
    html += `
      <div class="chat-msg ${mine ? "mine" : "theirs"}">
        ${!mine ? `<span class="chat-msg-name">${escapeHtml(name)}</span>` : ""}
        <div class="chat-bubble">${escapeHtml(msg.body)}</div>
        <span class="chat-msg-time">${fmtChatTime(msg.createdAt)}</span>
      </div>`;
  }
  return html;
}

function openChatPanel() {
  const existing = document.getElementById("chat-panel");
  if (existing) { existing.remove(); chatOpen = false; return; }

  chatOpen = true;
  localStorage.setItem("chatLastRead", new Date().toISOString());
  updateChatBadge();

  const html = `
    <div id="chat-panel" class="chat-panel-overlay">
      <div class="chat-panel-sheet" id="chat-panel-sheet">
        <div class="chat-panel-header">
          <div><h3>💬 Member Chat</h3><p>All members · ${state.members.filter(m => m.status === "active").length} active</p></div>
          <button class="rules-modal-close" data-action="close-chat">✕</button>
        </div>
        <div class="chat-messages" id="chat-messages">
          ${buildChatMessagesHtml(state.messages || [])}
        </div>
        <div class="chat-input-wrap">
          <input id="chat-input" class="chat-input" placeholder="Type a message…" maxlength="1000" autocomplete="off" />
          <button id="chat-send-btn" class="chat-send-btn" data-action="send-chat">Send</button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";

  const messagesEl = document.getElementById("chat-messages");
  if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

  const input = document.getElementById("chat-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
    });
    setTimeout(() => input.focus(), 100);
  }
}

function closeChatPanel() {
  const panel = document.getElementById("chat-panel");
  if (panel) { panel.remove(); document.body.style.overflow = ""; }
  chatOpen = false;
}

function refreshChatMessages() {
  const messagesEl = document.getElementById("chat-messages");
  if (!messagesEl) return;
  const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 60;
  messagesEl.innerHTML = buildChatMessagesHtml(state.messages || []);
  if (atBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const body = (input?.value || "").trim();
  if (!body || !liveBackendReady || !currentProfileId()) return;

  const btn = document.getElementById("chat-send-btn");
  if (btn) btn.disabled = true;
  input.value = "";

  try {
    await liveQuery(supabaseClient.from("messages").insert({
      profile_id: currentProfileId(),
      body,
    }));
  } catch (err) {
    showToast("Failed to send message.");
    input.value = body;
  } finally {
    if (btn) btn.disabled = false;
    input?.focus();
  }
}

function initRealtimeChat() {
  if (!liveBackendReady || !currentProfileId() || chatChannel) return;
  chatChannel = supabaseClient
    .channel("group-chat")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      const msg = liveMessageToLocal(payload.new);
      state.messages = [...(state.messages || []), msg];
      if (chatOpen) {
        localStorage.setItem("chatLastRead", new Date().toISOString());
        refreshChatMessages();
      } else {
        updateChatBadge();
      }
    })
    .subscribe();
}

// ── AI Assistant ──────────────────────────────────────────────────────────

function renderAiFab() {
  const existing = document.getElementById("ai-fab");
  if (existing) existing.remove();
  if (!currentUser() || !liveBackendReady) return;

  const fab = document.createElement("button");
  fab.id = "ai-fab";
  fab.setAttribute("aria-label", "Open AI assistant");
  fab.setAttribute("data-action", "open-ai-chat");
  fab.innerHTML = `<span class="ai-fab-icon">✦</span>`;
  document.body.appendChild(fab);
}

function aiEmptyHtml() {
  const user = currentUser();
  const isAdm = isAdmin();
  const suggestions = isAdm
    ? ["Who hasn't paid this month?", "Show me all active loans", "What's the bank balance?", "Give me a club overview"]
    : ["Have I paid this month?", "What's my loan outstanding?", "Show my payment history", "When is my next EMI?"];
  return `
    <div class="ai-empty">
      <div class="ai-empty-icon">✦</div>
      <p class="ai-empty-title">Hi ${escapeHtml(user?.name?.split(" ")[0] || "there")}!</p>
      <p class="ai-empty-sub">Ask me anything about your account or general finance questions.</p>
      <div class="ai-suggestions">
        ${suggestions.map(s => `<button class="ai-suggestion" data-suggestion="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("")}
      </div>
    </div>`;
}

function openAiPanel() {
  const existing = document.getElementById("ai-panel");
  if (existing) { existing.remove(); document.body.style.overflow = ""; aiChatOpen = false; return; }

  aiChatOpen = true;

  const html = `
    <div id="ai-panel" class="ai-panel-overlay">
      <div class="ai-panel-sheet" id="ai-panel-sheet">
        <div class="ai-panel-header">
          <div class="ai-panel-header-left">
            <span class="ai-panel-logo">✦</span>
            <div>
              <h3>Banakar AI</h3>
              <p>Powered by Groq · Your personal finance assistant</p>
            </div>
          </div>
          <div class="ai-panel-header-actions">
            <button class="ai-icon-btn" data-action="clear-ai-chat" title="Clear chat">↺</button>
            <button class="ai-icon-btn" data-action="close-ai-chat" title="Close">✕</button>
          </div>
        </div>
        <div class="ai-messages" id="ai-messages">
          ${aiHistory.length === 0 ? aiEmptyHtml() : renderAiHistory()}
        </div>
        <div class="ai-input-wrap">
          <input id="ai-input" class="ai-input" placeholder="Ask anything…" maxlength="500" autocomplete="off" />
          <button id="ai-send-btn" class="ai-send-btn" data-action="send-ai-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>`;

  document.body.insertAdjacentHTML("beforeend", html);
  document.body.style.overflow = "hidden";

  const messagesEl = document.getElementById("ai-messages");
  if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;

  const input = document.getElementById("ai-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAiMessage(); }
    });
    setTimeout(() => input.focus(), 120);
  }

  // Suggestion chip clicks
  document.getElementById("ai-panel")?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-suggestion]");
    if (chip) {
      const text = chip.dataset.suggestion;
      const inp = document.getElementById("ai-input");
      if (inp && text) { inp.value = text; inp.focus(); }
    }
  });
}

function closeAiPanel() {
  const panel = document.getElementById("ai-panel");
  if (panel) { panel.remove(); document.body.style.overflow = ""; }
  aiChatOpen = false;
}

function renderAiHistory() {
  let html = "";
  for (const turn of aiHistory) {
    const role = turn.role;
    const text = turn.content || "";
    if (!text) continue;
    if (role === "user") {
      html += `<div class="ai-msg ai-msg-user"><div class="ai-bubble ai-bubble-user">${escapeHtml(text)}</div></div>`;
    } else if (role === "assistant") {
      html += `<div class="ai-msg ai-msg-ai"><span class="ai-avatar">✦</span><div class="ai-bubble ai-bubble-ai">${formatAiText(text)}</div></div>`;
    }
  }
  return html;
}

function formatAiText(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^[-*•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br>");
}

function appendAiMessage(role, text) {
  const messagesEl = document.getElementById("ai-messages");
  if (!messagesEl) return;

  // Remove empty state if present
  const empty = messagesEl.querySelector(".ai-empty");
  if (empty) empty.remove();

  const div = document.createElement("div");
  div.className = `ai-msg ai-msg-${role === "user" ? "user" : "ai"}`;
  if (role === "user") {
    div.innerHTML = `<div class="ai-bubble ai-bubble-user">${escapeHtml(text)}</div>`;
  } else {
    div.innerHTML = `<span class="ai-avatar">✦</span><div class="ai-bubble ai-bubble-ai">${formatAiText(text)}</div>`;
  }
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showAiTyping() {
  const messagesEl = document.getElementById("ai-messages");
  if (!messagesEl || document.getElementById("ai-typing")) return;
  const div = document.createElement("div");
  div.id = "ai-typing";
  div.className = "ai-msg ai-msg-ai";
  div.innerHTML = `<span class="ai-avatar">✦</span><div class="ai-bubble ai-bubble-ai ai-typing-indicator"><span></span><span></span><span></span></div>`;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeAiTyping() {
  document.getElementById("ai-typing")?.remove();
}

async function sendAiMessage() {
  const input = document.getElementById("ai-input");
  const message = (input?.value || "").trim();
  if (!message || aiLoading || !liveBackendReady) return;

  const btn = document.getElementById("ai-send-btn");
  input.value = "";
  aiLoading = true;
  if (btn) btn.setAttribute("disabled", "true");

  appendAiMessage("user", message);
  showAiTyping();

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) throw new Error("No session");

    const edgeFnUrl = `${appConfig.supabaseUrl}/functions/v1/ai-chat`;
    const res = await fetch(edgeFnUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.access_token}`,
        "apikey": appConfig.supabaseAnonKey,
      },
      body: JSON.stringify({ message, history: aiHistory }),
    });

    const json = await res.json();
    removeAiTyping();

    if (!res.ok || json.error) {
      appendAiMessage("ai", `⚠️ ${json.error || "Something went wrong. Please try again."}`);
    } else {
      appendAiMessage("ai", json.response);
      aiHistory = json.updatedHistory || aiHistory;
    }
  } catch (err) {
    removeAiTyping();
    appendAiMessage("ai", "⚠️ Could not reach the AI service. Check your connection and try again.");
  } finally {
    aiLoading = false;
    if (btn) btn.removeAttribute("disabled");
    input?.focus();
  }
}

initApp().then(() => {
  initPullToRefresh();
  initRealtimeChat();
  // Stamp the initial history entry so the back button has a base state to land on
  history.replaceState({ bfc: true, tab: state.activeTab }, "");
});

// Handle Android/browser back button
window.addEventListener("popstate", (e) => {
  // If any modal/panel is open, close it and re-push the current tab state
  // so the back stack stays intact for the next press
  const modal = document.querySelector(
    "#rules-modal, #loans-modal, #photos-modal, #photo-lightbox, " +
    "#deposit-year-modal, #loan-year-modal, #post-close-modal, .notif-panel-wrap"
  );
  if (modal) {
    modal.remove();
    document.body.style.overflow = "";
    history.pushState({ bfc: true, tab: state.activeTab }, "");
    return;
  }
  // No modal — navigate to the tab stored in the popped state
  if (e.state?.bfc && e.state.tab) {
    state.activeTab = e.state.tab;
    saveState();
    render();
  }
});
