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
    { id: "m2", name: "Pratap Banakar", phone: "9000000002", role: "vice_president", status: "active", password: "123456" },
    { id: "m3", name: "Sarpabhushana Banakar", phone: "9000000003", role: "member", status: "active", password: "123456" },
    { id: "m4", name: "Mukkanna Banakar", phone: "9000000004", role: "member", status: "active", password: "123456" },
    { id: "m5", name: "Santosh Banakar", phone: "9000000005", role: "member", status: "active", password: "123456" },
    { id: "m6", name: "Pradeep Banakar", phone: "9000000006", role: "member", status: "active", password: "123456" },
    { id: "m7", name: "Praveen Banakar", phone: "9000000007", role: "member", status: "active", password: "123456" },
    { id: "m8", name: "Appanna Banakar", phone: "9000000008", role: "onboarding", status: "pending", password: "123456" },
  ],
  allMembers: [],
  signupRequests: [],
  deposits: [
    { id: "d2021", year: 2021, label: "First Year (2021-2022)", principal: 111000, interest: 8700, expenditure: 5600, balance: 114100 },
    { id: "d2022", year: 2022, label: "Second Year (2022-2023)", principal: 149000, interest: 33600, expenditure: 13000, balance: 169600 },
    { id: "d2023", year: 2023, label: "Third Year (2023-2024)", principal: 159500, interest: 45700, expenditure: 17750, balance: 187450 },
    { id: "d2024", year: 2024, label: "Fourth Year (2024-2025)", principal: 126000, interest: 57300, expenditure: 33385, balance: 149915 },
    { id: "d2025", year: 2025, label: "Fifth Year (2025)", principal: 149000, interest: 103350, expenditure: 20580, balance: 231770 },
  ],
  monthlyPayments: [
    { id: "p1", memberId: "m1", month: "2026-05", amount: 2000, status: "paid", source: "manual" },
    { id: "p2", memberId: "m2", month: "2026-05", amount: 2000, status: "paid", source: "manual" },
    { id: "p3", memberId: "m3", month: "2026-05", amount: 2000, status: "pending", source: "manual" },
    { id: "p4", memberId: "m4", month: "2026-05", amount: 2000, status: "paid", source: "manual" },
  ],
  loans: [
    { id: "l1", memberId: "m5", amount: 50000, principalPaid: 10000, from: "2026-02-10", status: "active", purpose: "Family need" },
    { id: "l2", memberId: "m6", amount: 70000, principalPaid: 0, from: "2025-10-20", status: "interest_free", purpose: "Special interest-free loan" },
  ],
  loanRequests: [
    { id: "q1", memberId: "m7", amount: 25000, reason: "Medical support", status: "pending", date: "2026-05-14" },
  ],
  loanHistory: [],
  statementRows: [],
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
    amount: Number(loan.principal || 0),
    principalPaid: Number(loan.principal_paid || 0),
    from: loan.disbursed_at,
    renewalOrReturnDate: loan.renewal_or_return_date || "",
    status: loan.status,
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

  const [settingsRows, profiles, deposits, payments, loanRequests, loans, loanHistory, audit] = await Promise.all([
    liveQuery(supabaseClient.from("settings").select("id,value")),
    liveQuery(supabaseClient.from("profiles").select("*").order("created_at", { ascending: true })),
    liveQuery(supabaseClient.from("deposit_summaries").select("*").order("year", { ascending: true })),
    liveQuery(supabaseClient.from("monthly_payments").select("*").order("created_at", { ascending: false })),
    liveQuery(supabaseClient.from("loan_requests").select("*").order("requested_at", { ascending: false })),
    liveQuery(supabaseClient.from("loans").select("*").order("created_at", { ascending: false })),
    liveOptionalList(supabaseClient.from("loan_history").select("*").order("from_date", { ascending: false })),
    liveQuery(supabaseClient.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20)),
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
    statementRows: [],
    audit: audit.reverse().map(liveAuditToLocal),
  };
}

