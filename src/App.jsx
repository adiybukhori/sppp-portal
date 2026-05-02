import React, { useState } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbw0M6ZUVwGDFgKWw-JLpB6QTnJlSXNyYcfYWU91YnuPcH1IsHO0qm74uqPyJtgde2hQ/exec";

function money(value) {
return new Intl.NumberFormat("en-MY", {
style: "currency",
currency: "MYR",
minimumFractionDigits: 2,
}).format(Number(value || 0));
}

function App() {
const [ic, setIc] = useState("900101011234");
const [loading, setLoading] = useState(false);
const [student, setStudent] = useState(null);
const [subjects, setSubjects] = useState([]);
const [error, setError] = useState("");

async function login() {
setLoading(true);
setError("");

```
try {
  const res = await fetch(`${API_URL}?action=login&ic=${encodeURIComponent(ic)}`);
  const data = await res.json();

  if (!data.success) {
    setError(data.message || "Student not found.");
    return;
  }

  setStudent(data.student);
  setSubjects(data.subjects || []);
} catch (err) {
  setError("Unable to connect to server.");
} finally {
  setLoading(false);
}
```

}

function logout() {
setStudent(null);
setSubjects([]);
setError("");
}

if (!student) {
return ( <div style={styles.loginPage}> <div style={styles.loginCard}> <div style={styles.logo}>🎓</div> <h1>IUC Student Portal</h1> <p style={styles.muted}>Academic Progress & Fee Status</p>

```
      <label>IC / Passport Number</label>
      <input
        style={styles.input}
        value={ic}
        onChange={(e) => setIc(e.target.value)}
        placeholder="Example: 900101011234"
      />

      <label>Password</label>
      <input style={styles.input} value={ic} readOnly />

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.primaryBtn} onClick={login}>
        {loading ? "Loading..." : "Login"}
      </button>
    </div>
  </div>
);
```

}

const taken = Number(student["Subject Taken"] || 0);
const ongoing = Number(student["Subject Ongoing"] || 0);
const notYet = Number(student["Subject Not Yet"] || 0);
const total = taken + ongoing + notYet || subjects.length || 1;
const completedPercent = Math.round((taken / total) * 100);
const ongoingPercent = Math.round((ongoing / total) * 100);
const progressPercent = Math.round(((taken + ongoing) / total) * 100);

const isBlocked = student["LMS Status"] === "Blocked";
const paymentStatus = student["Payment Status"];

return ( <div style={styles.page}> <header style={styles.header}> <div> <p style={styles.headerSmall}>Innovative University College</p> <h1 style={styles.headerTitle}>Student Progress & Payment Portal</h1> </div> <button style={styles.logoutBtn} onClick={logout}>Logout</button> </header>

```
  <main style={styles.container}>
    <div style={styles.quickGrid}>
      <a style={styles.quickPrimary} href={student["Student Portal Link"] || "#"} target="_blank">🌐 Student Portal</a>
      <a style={styles.quickBtn} href={student["LMS Link"] || "#"} target="_blank">📘 LMS (Moodle)</a>
      <a style={styles.quickBtn} href={student["Schedule Link"] || "#"} target="_blank">📅 Class Schedule</a>
      <a style={styles.quickBtn} href={student["Complaint Form Link"] || "#"} target="_blank">📝 Complaint Form</a>
    </div>

    <div style={styles.topGrid}>
      <section style={styles.cardLarge}>
        <div style={styles.profileTop}>
          <div>
            <h2 style={styles.name}>{student["Student Name"]}</h2>
            <p style={styles.muted}>{student["Student ID"]} · {student["IC/Passport"]}</p>
          </div>
          <span style={styles.programBadge}>{student["Program"]}</span>
        </div>

        <div style={styles.infoGrid}>
          <Info label="Program" value={student["Program"]} />
          <Info label="Intake" value={formatIntake(student["Intake"])} />
          <Info label="Fee Group" value={student["Fee Group"]} />
          <Info label="LMS" value={student["LMS Status"]} danger={isBlocked} />
          <Info label="Category" value={student["Student Category"]} />
        </div>
      </section>

      <section style={styles.card}>
        <h3>💳 Fee Summary</h3>
        <Row label="Total Fee" value={money(student["Total Tuition Fee"])} />
        <Row label="Fee / Module" value={money(student["Fee Per Module"])} />
        <Row label="Should Pay" value={money(student["Should Pay"])} />
        <Row label="Paid Amount" value={money(student["Paid Amount"])} />
        <hr />
        <Row label="Outstanding" value={money(student["Outstanding"])} danger />
        <span style={paymentStatus === "Clear" ? styles.greenBadge : styles.yellowBadge}>
          {paymentStatus}
        </span>
        <p style={styles.disclaimer}>
          * Please ensure all fee figures tally with the official Student Portal (Sky Vialing). In case of discrepancy, the portal record shall prevail.
        </p>
      </section>
    </div>

    {isBlocked && (
      <section style={styles.notice}>
        <b>⚠️ LMS Access Notice</b>
        <p>Your LMS access is currently blocked. Please settle the outstanding amount or contact the Registry/Bursar Office for assistance.</p>
      </section>
    )}

    <div style={styles.mainGrid}>
      <section style={styles.cardLarge}>
        <h3>📚 Academic Progress</h3>

        <div style={styles.progressBox}>
          <div style={styles.progressTop}>
            <div>
              <p style={styles.muted}>Overall Academic Progress</p>
              <h2>{progressPercent}%</h2>
            </div>
            <div style={{ textAlign: "right" }}>
              <p>{taken} completed</p>
              <p>{ongoing} ongoing</p>
              <p>{notYet} not yet</p>
            </div>
          </div>

          <div style={styles.progressBar}>
            <div style={{ ...styles.completedBar, width: `${completedPercent}%` }} />
            <div style={{ ...styles.ongoingBar, width: `${ongoingPercent}%` }} />
          </div>

          <div style={styles.statusGrid}>
            <MiniStat value={taken} label="Completed" color="#047857" />
            <MiniStat value={ongoing} label="Ongoing" color="#1d4ed8" />
            <MiniStat value={notYet} label="Not Yet" color="#475569" />
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.subjectCode}>
                <td>
                  <b>{s.subjectCode}</b>
                  <br />
                  <span style={styles.muted}>{s.subjectName}</span>
                </td>
                <td><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <p style={styles.disclaimer}>
          * Result, marks, GPA/CGPA and detailed academic records are available in the Student Portal (Sky Vialing).
        </p>
      </section>

      <aside style={styles.side}>
        <section style={styles.card}>
          <h3>Current Module Billing</h3>
          <Row label="Taken" value={`${taken} module`} />
          <Row label="Ongoing" value={`${ongoing} module`} />
          <Row label="Chargeable" value={`${student["Chargeable Module"] || 0} module`} strong />
        </section>

        <section style={styles.card}>
          <h3>🧾 Other Fees</h3>
          <Row label="Registration Fee" value="RM 300.00" />
          <Row label="Convocation Fee" value="RM 700.00" />
          <p style={styles.disclaimer}>* These are one-time / separate charges and may not be included in module-based payment.</p>
        </section>

        <section style={styles.card}>
          <a style={styles.payBtn} href={student["Payment Link"] || "#"} target="_blank">Pay Outstanding Now</a>
          <a style={styles.contactBtn} href={student["WhatsApp PIC Link"] || "#"} target="_blank">💬 Contact Admin</a>
          <p style={styles.disclaimer}>Payment link can be connected to FPX/payment gateway later.</p>
        </section>
      </aside>
    </div>
  </main>
</div>
```

);
}

function formatIntake(value) {
if (!value) return "";
if (String(value).includes("T")) {
return new Date(value).toLocaleDateString("en-MY", { month: "short", year: "numeric" });
}
return value;
}

function Info({ label, value, danger }) {
return ( <div style={styles.info}> <p style={styles.infoLabel}>{label}</p>
<b style={danger ? styles.redText : null}>{value}</b> </div>
);
}

function Row({ label, value, strong, danger }) {
return ( <div style={styles.row}> <span>{label}</span>
<b style={danger ? styles.redText : strong ? styles.bold : null}>{value}</b> </div>
);
}

function MiniStat({ value, label, color }) {
return ( <div style={styles.miniStat}>
<b style={{ color }}>{value}</b> <p>{label}</p> </div>
);
}

function StatusBadge({ status }) {
let style = styles.grayBadge;
if (status === "Taken") style = styles.greenBadge;
if (status === "Ongoing") style = styles.blueBadge;
return <span style={style}>{status}</span>;
}

const styles = {
page: { minHeight: "100vh", background: "#eef3f8", color: "#0f172a", fontFamily: "Inter, Arial, sans-serif" },
header: { background: "linear-gradient(90deg,#07142f,#162b69)", color: "white", padding: "26px 7%", display: "flex", justifyContent: "space-between", alignItems: "center" },
headerSmall: { margin: 0, color: "#c7d2fe", fontSize: 13 },
headerTitle: { margin: "6px 0 0", fontSize: 28 },
container: { maxWidth: 1180, margin: "0 auto", padding: 28 },
loginPage: { minHeight: "100vh", background: "linear-gradient(135deg,#020617,#172554)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, Arial, sans-serif" },
loginCard: { background: "white", width: 420, padding: 32, borderRadius: 26, boxShadow: "0 20px 50px rgba(0,0,0,.25)" },
logo: { width: 54, height: 54, borderRadius: 18, background: "#172554", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 },
input: { width: "100%", padding: 13, border: "1px solid #d7dfeb", borderRadius: 14, margin: "8px 0 16px" },
primaryBtn: { width: "100%", padding: 13, border: 0, borderRadius: 14, background: "#172554", color: "white", fontWeight: 700, cursor: "pointer" },
logoutBtn: { padding: "10px 18px", border: 0, borderRadius: 18, background: "white", fontWeight: 700, cursor: "pointer" },
quickGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 },
quickPrimary: { textAlign: "center", padding: 14, borderRadius: 16, background: "#0f172a", color: "white", textDecoration: "none", fontWeight: 700 },
quickBtn: { textAlign: "center", padding: 14, borderRadius: 16, background: "white", color: "#0f172a", textDecoration: "none", fontWeight: 700, border: "1px solid #dbe3ef" },
topGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, marginBottom: 24 },
mainGrid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 },
card: { background: "white", borderRadius: 24, padding: 24, boxShadow: "0 2px 12px rgba(15,23,42,.08)", marginBottom: 24 },
cardLarge: { background: "white", borderRadius: 24, padding: 24, boxShadow: "0 2px 12px rgba(15,23,42,.08)" },
profileTop: { display: "flex", justifyContent: "space-between", gap: 20 },
name: { margin: 0, fontSize: 28 },
muted: { color: "#64748b", margin: "4px 0" },
programBadge: { background: "#dbeafe", color: "#1d4ed8", padding: "8px 18px", borderRadius: 999, fontWeight: 700 },
infoGrid: { marginTop: 24, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
info: { background: "#f8fafc", padding: 18, borderRadius: 18 },
infoLabel: { margin: "0 0 8px", color: "#64748b", fontSize: 13 },
row: { display: "flex", justifyContent: "space-between", margin: "12px 0", gap: 20 },
redText: { color: "#dc2626" },
bold: { fontWeight: 800 },
yellowBadge: { display: "inline-block", background: "#fef3c7", color: "#b45309", borderRadius: 999, padding: "7px 13px", fontSize: 12, fontWeight: 700, marginTop: 10 },
greenBadge: { display: "inline-block", background: "#dcfce7", color: "#047857", borderRadius: 999, padding: "7px 13px", fontSize: 12, fontWeight: 700 },
blueBadge: { display: "inline-block", background: "#dbeafe", color: "#1d4ed8", borderRadius: 999, padding: "7px 13px", fontSize: 12, fontWeight: 700 },
grayBadge: { display: "inline-block", background: "#f1f5f9", color: "#475569", borderRadius: 999, padding: "7px 13px", fontSize: 12, fontWeight: 700 },
disclaimer: { fontSize: 12, color: "#64748b", lineHeight: 1.5, borderTop: "1px solid #e2e8f0", paddingTop: 12 },
notice: { background: "#fffbeb", color: "#92400e", border: "1px solid #facc15", padding: 20, borderRadius: 24, marginBottom: 24 },
progressBox: { background: "#f8fafc", border: "1px solid #dbe3ef", borderRadius: 22, padding: 20, marginBottom: 24 },
progressTop: { display: "flex", justifyContent: "space-between" },
progressBar: { height: 15, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", display: "flex" },
completedBar: { background: "#10b981", height: "100%" },
ongoingBar: { background: "#3b82f6", height: "100%" },
statusGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 16 },
miniStat: { background: "white", border: "1px solid #dbe3ef", borderRadius: 16, padding: 14, textAlign: "center" },
table: { width: "100%", borderCollapse: "collapse" },
side: {},
payBtn: { display: "block", textAlign: "center", background: "#172554", color: "white", textDecoration: "none", padding: 14, borderRadius: 18, fontWeight: 800, marginBottom: 12 },
contactBtn: { display: "block", textAlign: "center", background: "white", color: "#0f172a", textDecoration: "none", padding: 13, borderRadius: 18, fontWeight: 700, border: "1px solid #dbe3ef" },
error: { color: "#dc2626", fontWeight: 700 },
};

export default App;
