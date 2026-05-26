const STORAGE_KEY = "banakar-finclub-state-v1";
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
    loginCopy: "Built for Banakar FinClub members with admin approval, monthly deposits, loan tracking, and ICICI statement import readiness.",
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
    statementImport: "Statement import",
    reviewAndPost: "Review and post",
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
    statementImport: "ಸ್ಟೇಟ್ಮೆಂಟ್ ಆಮದು",
    reviewAndPost: "ಪರಿಶೀಲಿಸಿ ಪೋಸ್ಟ್ ಮಾಡಿ",
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
  extensionRequests: [],
  loanRequests: [
    { id: "q1", memberId: "m7", amount: 25000, reason: "Medical support", status: "pending", date: "2026-05-14" },
  ],
  loanHistory: [],
  notifications: [],
  messages: [],
  statementRows: [],
  rules: [],
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

async function loadLiveState() {
  if (!liveBackendReady) return;
  const prefs = loadPrefs();
  const { data: authData, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !authData?.user) {
    state = { ...structuredClone(initialState), ...prefs, currentUserId: null };
    return;
  }

  const [settingsRows, profiles, deposits, payments, loanRequests, loans, loanHistory, audit, notifications, rulesData, extensionRequests, messages] = await Promise.all([
    liveQuery(supabaseClient.from("settings").select("id,value")),
    liveQuery(supabaseClient.from("profiles").select("id,full_name,phone,email,role,status,auth_user_id,avatar_url").order("created_at", { ascending: true })),
    liveQuery(supabaseClient.from("deposit_summaries").select("*").order("year", { ascending: true })),
    liveQuery(supabaseClient.from("monthly_payments").select("*").gte("month", "2025-11").order("created_at", { ascending: false })),
    liveQuery(supabaseClient.from("loan_requests").select("*").order("requested_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("current_loans").select("*").order("created_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("loan_history").select("*").order("from_date", { ascending: false }).limit(100)),
    liveQuery(supabaseClient.from("audit_logs").select("id,action,created_at,details").order("created_at", { ascending: false }).limit(20)),
    liveOptionalList(supabaseClient.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)),
    liveOptionalList(supabaseClient.from("rules").select("*").order("section", { ascending: true }).order("sort_order", { ascending: true })),
    liveOptionalList(supabaseClient.from("loan_extension_requests").select("*").order("requested_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("messages").select("*").order("created_at", { ascending: true }).limit(200)),
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
      bankBalance: Number(settingsById.bank_balance?.amount ?? initialState.settings.bankBalance),
      bankBalanceUpdatedAt: settingsById.bank_balance?.updatedAt || initialState.settings.bankBalanceUpdatedAt,
      loanInterestLabel: "Rs. 1.25 per Rs. 100 per month",
      bankName: "ICICI Bank",
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
    })),
    monthlyPayments: payments.map(livePaymentToLocal),
    loanRequests: loanRequests.map(liveLoanRequestToLocal),
    loans: loans.map(liveLoanToLocal),
    extensionRequests: extensionRequests.map(liveExtensionToLocal),
    messages: messages.map(liveMessageToLocal),
    loanHistory: loanHistory.map(liveLoanHistoryToLocal),
    notifications: notifications.map(liveNotificationToLocal),
    statementRows: [],
    rules: rulesData.filter((r) => r.is_active !== false).map((r) => ({ id: r.id, section: r.section, item: r.item, sort_order: r.sort_order ?? 0 })),
    audit: audit.reverse().map(liveAuditToLocal),
  };

  // Clear payInitiated flag if this user's current month payment is already paid
  const myPayment = state.monthlyPayments.find((p) => p.memberId === state.currentUserId && p.month === currentMonth());
  if (myPayment?.status === "paid") localStorage.removeItem(`payInitiated_${currentMonth()}`);

  // Start realtime chat subscription once logged in
  initRealtimeChat();

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
  return Math.max(0, Number(loan.amount) - Number(loan.principalPaid || 0));
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
  return memberLoans(memberId).reduce((sum, loan) => sum + loanMonthlyInterest(loan), 0);
}

function latestHistoricalBalance() {
  return state.deposits.reduce((latest, item) => (item.year > latest.year ? item : latest), state.deposits[0]).balance;
}

function groupStats() {
  const baseBalance = Number(state.settings.bankBalance ?? latestHistoricalBalance());
  const monthlyCredits = state.monthlyPayments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const loanPrincipalOutstanding = currentLoans().reduce((sum, loan) => sum + loanOutstanding(loan), 0);
  const currentInterestDue = currentLoans().reduce((sum, loan) => sum + loanMonthlyInterest(loan), 0);
  const availableBalance = baseBalance + monthlyCredits - loanPrincipalOutstanding;
  return { baseBalance, monthlyCredits, loanPrincipalOutstanding, currentInterestDue, availableBalance };
}

