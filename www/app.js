const STORAGE_KEY = "banakar-finclub-state-v1";
const PRESIDENT_PHONE = "9591382942";
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
    dashboard: "Dashboard",
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
    meetings: "Meetings",
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
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
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
    meetings: "ಸಭೆಗಳು",
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
  loanRequests: [
    { id: "q1", memberId: "m7", amount: 25000, reason: "Medical support", status: "pending", date: "2026-05-14" },
  ],
  loanHistory: [],
  notifications: [],
  statementRows: [],
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
    interestPaid: Number(loan.interest_paid || 0),
    from: loan.disbursed_at,
    renewalOrReturnDate: loan.renewal_or_return_date || "",
    closedAt: loan.closed_at || "",
    status: loan.status,
    isInterestFree: Boolean(loan.is_interest_free),
    purpose: loan.purpose || "",
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

  const [settingsRows, profiles, deposits, payments, loanRequests, loans, loanHistory, audit, notifications] = await Promise.all([
    liveQuery(supabaseClient.from("settings").select("id,value")),
    liveQuery(supabaseClient.from("profiles").select("*").order("created_at", { ascending: true })),
    liveQuery(supabaseClient.from("deposit_summaries").select("*").order("year", { ascending: true })),
    liveQuery(supabaseClient.from("monthly_payments").select("*").order("created_at", { ascending: false })),
    liveQuery(supabaseClient.from("loan_requests").select("*").order("requested_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("current_loans").select("*").order("created_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("loan_history").select("*").order("from_date", { ascending: false })),
    liveQuery(supabaseClient.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20)),
    liveOptionalList(supabaseClient.from("notifications").select("*").order("created_at", { ascending: false }).limit(50)),
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
      id: item.id,
      year: item.year,
      label: item.label,
      principal: Number(item.principal || 0),
      interest: Number(item.interest || 0),
      expenditure: Number(item.expenditure || 0),
      balance: Number(item.balance || 0),
    })),
    monthlyPayments: payments.map(livePaymentToLocal),
    loanRequests: loanRequests.map(liveLoanRequestToLocal),
    loans: loans.map(liveLoanToLocal),
    loanHistory: loanHistory.map(liveLoanHistoryToLocal),
    notifications: notifications.map(liveNotificationToLocal),
    statementRows: [],
    audit: audit.reverse().map(liveAuditToLocal),
  };
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
  return (loanOutstanding(loan) * Number(loan.interestRateMonthly || state.settings.loanInterestRateMonthly)) / 100;
}

function loanBaseMonthlyInterest(loan) {
  if (loan.status === "interest_free" || loan.isInterestFree) return 0;
  return (Number(loan.amount || 0) * Number(loan.interestRateMonthly || state.settings.loanInterestRateMonthly)) / 100;
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

function availableLoanAmount() {
  return Math.max(0, bankBalance() - Number(state.settings.minimumReserve || 5000));
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
    renderAuth("login");
    return;
  }

  document.querySelector("#app").innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="user-chip">
            <div class="avatar">${initials(user.name)}</div>
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
}