function money(value) {
  const number = Number(value || 0);
  const prefix = number < 0 ? "-₹" : "₹";
  return prefix + Math.abs(number).toLocaleString("en-IN", { maximumFractionDigits: 2 });
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
  if (loan.status === "interest_free") return 0;
  return (loanOutstanding(loan) * state.settings.loanInterestRateMonthly) / 100;
}

function memberLoans(memberId) {
  return state.loans.filter((loan) => loan.memberId === memberId);
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
  const loanPrincipalOutstanding = state.loans.reduce((sum, loan) => sum + loanOutstanding(loan), 0);
  const currentInterestDue = state.loans.reduce((sum, loan) => sum + loanMonthlyInterest(loan), 0);
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

function latestLoanRequest(memberId) {
  return state.loanRequests
    .filter((request) => request.memberId === memberId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))[0];
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
              <span>${escapeHtml(roleLabel(user.role))} · ${t("ownDetailsOnly")}</span>
            </div>
          </div>
          <div class="top-actions">
            <span class="mode-badge ${liveBackendReady ? "live" : "demo"}">${backendLabel()}</span>
            <button class="icon-button" type="button" data-action="toggle-lang">${t("language")}</button>
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
  const modeLabels = { login: t("signIn"), signup: t("signUp"), reset: t("reset") };
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
          ${["login", "signup", "reset"].map((item) => `<button class="${mode === item ? "active" : ""}" type="button" data-auth-mode="${item}">${modeLabels[item]}</button>`).join("")}
        </div>
        ${mode === "login" ? loginForm() : mode === "signup" ? signupForm() : resetForm()}
      </section>
    </div>
  `;
}

function loginForm() {
  return `
    <form class="form" data-form="login">
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" inputmode="tel" required placeholder="9591382942" /></label>
      <label class="field"><span>${t("password")}</span><input name="password" type="password" required placeholder="123456" /></label>
      <button class="primary" type="submit">${t("signIn")}</button>
      <p class="hint">${liveBackendReady ? "Live backend is configured." : "Demo admin: 9591382942 / 123456. Add Supabase details in config.js to connect live data."}</p>
    </form>
  `;
}

function signupForm() {
  return `
    <form class="form" data-form="signup">
      <label class="field"><span>${t("name")}</span><input name="name" type="text" required /></label>
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" required /></label>
      <label class="field"><span>${t("password")}</span><input name="password" type="password" minlength="6" required /></label>
      <button class="primary" type="submit">${t("requestAccess")}</button>
      <p class="hint">Signup requests stay pending until the president approves them.</p>
    </form>
  `;
}

function resetForm() {
  return `
    <form class="form" data-form="reset">
      <label class="field"><span>${t("phone")}</span><input name="phone" type="tel" required /></label>
      <button class="primary" type="submit">${t("forgotPassword")}</button>
      <p class="hint">This screen is ready for backend OTP integration. Demo mode records a reset request for admin follow-up.</p>
    </form>
  `;
}

function renderTab() {
  const tabs = {
    dashboard: renderDashboard,
    deposits: renderDeposits,
    loans: renderLoans,
    members: renderMembers,
    admin: renderAdmin,
  };
  return (tabs[state.activeTab] || renderDashboard)();
}

function renderDashboard() {
  const user = currentUser();
  const stats = groupStats();
  const monthlyDue = isAdmin()
    ? activeMembers().reduce((sum, member) => sum + memberMonthlyDue(member), 0)
    : memberMonthlyDue(user);
  const monthlyPayment = currentMonthPayment(user.id);
  const request = latestLoanRequest(user.id);
  const approvalCount = state.signupRequests.length + state.loanRequests.filter((item) => item.status === "pending").length;
  const dashboardMetrics = [
    metric(t("bankBalance"), money(bankBalance()), `From latest statement · ${escapeHtml(state.settings.bankBalanceUpdatedAt || "-")}`),
    metric(t("availableLoan"), money(availableLoanAmount()), `Bank balance - ${money(state.settings.minimumReserve || 5000)} reserve`),
    metric(t("monthlyDue"), money(monthlyDue), isAdmin() ? "Monthly deposits + loan interest" : `${statusText(monthlyPayment?.status || "pending")} · deposit + interest`),
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

function renderDeposits() {
  const user = currentUser();
  const visiblePayments = isAdmin() ? state.monthlyPayments : state.monthlyPayments.filter((payment) => payment.memberId === user.id);
  return `
    <section class="page-title"><p>${t("deposits")}</p><h2>Monthly collections</h2></section>
    <section class="two-col">
      <div class="card">
        <div class="card-header"><div><h3>Payment status</h3><p>Current month and imported rows</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>Month</th><th>Expected</th><th>Status</th><th>Source</th></tr></thead>
            <tbody>${visiblePayments.map((payment) => {
              const member = memberById(payment.memberId);
              return `<tr><td>${escapeHtml(member?.name || "-")}</td><td>${escapeHtml(payment.month)}</td><td>${money(payment.amount)}</td><td>${statusBadge(payment.status)}</td><td>${escapeHtml(payment.source)}</td></tr>`;
            }).join("") || `<tr><td colspan="5" class="empty">No payments yet.</td></tr>`}</tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>Historical balances</h3><p>First 5 years migrated from old website</p></div></div>
        <div class="card-body row-list">
          ${state.deposits.map((item) => `<div class="row-item"><div><strong>${escapeHtml(item.label)}</strong><span>Principal ${money(item.principal)} · Interest ${money(item.interest)}</span></div><strong>${money(item.balance)}</strong></div>`).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderLoans() {
  const user = currentUser();
  const visibleLoans = isAdmin() ? state.loans : state.loans.filter((loan) => loan.memberId === user.id);
  const visibleHistory = isAdmin() ? state.loanHistory : state.loanHistory.filter((loan) => loan.memberId === user.id);
  return `
    <section class="page-title"><p>${t("loans")}</p><h2>Current loans and history</h2></section>
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h3>Current loan book</h3><p>Separate rows; dashboard totals by member</p></div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Member</th><th>From</th><th>Principal</th><th>Outstanding</th><th>Interest/month</th><th>Return/Renewal</th><th>Status</th></tr></thead>
            <tbody>${visibleLoans.map((loan) => `<tr><td>${escapeHtml(memberById(loan.memberId)?.name || "-")}</td><td>${escapeHtml(loan.from || "-")}</td><td>${money(loan.amount)}</td><td>${money(loanOutstanding(loan))}</td><td>${money(loanMonthlyInterest(loan))}</td><td>${escapeHtml(loan.renewalOrReturnDate || "-")}</td><td>${statusBadge(loan.status)}</td></tr>`).join("") || `<tr><td colspan="7" class="empty">No active loans.</td></tr>`}</tbody>
          </table>
        </div>
      </div>

      <section class="two-col">
        <div class="card">
          <div class="card-header"><div><h3>${t("loanRequest")}</h3><p>Admin approval required</p></div></div>
          <div class="card-body">
            <form class="form" data-form="loan-request">
              <label class="field"><span>${t("amount")}</span><input name="amount" type="number" min="1" required /></label>
              <label class="field"><span>${t("reason")}</span><textarea name="reason" required></textarea></label>
              <button class="primary" type="submit">${t("submit")}</button>
            </form>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div><h3>Loan history</h3><p>Closed and clear records</p></div></div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Year</th><th>Member</th><th>From</th><th>Amount</th><th>Interest</th><th>Return/Renewal</th><th>Status</th><th>Total paid</th></tr></thead>
              <tbody>${visibleHistory.map((loan) => `<tr><td>${escapeHtml(loan.year || "-")}</td><td>${escapeHtml(loan.memberName || memberById(loan.memberId)?.name || "-")}</td><td>${escapeHtml(loan.from || "-")}</td><td>${money(loan.amount)}</td><td>${loan.isInterestFree ? "Interest Free" : money(loan.interest)}</td><td>${escapeHtml(loan.renewalOrReturn || "-")}</td><td>${statusBadge(loan.status)}</td><td>${loan.totalPaid ? money(loan.totalPaid) : "-"}</td></tr>`).join("") || `<tr><td colspan="8" class="empty">No loan history.</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </section>
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
              ${isAdmin() && member.id !== currentProfileId() ? `<button class="danger" data-action="delete-member" data-id="${member.id}" type="button">Delete</button>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
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
  return `
    <section class="page-title"><p>${t("admin")}</p><h2>Operations</h2></section>
    <section class="grid">
      <div class="card">
        <div class="card-header"><div><h3>Signup approvals</h3><p>Member signup requests</p></div></div>
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
      </div>

      <div class="card">
        <div class="card-header"><div><h3>Loan approvals</h3><p>Approve and disburse manually from ICICI</p></div></div>
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
      </div>

      <div class="card">
        <div class="card-header"><div><h3>${t("statementImport")}</h3><p>CSV upload parser for ICICI statement sample</p></div></div>
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
      </div>
    </section>
  `;
}

function statusBadge(status) {
  const normalized = String(status || "").toLowerCase();
  const type = normalized.includes("paid") || normalized.includes("active") || normalized.includes("approved") ? "good" :
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
    if (action.dataset.action === "delete-member") await deleteMember(action.dataset.id);
  } catch (error) {
    showToast(error.message || "Something went wrong.");
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const type = form.dataset.form;
  try {
    if (type === "login") await login(data);
    if (type === "signup") await signup(data);
    if (type === "reset") await resetPassword(data);
    if (type === "loan-request") await requestLoan(data);
    if (type === "statement-text") await importStatement(data);
  } catch (error) {
    showToast(error.message || "Something went wrong.");
  }
});

async function login(data) {
  const phone = requireValidPhone(data.phone);
  if (liveBackendReady) {
    await liveQuery(supabaseClient.auth.signInWithPassword({
      email: phoneEmail(phone),
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
    await liveQuery(supabaseClient.auth.signUp({
      email: phoneEmail(phone),
      password: data.password,
    }));
    await liveQuery(supabaseClient.rpc("register_profile", {
      p_full_name: name,
      p_phone: phone,
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
    showToast("Reset request recorded. Admin can reset the password in Supabase.");
    return;
  }

  state.audit.push({ id: uid("a"), date: today(), text: `Password reset requested for ${data.phone}.` });
  saveState();
  showToast("Reset request recorded. Backend OTP will be connected later.");
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

async function deleteMember(id) {
  const member = memberById(id);
  if (!member || !isAdmin()) return;
  if (member.id === currentProfileId()) {
    showToast("Admin account cannot delete itself.");
    return;
  }
  const confirmed = window.confirm(`Delete ${member.name} from Banakar FinClub?`);
  if (!confirmed) return;

  if (liveBackendReady) {
    const deleteResult = await supabaseClient.from("profiles").delete({ count: "exact" }).eq("id", id);
    if (deleteResult.error || deleteResult.count === 0) {
      await liveQuery(supabaseClient.from("profiles").update({ status: "disabled" }).eq("id", id));
      await addLiveAudit(`Disabled member ${member.name}.`, "member_disabled");
      await loadLiveState();
      showToast("Member removed from app access.");
      render();
      return;
    }
    await addLiveAudit(`Deleted member ${member.name}.`, "member_deleted");
    await loadLiveState();
    showToast("Member deleted.");
    render();
    return;
  }

  state.members = state.members.filter((item) => item.id !== id);
  state.signupRequests = state.signupRequests.filter((item) => item.id !== id);
  state.audit.push({ id: uid("a"), date: today(), text: `Deleted member ${member.name}.` });
  saveState();
  showToast("Member deleted.");
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
    try {
      await loadLiveState();
    } catch (error) {
      showToast(error.message || "Could not load live data.");
    }
  }
  render();
}

initApp();