function bankBalance() {
  return Number(state.settings.bankBalance ?? latestHistoricalBalance());
}

function expectedBankBalance() {
  const sarpaShare = 121833;
  const pool5y = initialState.deposits.reduce((s, d) => s + d.balance, 0);
  const postExitPool = pool5y - sarpaShare;

  // Fixed historical deposits Nov 2025 – May 2026 (verified correct)
  const historicalDeposits = (21000 + 14000) + 11250 + (7 * 2000 * 5);

  // Appanna EMI principal paid (tracked via principal_paid on emi_entry loan)
  const emiLoan = state.loans.find((l) => l.notes === "emi_entry");
  const appannaEmiPaid = emiLoan ? Number(emiLoan.principalPaid || 0) : 0;

  // Pre-June 2026 interest (expected, capped at May 2026 inside yr6InterestMonths)
  const preJuneInterest = year6InterestCollected();
  const extraInterest = 8125 + 3046;

  // Actual payments from June 2026 onwards — admin-confirmed via payment collection
  const actualJunePlus = state.monthlyPayments
    .filter((p) => p.status === "paid" && p.month >= "2026-06")
    .reduce((sum, p) => sum + Number(p.paidAmount || p.amount || 0), 0);

  const totalOutstanding = currentLoans()
    .filter((l) => l.notes !== "emi_entry")
    .reduce((s, loan) => s + loanOutstanding(loan), 0);

  return Math.round(postExitPool + historicalDeposits + appannaEmiPaid + preJuneInterest + extraInterest + actualJunePlus - totalOutstanding);
}

function availableLoanAmount() {
  return Math.max(0, expectedBankBalance() - Number(state.settings.minimumReserve || 5000));
}

function currentMonthPayment(memberId) {
  return state.monthlyPayments.find((payment) => payment.memberId === memberId && payment.month === currentMonth());
}