function initials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" inputmode="tel" required placeholder="9591382942" /></label>
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
      <label class="field"><span>${t("name")}</span><input name="name" type="text" required /></label>
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" required /></label>
      <label class="field"><span>Email</span><input name="email" type="email" required placeholder="your@gmail.com" /></label>
      ${passwordField("password", t("password"))}
      <button class="primary" type="submit">${t("requestAccess")}</button>
      <p class="hint">Signup requests stay pending until the president approves them.</p>
    </form>
  `;
}

function resetForm() {
  return `
    <form class="form" data-form="reset">
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" inputmode="tel" required placeholder="9591382942" /></label>
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
    metric(t("bankBalance"), money(bankBalance()), `From latest statement · ${escapeHtml(state.settings.bankBalanceUpdatedAt || "-")}`),
    metric(t("availableLoan"), money(availableLoanAmount()), `Bank balance - ${money(state.settings.minimumReserve || 5000)} reserve`),
    metric(t("monthlyDue"), money(monthlyDue), `${statusText(monthlyPayment?.status || "pending")} · deposit ${money(ownDeposit)} + interest ${money(ownInterest)}`),
    metric(t("outstandingLoans"), money(memberOutstanding(user.id)), "Your outstanding principal"),
  ];
  if (isAdmin()) {
    dashboardMetrics.push(metric(t("pendingApprovals"), String(approvalCount), "Signup and loan requests"));
  } else {
    dashboardMetrics.push(metric(t("loanRequestStatus"), statusText(request?.status || "none"), request ? `${money(request.amount)} · ${escapeHtml(request.date || "-")}` : "No loan request"));
  }
  const logCard = isAdmin() ? `
      <div class="card">
        <div class="card-header">
          <div><h3>${t("recentActivity")}</h3><p>Audit log</p></div>
        </div>
        <div class="card-body row-list">
          ${state.audit.slice(-5).reverse().map((item) => `
            <div class="row-item"><div><strong>${escapeHtml(item.text)}</strong><span>${escapeHtml(item.date)}</span></div><span class="badge info">Log</span></div>
          `).join("")}
        </div>
      </div>
  ` : "";
  const loanRows = memberLoans(user.id)
    .map((loan) => `<div class="row-item"><div><strong>${escapeHtml(loanMemberName(loan))}: ${money(loanOutstanding(loan))}</strong><span>Interest ${money(loanMonthlyInterest(loan))} · renewal ${escapeHtml(loanRenewalDate(loan) || "-")}</span></div><span class="badge info">${statusText(loan.status)}</span></div>`)
    .join("");
  const loanCard = `
      <div class="card">
        <div class="card-header"><div><h3>Loan taken</h3><p>Your current loan details</p></div></div>
        <div class="card-body row-list">
          ${loanRows || `<div class="empty">No current loans.</div>`}
        </div>
      </div>
  `;
  return `
    <section class="page-title">
      <p>Banakar FinClub</p>
      <h2>${t("dashboard")}</h2>
    </section>
    <section class="metrics">
      ${dashboardMetrics.join("")}
    </section>
    <section class="two-col" style="margin-top: 14px;">
      ${logCard}
      ${loanCard}
      <div class="card">
        <div class="card-header"><div><h3>${t("groupRules")}</h3><p>Current 5-year extension setup</p></div></div>
        <div class="card-body row-list">
          <div class="row-item"><div><strong>${money(state.settings.monthlyDeposit)}</strong><span>Monthly deposit by 15th</span></div><span class="badge good">Active</span></div>
          <div class="row-item"><div><strong>${state.settings.loanInterestLabel}</strong><span>Loan interest rule</span></div><span class="badge info">1.25%</span></div>
          <div class="row-item"><div><strong>December concession</strong><span>President ${money(0)}, Vice President ${money(1250)}</span></div><span class="badge warn">Special</span></div>
        </div>
      </div>
    </section>
  `;
}

function metric(label, value, help) {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(help)}</small></article>`;
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
  const user = currentUser();
  const visiblePayments = isAdmin() ? state.monthlyPayments : state.monthlyPayments.filter((payment) => payment.memberId === user.id);
  const emi = appannaEmiProgress();
  const pct = Math.round((emi.paid / emi.totalMonths) * 100);

  return `
    <section class="page-title"><p>${t("deposits")}</p><h2>Deposits & collections</h2></section>

    <section class="two-col">
      <div class="card">
        <div class="card-header"><div><h3>Payment status</h3><p>Current month and imported rows</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Month</th><th>Expected</th><th>Status</th><th>Source</th></tr></thead>
            <tbody>${visiblePayments.map((payment) => {
              const member = memberById(payment.memberId);
              return `<tr><td data-label="Member">${escapeHtml(member?.name || "-")}</td><td data-label="Month">${escapeHtml(payment.month)}</td><td data-label="Expected">${money(payment.amount)}</td><td data-label="Status">${statusBadge(payment.status)}</td><td data-label="Source">${escapeHtml(payment.source)}</td></tr>`;
            }).join("") || `<tr><td colspan="5" class="empty">No payments yet.</td></tr>`}</tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div><h3>Appanna Banakar — Joining EMI</h3><p>₹1,34,016.93 joining fee · 18 months from Jan 2026</p></div></div>
        <div class="card-body">
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
              <span style="font-size:13px;color:#666;">${emi.paid} of ${emi.totalMonths} months paid</span>
              <span style="font-size:13px;font-weight:600;">${pct}%</span>
            </div>
            <div style="background:#eee;border-radius:6px;height:8px;overflow:hidden;">
              <div style="background:#22c55e;height:100%;width:${pct}%;border-radius:6px;transition:width .3s;"></div>
            </div>
          </div>
          <div class="row-list">
            <div class="row-item"><div><strong>Monthly EMI</strong><span>Jan 2026 – Jun 2027</span></div><strong>${money(emi.monthlyEmi)}</strong></div>
            <div class="row-item"><div><strong>Collected so far</strong><span>${emi.paid} months × ${money(emi.monthlyEmi)}</span></div><strong>${money(emi.paid * emi.monthlyEmi)}</strong></div>
            <div class="row-item"><div><strong>Remaining</strong><span>${emi.remaining} months left</span></div><strong>${money(emi.remaining * emi.monthlyEmi)}</strong></div>
            <div class="row-item"><div><strong>Total amount</strong><span>Share + 10%</span></div><strong>${money(emi.totalAmount)}</strong></div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid">
      <details class="card collapsible">
        <summary class="card-header"><div><h3>Account Balance Summary</h3><p>First 5 years · 2021 – 2025</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Principal Amount</th>
                <th style="color:#16a34a;">Interest Earned</th>
                <th style="color:#dc2626;">Expenditure</th>
                <th style="color:#2563eb;">Total Balance</th>
              </tr>
            </thead>
            <tbody>
              ${state.deposits.map((item) => `
              <tr>
                <td data-label="Year">${item.year}</td>
                <td data-label="Principal Amount">${money(item.principal)}</td>
                <td data-label="Interest Earned" style="color:#16a34a;font-weight:600;">${money(item.interest)}</td>
                <td data-label="Expenditure" style="color:#dc2626;font-weight:600;">${money(item.expenditure)}</td>
                <td data-label="Total Balance" style="color:#2563eb;font-weight:700;">${money(item.balance)}</td>
              </tr>`).join("")}
            </tbody>
            <tfoot>
              <tr style="font-weight:700;">
                <td data-label="Year">Total (2021–2025)</td>
                <td data-label="Principal Amount">${money(state.deposits.reduce((s,d)=>s+d.principal,0))}</td>
                <td data-label="Interest Earned" style="color:#16a34a;">${money(state.deposits.reduce((s,d)=>s+d.interest,0))}</td>
                <td data-label="Expenditure" style="color:#dc2626;">${money(state.deposits.reduce((s,d)=>s+d.expenditure,0))}</td>
                <td data-label="Total Balance" style="color:#2563eb;">${money(state.deposits.reduce((s,d)=>s+d.balance,0))}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      ${[...initialState.deposits].reverse().map((d) => depositYearCard(d)).join("")}

      <details class="card collapsible">
        <summary class="card-header">
          <div><h3>Sixth Year (2026–2027)</h3><p>In Progress · <span class="badge warn">Active</span></p></div>
          <span class="collapse-icon">⌄</span>
        </summary>
        <div class="card-body">
          <p style="margin:0 0 10px;font-size:13px;color:#444;">In the sixth year, the association continues its financial progress with updated membership and fee structure:</p>
          <ul style="margin:0 0 16px;padding-left:18px;font-size:13px;color:#444;line-height:1.8;">
            <li>Yearly renewal fee: ₹3,000 for 7 members (November 2025)</li>
            <li>Monthly deposits: ₹2,000 per member from November to November</li>
            <li>President exemption: No payment in December month</li>
            <li>Vice President concession: ₹1,250 in December month</li>
            <li>Regular members: ₹2,000 per month throughout the year</li>
            <li>New member: Appanna Banakar joining via 18-month EMI of ${money(emi.monthlyEmi)}/month</li>
          </ul>
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#111;">Detailed Sixth Year Summary</p>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Description</th><th>Details</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td data-label="Description">Yearly Renewal Fee</td><td data-label="Details">November 2025 (₹3,000 × 7 members)</td><td data-label="Amount" style="color:#16a34a;font-weight:600;">₹21,000</td></tr>
                <tr><td data-label="Description">Monthly Deposits</td><td data-label="Details">November 2025 (₹2,000 × 7 members)</td><td data-label="Amount" style="color:#16a34a;font-weight:600;">₹14,000</td></tr>
                <tr><td data-label="Description">Monthly Deposits</td><td data-label="Details">December 2025 (5 members ₹2,000, 6th member ₹1,250, 7th member exempted)</td><td data-label="Amount" style="color:#16a34a;font-weight:600;">₹11,250</td></tr>
                <tr><td data-label="Description">Monthly Deposits</td><td data-label="Details">January – November 2026 (₹2,000 × 7 members × 11 months)</td><td data-label="Amount" style="color:#16a34a;font-weight:600;">₹1,54,000</td></tr>
                <tr><td data-label="Description">New Member EMI</td><td data-label="Details">Appanna Banakar – ${money(emi.monthlyEmi)}/month × 18 months</td><td data-label="Amount" style="color:#16a34a;font-weight:600;">₹1,34,016.84</td></tr>
                <tr><td data-label="Description">Interest Earned</td><td data-label="Details">Total interest earned (to be calculated)</td><td data-label="Amount" style="color:#888;">TBD</td></tr>
                <tr><td data-label="Description">Annual Meeting Expense</td><td data-label="Details">Year-end meeting cost</td><td data-label="Amount" style="color:#888;">TBD</td></tr>
              </tbody>
              <tfoot>
                <tr style="font-weight:700;"><td colspan="2" data-label="Total Balance">Total Balance</td><td data-label="Balance" style="color:#888;">As of November 2026 – TBD</td></tr>
              </tfoot>
            </table>
          </div>
        </div>
      </details>
    </section>
  `;
}

function renderLoans() {
  const user = currentUser();
  const visibleLoans = isAdmin() ? currentLoanBookRows() : currentLoanBookRows().filter((loan) => loanBelongsToMember(loan, user));
  const loanRequestForm = `
      <details class="card collapsible" open>
        <summary class="card-header"><div><h3>${t("loanRequest")}</h3><p>Submit request for admin approval</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="card-body">
          <form class="form" data-form="loan-request">
            <label class="field"><span>${t("amount")}</span><input name="amount" type="number" min="1" required /></label>
            <label class="field"><span>${t("reason")}</span><textarea name="reason" required></textarea></label>
            <button class="primary" type="submit">${t("submit")}</button>
          </form>
        </div>
      </details>
  `;
  return `
    <section class="page-title"><p>${t("loans")}</p><h2>Current loan book</h2></section>
    <section class="grid">
      ${loanRequestForm}
      <details class="card collapsible">
        <summary class="card-header"><div><h3>Current loan book</h3><p>Only loans entered by admin</p></div><span class="collapse-icon">⌄</span></summary>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Loan taken</th><th>Renewal</th><th>Loan amount</th><th>Interest/month</th><th>Interest paid</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>${visibleLoans.map((loan) => {
              const actions = isAdmin() ? `
                <div class="actions">
                  ${loan.status === "active" ? `<button class="primary" data-action="clear-current-loan" data-id="${loan.id}" type="button">Mark clear</button>` : ""}
                  <button class="danger" data-action="delete-current-loan" data-id="${loan.id}" type="button">Delete</button>
                </div>
              ` : "-";
              return `<tr><td data-label="Member">${escapeHtml(loanMemberName(loan))}</td><td data-label="Loan taken">${escapeHtml(loan.from || "-")}</td><td data-label="Renewal">${escapeHtml(loanRenewalDate(loan) || "-")}</td><td data-label="Loan amount">${money(loan.amount)}</td><td data-label="Interest/month">${money(loan.status === "active" ? loanMonthlyInterest(loan) : 0)}</td><td data-label="Interest paid">${money(loan.interestPaid)}</td><td data-label="Status">${statusBadge(loan.status)}</td><td data-label="Action">${actions}</td></tr>`;
            }).join("") || `<tr><td colspan="8" class="empty">No current loans entered yet.</td></tr>`}</tbody>
          </table>
        </div>
      </details>
    </section>
  `;
}

function renderMembers() {
  const rows = state.members;
  return `
    <section class="page-title"><p>${t("members")}</p><h2>Member directory</h2></section>
    <section class="card">
      <div class="card-body row-list">
        ${rows.map((member) => `
          <div class="row-item">
            <div><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.phone)} · ${escapeHtml(roleLabel(member.role))}</span></div>
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
  const meetings = state.meetings || [];
  const totalExpenditure = meetings.reduce((sum, m) => sum + (m.expenditure || 0), 0);
  return `
    <section class="page-title"><p>${t("meetings")}</p><h2>Annual meetings</h2></section>
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h3>Meeting summary</h3><p>Sri Mukkanneshwara Associate</p></div></div>
        <div class="card-body row-list">
          <div class="row-item"><div><strong>Total meetings held</strong></div><strong>${meetings.length}</strong></div>
          <div class="row-item"><div><strong>Total expenditure</strong><span>Across all meetings</span></div><strong>${money(totalExpenditure)}</strong></div>
          <div class="row-item"><div><strong>Frequency</strong></div><span>Annual · end of year</span></div>
          <div class="row-item"><div><strong>Association duration</strong><span>Extended to 10 years at 5th meeting</span></div><span class="badge info">Year 6 of 10</span></div>
        </div>
      </div>

      ${meetings.map((m) => `
        <details class="card collapsible" ${m.year === 5 ? "open" : ""}>
          <summary class="card-header">
            <div>
              <h3>${escapeHtml(m.label)}</h3>
              <p>${escapeHtml(m.date)} · ${escapeHtml(m.venue)}</p>
            </div>
            <span class="collapse-icon">⌄</span>
          </summary>
          <div class="card-body row-list">
            <div class="row-item"><div><strong>Date</strong></div><span>${escapeHtml(m.date)}</span></div>
            <div class="row-item"><div><strong>Venue</strong></div><span>${escapeHtml(m.venue)}</span></div>
            <div class="row-item"><div><strong>Meeting expenditure</strong></div><strong>${money(m.expenditure)}</strong></div>
            ${m.decisions.length ? `
              <div style="padding:8px 0 4px;"><strong style="font-size:13px;color:#555;">Key decisions</strong></div>
              ${m.decisions.map((d) => `
                <div class="row-item" style="align-items:flex-start;">
                  <div><span style="line-height:1.5;">· ${escapeHtml(d)}</span></div>
                </div>
              `).join("")}
            ` : ""}
          </div>
        </details>
      `).join("")}
    </section>
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

  try {
    if (action.dataset.action === "approve-signup") await approveSignup(action.dataset.id);
    if (action.dataset.action === "reject-signup") await rejectSignup(action.dataset.id);
    if (action.dataset.action === "approve-loan") await approveLoan(action.dataset.id);
    if (action.dataset.action === "reject-loan") await rejectLoan(action.dataset.id);
    if (action.dataset.action === "revoke-member") await revokeMemberAccess(action.dataset.id);
    if (action.dataset.action === "clear-current-loan") await clearCurrentLoan(action.dataset.id);
    if (action.dataset.action === "delete-current-loan") await deleteCurrentLoan(action.dataset.id);
  } catch (error) {
    showToast(error.message || "Something went wrong.");
  }
});