function memberMonthlyDue(member) {
  return expectedMonthlyDeposit(member) + memberMonthlyInterest(member.id);
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

function render() {
  document.body.classList.toggle("kannada", state.lang === "kn");
  const user = currentUser();
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
          <div class="user-chip">
            ${memberAvatarHtml(user)}
            <div>
              <strong>${escapeHtml(user.name)}</strong>
              <span>${escapeHtml(roleLabel(user.role))}</span>
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
        ${navButton("admin", "⚙", t("admin"))}
      </nav>
    </div>
  `;

  if (openDetails.size > 0) {
    document.querySelectorAll("details.collapsible").forEach((el) => {
      const title = el.querySelector("h3")?.textContent?.trim();
      if (title && openDetails.has(title)) el.open = true;
    });
  }

  renderChatFab();
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

  const tiles = [
    { icon: "🐷", title: "DEPOSITS", sub: "Monthly savings & year records", tab: "deposits" },
    { icon: "💳", title: "LOANS", sub: "View your loan details", action: "show-loans" },
    { icon: "👥", title: "MEMBERS", sub: "Association members", tab: "members" },
    { icon: "📊", title: "DASHBOARD", sub: "Association analytics", tab: "meetings" },
    { icon: "📜", title: "RULES", sub: "Association guidelines", action: "show-rules" },
    isAdmin()
      ? { icon: "⚙️", title: "ADMIN", sub: "Settings & approvals" + (approvalCount > 0 ? ` · ${approvalCount} pending` : ""), tab: "admin" }
      : { icon: "👤", title: "MY ACCOUNT", sub: "Deposits & loan status", tab: "members" },
  ];

  return `
    <section class="dash-hero">
      <div class="dash-greeting">
        <p>${greeting}</p>
        <h2>${escapeHtml(user.name || "Member")}</h2>
      </div>
      <div class="dash-avatar-wrap">
        ${user.avatarUrl
          ? `<img src="${escapeHtml(user.avatarUrl)}" class="dash-avatar dash-avatar-photo" alt="${escapeHtml(user.name)}" />`
          : `<div class="dash-avatar">${escapeHtml(initials)}</div>`}
        ${liveBackendReady ? `<label class="dash-avatar-cam" for="home-avatar-input" title="Change photo">📷</label><input type="file" id="home-avatar-input" accept="image/*" data-action="upload-avatar" style="display:none;" />` : ""}
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
          <strong>${money((() => { const loans = currentLoans().filter(l => l.notes !== "emi_entry").reduce((s, l) => s + loanOutstanding(l), 0); return loans + expectedBankBalance(); })())}</strong>
          <small>Total association pool</small>
        </div>
        <div class="dash-summary-col">
          <p>Bank Balance</p>
          <strong>${money(expectedBankBalance())}</strong>
          <small>Estimated</small>
        </div>
        <div class="dash-summary-col">
          <p>Available Loan</p>
          <strong>${money(availableLoanAmount())}</strong>
          <small>For new loans</small>
        </div>
        <div class="dash-summary-col">
          <p>Monthly Due</p>
          <strong>${money(monthlyDue)}</strong>
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

      <div class="card" style="margin-top:12px;">
        <div class="card-header">
          <div><h3>🗓️ Our Journey</h3><p>Year by year milestones</p></div>
        </div>
        <div class="card-body">
          <div class="journey-list">
            <div class="journey-item">
              <div class="journey-dot">1</div>
              <div class="journey-content">
                <strong>Year 1 · 2021</strong>
                <p>Started at ₹1,000/month. First annual meeting at M Thumbaraguddi (native place).</p>
                <button class="photos-btn" data-action="show-meeting-photos" data-year="1">📸 4 photos</button>
              </div>
            </div>
            <div class="journey-item">
              <div class="journey-dot">2</div>
              <div class="journey-content">
                <strong>Year 2 · 2022</strong>
                <p>Increased to ₹1,500/month. Annual meeting at Sampige Heritage Resort, Koppal.</p>
                <button class="photos-btn" data-action="show-meeting-photos" data-year="2">📸 3 photos</button>
              </div>
            </div>
            <div class="journey-item">
              <div class="journey-dot">3</div>
              <div class="journey-content">
                <strong>Year 3 · 2023</strong>
                <p>Added ₹5,000 yearly renewal fee. Annual meeting at Cotton County Club, Hubballi.</p>
                <button class="photos-btn" data-action="show-meeting-photos" data-year="3">📸 3 photos</button>
              </div>
            </div>
            <div class="journey-item">
              <div class="journey-dot">4</div>
              <div class="journey-content">
                <strong>Year 4 · 2024</strong>
                <p>Renewal fee raised to ₹6,000. Annual meeting at Jungle Vibes Resort, Dandeli.</p>
                <button class="photos-btn" data-action="show-meeting-photos" data-year="4">📸 3 photos</button>
              </div>
            </div>
            <div class="journey-item">
              <div class="journey-dot journey-dot-active">5</div>
              <div class="journey-content">
                <strong>Year 5 · 2025 ✨</strong>
                <p>Extended to 10 years. New member Appanna joined; Sarpa exited. Per member share ₹1,21,833.57. Annual meeting at Sandur Wonder Valley Resort.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
    const monthlyInt = loanBaseMonthlyInterest(loan);
    const statusColor = isActive ? "#16a34a" : "#6b7280";
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

  const photoCounts = { 1: 4, 2: 3, 3: 3, 4: 3 };
  const labels = {
    1: "Year 1 · 2021 · M Thumbaraguddi",
    2: "Year 2 · 2022 · Sampige Heritage Resort, Koppal",
    3: "Year 3 · 2023 · Cotton County Club, Hubballi",
    4: "Year 4 · 2024 · Jungle Vibes Resort, Dandeli",
  };
  const count = photoCounts[year] || 0;
  const label = labels[year] || `Year ${year}`;

  const photosHtml = Array.from({ length: count }, (_, i) => `
    <div class="photo-thumb-wrap" data-action="open-photo" data-src="./images/meetings/yr${year}/meeting${i + 1}.jpg">
      <img src="./images/meetings/yr${year}/meeting${i + 1}.jpg" class="photo-thumb" loading="lazy" alt="Meeting photo ${i + 1}" />
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

function openPhotoLightbox(src) {
  const existing = document.getElementById("photo-lightbox");
  if (existing) existing.remove();

  const html = `
    <div id="photo-lightbox" class="photo-lightbox" data-action="close-lightbox">
      <button class="photo-lightbox-close" data-action="close-lightbox">✕</button>
      <img src="${escapeHtml(src)}" class="photo-lightbox-img" alt="Meeting photo" />
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

function appannaEmiProgress() {
  const startYear = 2026, startMon = 1;
  const totalMonths = 18;
  const monthlyEmi = 7445.38;
  const now = new Date();
  const elapsed = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMon) + 1;
  const paid = Math.min(Math.max(elapsed, 0), totalMonths);
  return { paid, remaining: totalMonths - paid, totalMonths, monthlyEmi, totalAmount: monthlyEmi * totalMonths };
}

function depositYearCard(d) {
  const ordinals = { d2021: "First", d2022: "Second", d2023: "Third", d2024: "Fourth", d2025: "Fifth" };
  return `
  <details class="card collapsible">
    <summary class="card-header">
      <div>
        <h3>${escapeHtml(d.label)}</h3>
        <p>Principal ${money(d.principal)} · Interest <span style="color:#16a34a;">${money(d.interest)}</span> · Expenditure <span style="color:#dc2626;">${money(d.expenditure)}</span> · Balance <strong style="color:#2563eb;">${money(d.balance)}</strong></p>
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

function renderDeposits() {
  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const _now = new Date();
  const years = [
    { key: "d2021", label: "First Year",  sub: "2021 – 2022", balance: initialState.deposits.find(d => d.id === "d2021")?.balance },
    { key: "d2022", label: "Second Year", sub: "2022 – 2023", balance: initialState.deposits.find(d => d.id === "d2022")?.balance },
    { key: "d2023", label: "Third Year",  sub: "2023 – 2024", balance: initialState.deposits.find(d => d.id === "d2023")?.balance },
    { key: "d2024", label: "Fourth Year", sub: "2024 – 2025", balance: initialState.deposits.find(d => d.id === "d2024")?.balance },
    { key: "d2025", label: "Fifth Year",  sub: "2025",        balance: initialState.deposits.find(d => d.id === "d2025")?.balance },
    { key: "d2026", label: "Sixth Year",  sub: `Nov 2025 – ${MONTH_SHORT[_now.getMonth()]} ${_now.getFullYear()}`, balance: null, active: true },
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

  const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const _now = new Date();
  const _nowYM = _now.getFullYear() * 100 + (_now.getMonth() + 1);
  const _jMonths = _nowYM >= 202601 ? (_now.getFullYear() - 2026) * 12 + _now.getMonth() + 1 : 0;
  const emi = appannaEmiProgress();

  let title = "", bodyHtml = "";

  if (yearKey === "d2026") {
    const _yr6InterestPreJune = Math.round(year6InterestCollected()); // capped at May 2026

    // June+ actual payments: separate deposit and interest portions
    const _junePlusPayments = state.monthlyPayments.filter((p) => p.status === "paid" && p.month >= "2026-06");
    const _yr6InterestJunePlus = Math.round(_junePlusPayments.reduce((sum, p) => {
      const mem = memberById(p.memberId);
      if (!mem) return sum;
      const deposit = expectedMonthlyDeposit(mem, p.month);
      return sum + Math.max(0, Number(p.paidAmount || p.amount || 0) - deposit);
    }, 0));
    const _yr6DepositsJunePlus = Math.round(_junePlusPayments.reduce((sum, p) => {
      const mem = memberById(p.memberId);
      if (!mem) return sum;
      return sum + expectedMonthlyDeposit(mem, p.month);
    }, 0));

    const _yr6Interest = _yr6InterestPreJune + _yr6InterestJunePlus;
    const _yr6JDeposits = 7 * 2000 * _jMonths;
    const _yr6Emi = Math.round(emi.paid * emi.monthlyEmi);
    const _yr6Total = 21000 + 14000 + 11250 + _yr6JDeposits + _yr6DepositsJunePlus + _yr6Emi + _yr6Interest + 8125 + 3046;

    // End month label — use latest payment month if it's beyond current month
    const _latestPaidMonth = _junePlusPayments.map((p) => p.month).sort().pop();
    const _endDate = _latestPaidMonth ? new Date(_latestPaidMonth + "-01") : _now;
    const _endLabel = `${MONTH_SHORT[_endDate.getMonth()]} ${_endDate.getFullYear()}`;

    title = `Sixth Year (Nov 2025 – ${_endLabel})`;
    const points = [
      { text: "7 members · Appanna Banakar joined Nov 2025 · Sarpabhushana Banakar exited Oct 2025", meta: true },
      { label: "Yearly Renewal Fee", detail: "November 2025 (₹3,000 × 7 members)", amount: 21000 },
      { label: "Monthly Deposits", detail: "November 2025 (₹2,000 × 7 members)", amount: 14000 },
      { label: "Monthly Deposits", detail: "December 2025 (5 members ₹2,000 + 6th ₹1,250 + President exempt)", amount: 11250 },
      { label: "Monthly Deposits", detail: `Jan – May 2026 (₹2,000 × 7 members × 5 months)`, amount: _yr6JDeposits },
      ...(_yr6DepositsJunePlus > 0 ? [{ label: "Monthly Deposits", detail: `Jun ${_endDate.getFullYear()} onwards (actual collected)`, amount: _yr6DepositsJunePlus }] : []),
      { label: "New Member EMI", detail: `Appanna Banakar – ${emi.paid} months × ${money(emi.monthlyEmi)}`, amount: _yr6Emi },
      { label: "Interest Earned", detail: `Nov 2025 – ${_endLabel} (from active loans)`, amount: _yr6Interest },
      { label: "Additional Interest", detail: "Sarpabhushana ₹8,125 + Appanna ₹3,046 (outside loan table)", amount: 8125 + 3046 },
    ];
    bodyHtml = `
      <ul class="year-modal-list">
        ${points.map(p => p.meta
          ? `<li class="year-modal-meta">${p.text}</li>`
          : `<li class="year-modal-item"><div><span class="year-modal-label">${escapeHtml(p.label)}</span><span class="year-modal-detail">${escapeHtml(p.detail)}</span></div><strong class="year-modal-amount" style="color:#16a34a;">${money(p.amount)}</strong></li>`
        ).join("")}
      </ul>
      <div class="year-modal-total"><span>Total Collected</span><strong>${money(_yr6Total)}</strong></div>`;
  } else {
    const d = initialState.deposits.find(dep => dep.id === yearKey);
    if (!d) return;
    title = d.label;
    bodyHtml = `
      ${d.intro ? `<p class="year-modal-intro">${escapeHtml(d.intro)}</p>` : ""}
      <ul class="year-modal-list">
        ${(d.breakdown || []).map(row => `
          <li class="year-modal-item">
            <div><span class="year-modal-label">${escapeHtml(row.description)}</span><span class="year-modal-detail">${escapeHtml(row.details)}</span></div>
            <strong class="year-modal-amount" style="color:${row.amount < 0 ? "#dc2626" : "#16a34a"};">${row.amount < 0 ? "−" + money(Math.abs(row.amount)) : money(row.amount)}</strong>
          </li>`).join("")}
      </ul>
      <div class="year-modal-total"><span>Closing Balance</span><strong style="color:#2563eb;">${money(d.balance)}</strong></div>`;
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
  const activeCount = currentLoanBookRows().length;
  const loanYears = [
    { key: "l2021", label: "First Year",  sub: "2021 – 2022", tag: "Summary only", allClear: true },
    { key: "l2022", label: "Second Year", sub: "2022 – 2023", tag: "Summary only", allClear: true },
    { key: "l2023", label: "Third Year",  sub: "2023 – 2024", count: 8,  allClear: true },
    { key: "l2024", label: "Fourth Year", sub: "2024 – 2025", count: 13, allClear: true },
    { key: "l2026", label: "Sixth Year",  sub: `Oct 2025 – ${MONTH_SHORT[_now.getMonth()]} ${_now.getFullYear()}`, count: activeCount, active: true },
  ];
  return `
    <section class="page-title"><p>${t("loans")}</p><h2>Loan records</h2></section>
    <section class="grid">
      <details class="card collapsible">
        <summary class="card-header"><div><h3>${t("loanRequest")}</h3><p>Submit request for admin approval</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <form class="form" data-form="loan-request">
            <label class="field"><span>${t("amount")}</span><input name="amount" type="number" min="1" required /></label>
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

  if (yearKey === "l2026") {
    title = "Sixth Year (2025-26) · Current";
    const loans = currentLoanBookRows();
    const user = currentUser();
    const tableRows = loans.map(loan => {
      const dueThisMonth = loan.status === "active" && isLoanDueThisMonth(loan);
      const myLoan = loanBelongsToMember(loan, user);
      const extInfo = dueThisMonth ? loanExtensionStatus(loan.id) : null;
      let extCell = "-";
      if (isAdmin()) {
        extCell = `${loan.status === "active" ? `<button class="primary" data-action="clear-current-loan" data-id="${loan.id}" type="button" style="font-size:11px;padding:3px 7px;min-height:0;">Clear</button> ` : ""}<button class="danger" data-action="delete-current-loan" data-id="${loan.id}" type="button" style="font-size:11px;padding:3px 7px;min-height:0;">Del</button>`;
      } else if (dueThisMonth && myLoan) {
        if (!extInfo || extInfo.status === "rejected") {
          extCell = `<button class="secondary" data-action="request-extension" data-loan-id="${loan.id}" type="button" style="font-size:11px;padding:3px 7px;min-height:0;">Extend</button>`;
        } else if (extInfo.status === "pending") {
          extCell = `<span style="font-size:11px;color:#b45309;">⏳ Awaiting</span>`;
        } else if (extInfo.status === "approved") {
          extCell = `<span style="font-size:11px;color:#16a34a;">✓ Extended</span>`;
        }
      }
      return `<tr>
        <td data-label="Member"><strong>${escapeHtml(loanMemberName(loan))}</strong><br><small style="color:#9ca3af;">${fmtMonthYear(loan.from)}</small></td>
        <td data-label="Amount">${money(loan.amount)}</td>
        <td data-label="Interest/mo">${money(loan.status === "active" ? loanMonthlyInterest(loan) : 0)}</td>
        <td data-label="Renewal">${fmtMonthYear(loanRenewalDate(loan))}</td>
        <td data-label="Status">${statusBadge(loan.status)}</td>
        <td data-label="Action">${extCell}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="6" class="empty">No loans entered yet.</td></tr>`;
    const thead = `<thead><tr><th>Member</th><th>Amount</th><th>Interest/mo</th><th>Renewal</th><th>Status</th><th>Action</th></tr></thead>`;
    bodyHtml = `<div class="table-wrap" style="overflow-x:auto;"><table style="min-width:0;width:100%;">${thead}<tbody>${tableRows}</tbody></table></div>`;
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
                <span>${escapeHtml(member.phone)} · ${escapeHtml(roleLabel(member.role))}</span>
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
  const nowYM = now.getFullYear() * 100 + (now.getMonth() + 1);
  let yr6Deposits = 0;
  if (nowYM >= 202511) yr6Deposits += 21000 + 14000;
  if (nowYM >= 202512) yr6Deposits += 11250;
  if (nowYM >= 202601) {
    const jMonths = (now.getFullYear() - 2026) * 12 + now.getMonth() + 1;
    yr6Deposits += 7 * 2000 * jMonths;
    const emi = appannaEmiProgress();
    yr6Deposits += Math.round(emi.paid * emi.monthlyEmi);
  }
  const yr6Interest = year6InterestCollected();

  const baseDeposits = (state.deposits.length ? state.deposits : initialState.deposits).filter(d => d.year <= 2025);
  const chartData = [
    ...baseDeposits.map((d, i) => ({ label: `Yr${i + 1}`, deposits: d.principal, interest: d.interest })),
    { label: "Yr6", deposits: yr6Deposits, interest: yr6Interest, live: true },
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
      <div class="alert">Only the president/admin can approve members, import statements, and post transactions.</div>
    `;
  }

  const pendingLoanRequests = state.loanRequests.filter((request) => request.status === "pending");
  const monthlyInterestPreview = (Number(0) * state.settings.loanInterestRateMonthly) / 100;
  return `
    <section class="page-title"><p>${t("admin")}</p><h2>Operations</h2></section>
    <section class="grid">
      <details class="card collapsible" open>
        <summary class="card-header"><div><h3>Payment Collection</h3><p>${new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })} · Mark members as paid</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body" style="padding:0;overflow-x:auto;">
          <table class="payment-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Amount Due</th>
                <th>Status</th>
                <th>Action</th>
                <th>Next Payment</th>
              </tr>
            </thead>
            <tbody>
              ${depositMembers().map((member) => {
                const payment = state.monthlyPayments.find((p) => p.memberId === member.id && p.month === currentMonth());
                const isPaid = payment?.status === "paid";
                const due = money(memberMonthlyDue(member));
                const nextMonthName = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleString("en-IN", { month: "long" });
                return `
                <tr>
                  <td><strong>${escapeHtml(member.name)}</strong></td>
                  <td>${due}</td>
                  <td>${isPaid ? `<span class="badge good">✓ Paid</span>` : `<span class="badge pending">Pending</span>`}</td>
                  <td>${isPaid ? `—` : `<button class="primary small" data-action="mark-payment-paid" data-member-id="${member.id}" type="button">Mark Paid</button>`}</td>
                  <td class="next-pay-date">${isPaid ? `1–5 ${nextMonthName}` : `—`}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table>
        </div>
      </details>

      <details class="card collapsible">
        <summary class="card-header"><div><h3>Add current loan</h3><p>Admin entry saved to current loan book</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <form class="form" data-form="manual-loan">
            <label class="field"><span>Member name</span><input name="memberName" required placeholder="Example: Pratap Banakar" /></label>
            <label class="field"><span>Phone number</span><input name="memberPhone" inputmode="numeric" required placeholder="10 digit mobile number" /></label>
            <label class="field"><span>Loan amount</span><input name="amount" inputmode="numeric" pattern="[0-9,]*" required data-loan-amount /></label>
            <label class="field"><span>Interest to be paid / month</span><input value="${money(monthlyInterestPreview)}" readonly data-loan-interest-preview /></label>
            <label class="field"><span>Loan taken date</span><input name="from" type="date" value="${today()}" required /></label>
            <label class="field"><span>Renewal date</span><input name="renewalOrReturnDate" type="date" required /></label>
            <button class="primary" type="submit">Add loan</button>
          </form>
        </div>
      </details>

      <details class="card collapsible">
        <summary class="card-header"><div><h3>Signup approvals</h3><p>Member signup requests</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body row-list">
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
      </details>

      <details class="card collapsible">
        <summary class="card-header"><div><h3>Loan approvals</h3><p>Approve and disburse manually from ICICI</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body row-list">
          ${pendingLoanRequests.map((request) => `
            <div class="row-item">
              <div><strong>${escapeHtml(memberById(request.memberId)?.name || "-")} · ${money(request.amount)}</strong><span>${escapeHtml(request.reason)} · ${escapeHtml(request.date)}</span></div>
              <div class="actions">
                <button class="primary" data-action="approve-loan" data-id="${request.id}" type="button">${t("approve")}</button>
                <button class="danger" data-action="reject-loan" data-id="${request.id}" type="button">${t("reject")}</button>
              </div>
            </div>
          `).join("") || `<div class="empty">No loan requests.</div>`}
        </div>
      </details>

      <details class="card collapsible">
        <summary class="card-header"><div><h3>Loan Extension Requests</h3><p>Approve or reject member extension requests</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body row-list">
          ${(() => {
            const pending = (state.extensionRequests || []).filter((e) => e.status === "pending");
            if (!pending.length) return `<div class="empty">No pending extension requests.</div>`;
            return pending.map((ext) => {
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
            }).join("");
          })()}
        </div>
      </details>

      <details class="card collapsible">
        <summary class="card-header"><div><h3>${t("statementImport")}</h3><p>CSV upload parser for ICICI statement sample</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <form class="form" data-form="statement-text">
            <label class="field">
              <span>Paste CSV rows</span>
              <textarea name="statement" placeholder="date,narration,debit,credit,balance&#10;2026-05-15,UPI/PRATAP,0,2000,233770"></textarea>
            </label>
            <button class="primary" type="submit">${t("reviewAndPost")}</button>
            <p class="hint">When you provide a real ICICI sample, I will add exact file upload and matching rules.</p>
          </form>
        </div>
      </details>

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

document.addEventListener("click", async (event) => {
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    state.activeTab = tabButton.dataset.tab;
    saveState();
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

  if (action.dataset.action === "show-deposit-year") {
    showDepositYearModal(action.dataset.year);
    return;
  }

  if (action.dataset.action === "close-deposit-year") {
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

  if (action.dataset.action === "open-photo") {
    openPhotoLightbox(action.dataset.src);
    return;
  }

  if (action.dataset.action === "close-lightbox") {
    const lb = document.getElementById("photo-lightbox");
    if (lb) lb.remove();
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
    if (liveBackendReady) await supabaseClient.auth.signOut();
    state.currentUserId = null;
    saveState();
    render();
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
    if (action.dataset.action === "clear-current-loan") await clearCurrentLoan(action.dataset.id);
    if (action.dataset.action === "delete-current-loan") await deleteCurrentLoan(action.dataset.id);
    if (action.dataset.action === "request-extension") await requestExtension(action.dataset.loanId);
    if (action.dataset.action === "approve-extension") await approveExtension(action.dataset.id, action.dataset.loanId);
    if (action.dataset.action === "reject-extension") await rejectExtension(action.dataset.id, action.dataset.profileId);

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

  // Home / Members avatar upload
  const avatarInput = event.target.closest("[data-action='upload-avatar']");
  if (avatarInput && avatarInput.files?.[0]) {
    handleAvatarUpload(avatarInput.files[0]);
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
    if (type === "statement-text") await importStatement(data);
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
    render();
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

async function requestLoan(data) {
  const user = currentUser();
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("loan_requests").insert({
      profile_id: user.id,
      amount: Number(data.amount),
      reason: data.reason.trim(),
    }));
    await addLiveAudit(`${user.name} requested loan ${money(data.amount)}.`, "loan_requested");
    await loadLiveState();
    showToast("Loan request submitted.");
    render();
    return;
  }

  state.loanRequests.push({ id: uid("q"), memberId: user.id, amount: Number(data.amount), reason: data.reason.trim(), status: "pending", date: today() });
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
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  const renewalDateStr = renewalDate.toISOString().slice(0, 10);
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("loan_requests").update({
      status: "approved",
      decided_at: new Date().toISOString(),
      decided_by: currentProfileId(),
    }).eq("id", id));
    await liveQuery(supabaseClient.from("current_loans").insert({
      profile_id: request.memberId,
      member_name: member?.name || "",
      member_phone: member?.phone || "",
      principal: request.amount,
      principal_paid: 0,
      interest_rate_monthly: state.settings.loanInterestRateMonthly,
      monthly_interest: 0,
      status: "active",
      purpose: request.reason,
      disbursed_at: today(),
      renewal_or_return_date: renewalDateStr,
    }));
    await addLiveAudit(`Approved loan ${money(request.amount)} for ${member?.name}.`, "loan_approved");
    await loadLiveState();
    showToast("Loan approved.");
    render();
    return;
  }

  request.status = "approved";
  state.loans.push({ id: uid("l"), memberId: request.memberId, memberName: member?.name || "", amount: request.amount, principalPaid: 0, from: today(), renewalOrReturnDate: renewalDateStr, status: "active", purpose: request.reason });
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
}

async function notifyMember(profileId, type, title, body, relatedId = null) {
  if (!liveBackendReady || !profileId) return;
  await liveQuery(supabaseClient.from("notifications").insert({ profile_id: profileId, type, title, body, related_id: relatedId }));
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

async function importStatement(data) {
  const rows = data.statement
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(1)
    .map((line) => {
      const [date, narration, debit, credit, balance] = line.split(",");
      return { id: uid("b"), date, narration, debit: Number(debit || 0), credit: Number(credit || 0), balance: Number(balance || 0) };
    });

  const matchedPayments = rows.filter((row) => row.credit > 0).map((row) => {
    const narration = String(row.narration || "").toLowerCase();
    const member = activeMembers().find((item) => narration.includes(item.name.split(" ")[0].toLowerCase()));
    return member ? { row, member } : null;
  }).filter(Boolean);

  matchedPayments.forEach(({ row, member }) => {
    state.monthlyPayments.push({ id: uid("p"), memberId: member.id, month: row.date.slice(0, 7), amount: row.credit, status: "paid", source: "statement" });
  });

  if (liveBackendReady) {
    const latestBalanceRow = [...rows].reverse().find((row) => Number.isFinite(row.balance));
    for (const row of rows) {
      const match = matchedPayments.find((item) => item.row.id === row.id);
      const transaction = await liveQuery(supabaseClient.from("bank_transactions").insert({
        transaction_date: row.date,
        narration: row.narration,
        debit: row.debit,
        credit: row.credit,
        balance: row.balance,
        matched_profile_id: match?.member.id || null,
        match_type: match ? "monthly_deposit" : null,
        review_status: match ? "posted" : "unreviewed",
      }).select("id").single());
      if (match) {
        await liveQuery(supabaseClient.from("monthly_payments").upsert({
          profile_id: match.member.id,
          month: row.date.slice(0, 7),
          expected_amount: expectedMonthlyDeposit(match.member, row.date.slice(0, 7)),
          paid_amount: row.credit,
          status: "paid",
          source: "statement",
          bank_transaction_id: transaction.id,
        }, { onConflict: "profile_id,month" }));
      }
    }
    if (latestBalanceRow) {
      await liveQuery(supabaseClient.from("settings").upsert({
        id: "bank_balance",
        value: {
          amount: latestBalanceRow.balance,
          updatedAt: latestBalanceRow.date || today(),
          source: "statement",
        },
        updated_at: new Date().toISOString(),
      }));
    }
    await addLiveAudit(`Imported ${rows.length} statement rows; matched ${matchedPayments.length} deposits.`, "statement_imported");
    await loadLiveState();
    showToast(`Imported ${rows.length} rows, matched ${matchedPayments.length}.`);
    render();
    return;
  }

  state.statementRows.push(...rows);
  state.audit.push({ id: uid("a"), date: today(), text: `Imported ${rows.length} statement rows; matched ${matchedPayments.length} deposits.` });
  saveState();
  showToast(`Imported ${rows.length} rows, matched ${matchedPayments.length}.`);
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
  idleTimer = setTimeout(async () => {
    if (!state.currentUserId) return;
    if (liveBackendReady) await supabaseClient.auth.signOut();
    state.currentUserId = null;
    localStorage.removeItem(IDLE_TS_KEY);
    saveState();
    showToast("You have been logged out due to inactivity.");
    render();
  }, IDLE_TIMEOUT_MS);
}

async function checkIdleExpiry() {
  const last = parseInt(localStorage.getItem(IDLE_TS_KEY) || "0", 10);
  if (!last) return;
  if (Date.now() - last > IDLE_TIMEOUT_MS) {
    if (liveBackendReady) await supabaseClient.auth.signOut();
    state.currentUserId = null;
    localStorage.removeItem(IDLE_TS_KEY);
    saveState();
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
    const { error } = await liveQuery(supabaseClient.from("monthly_payments").upsert({
      profile_id: memberId,
      month,
      expected_amount: amount,
      paid_amount: amount,
      status: "paid",
      source: "manual",
    }, { onConflict: "profile_id,month" }));
    if (error) { showToast("Failed to mark as paid."); return; }
    await loadLiveState();
  } else {
    const existing = state.monthlyPayments.find((p) => p.memberId === memberId && p.month === month);
    if (existing) existing.status = "paid";
    else state.monthlyPayments.push({ id: uid("p"), memberId, month, amount, status: "paid", source: "manual" });
  }
  render();
  showToast(`${member.name} marked as paid.`);
}

async function initApp() {
  document.querySelector("#app").innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:16px;">
      <div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#2563eb;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
      <p style="font-size:13px;color:#9ca3af;margin:0;">Loading…</p>
    </div>`;
  if (liveBackendReady) {
    if (window.location.hash.includes("type=recovery")) {
      supabaseClient.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") renderSetNewPassword();
      });
      // Also check immediately in case the event already fired before listener registered
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) renderSetNewPassword();
      return;
    }
    try {
      await checkIdleExpiry();
      await loadLiveState();
    } catch (error) {
      showToast(error.message || "Could not load live data.");
    }
  }
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

initApp().then(() => { initPullToRefresh(); initRealtimeChat(); });