document.addEventListener("input", (event) => {
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
          state.activeTab = "dashboard";
          await addLiveAudit(`${claimedMember.name} logged in.`, "login");
          await loadLiveState();
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
    state.activeTab = "dashboard";
    await addLiveAudit(`${member.name} logged in.`, "login");
    await loadLiveState();
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
    const phone = requireValidPhone(data.phone);
    const email = await resolveAuthEmail(phone);
    await liveQuery(supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    }));
    showToast("Password reset email sent. Check your inbox.");
    renderAuth("login");
    return;
  }

  state.audit.push({ id: uid("a"), date: today(), text: `Password reset requested for ${data.phone}.` });
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
  if (liveBackendReady) {
    await liveQuery(supabaseClient.from("loan_requests").update({
      status: "approved",
      decided_at: new Date().toISOString(),
      decided_by: currentProfileId(),
    }).eq("id", id));
    await liveQuery(supabaseClient.from("loans").insert({
      profile_id: request.memberId,
      request_id: request.id,
      principal: request.amount,
      principal_paid: 0,
      interest_rate_monthly: state.settings.loanInterestRateMonthly,
      status: "active",
      purpose: request.reason,
      disbursed_at: today(),
    }));
    await addLiveAudit(`Approved loan ${money(request.amount)} for ${memberById(request.memberId)?.name}.`, "loan_approved");
    await loadLiveState();
    showToast("Loan approved.");
    render();
    return;
  }

  request.status = "approved";
  state.loans.push({ id: uid("l"), memberId: request.memberId, amount: request.amount, principalPaid: 0, from: today(), status: "active", purpose: request.reason });
  state.audit.push({ id: uid("a"), date: today(), text: `Approved loan ${money(request.amount)} for ${memberById(request.memberId)?.name}.` });
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

async function initApp() {
  if (liveBackendReady) {
    // If the URL fragment signals a password-reset redirect, show the set-password form.
    // The Supabase client processes the token asynchronously; we listen for it.
    if (window.location.hash.includes("type=recovery")) {
      document.querySelector("#app").innerHTML = `<div style="padding:48px;text-align:center;color:#888;">Loading…</div>`;
      supabaseClient.auth.onAuthStateChange((event) => {
        if (event === "PASSWORD_RECOVERY") renderSetNewPassword();
      });
      return;
    }
    try {
      await loadLiveState();
    } catch (error) {
      showToast(error.message || "Could not load live data.");
    }
  }
  render();
}

initApp();
