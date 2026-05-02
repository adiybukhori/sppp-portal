import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = "https://script.google.com/macros/s/AKfycbw0M6ZUVwGDFgKWw-JLpB6QTnJlSXNyYcfYWU91YnuPcH1IsHO0qm74uqPyJtgde2hQ/exec";

function money(n) {
return new Intl.NumberFormat("en-MY", {
style: "currency",
currency: "MYR",
minimumFractionDigits: 2
}).format(Number(n || 0));
}

function formatIntake(value) {
if (!value) return "";
if (String(value).includes("T")) {
return new Date(value).toLocaleDateString("en-MY", {
month: "short",
year: "numeric"
});
}
return value;
}

function statusBadge(status) {
const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
if (status === "Taken") return `${base} bg-emerald-100 text-emerald-700`;
if (status === "Ongoing") return `${base} bg-blue-100 text-blue-700`;
return `${base} bg-slate-100 text-slate-600`;
}

export default function App() {
const [ic, setIc] = useState("900101011234");
const [loggedIn, setLoggedIn] = useState(false);
const [student, setStudent] = useState(null);
const [subjects, setSubjects] = useState([]);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const fee = useMemo(() => {
if (!student) return null;

const taken = Number(student["Subject Taken"] || 0);
const ongoing = Number(student["Subject Ongoing"] || 0);
const notYet = Number(student["Subject Not Yet"] || 0);
const totalSubjects = taken + ongoing + notYet || subjects.length || 1;

return {
  taken,
  ongoing,
  notYet,
  chargeableModules: Number(student["Chargeable Module"] || 0),
  totalFee: Number(student["Total Tuition Fee"] || 0),
  feePerModule: Number(student["Fee Per Module"] || 0),
  shouldPay: Number(student["Should Pay"] || 0),
  paidAmount: Number(student["Paid Amount"] || 0),
  outstanding: Number(student["Outstanding"] || 0),
  paymentStatus: student["Payment Status"] || "Pending",
  completedPercent: Math.round((taken / totalSubjects) * 100),
  ongoingPercent: Math.round((ongoing / totalSubjects) * 100),
  progressPercent: Math.round(((taken + ongoing) / totalSubjects) * 100)
};

}, [student, subjects]);

async function login() {
setLoading(true);
setError("");

try {
  const res = await fetch(API_URL + "?action=login&ic=" + encodeURIComponent(ic));
  const data = await res.json();

  if (!data.success) {
    setError(data.message || "IC/Passport not found. Please check and try again.");
    setLoading(false);
    return;
  }

  setStudent(data.student);
  setSubjects(data.subjects || []);
  setLoggedIn(true);
} catch (err) {
  setError("Unable to connect to server.");
} finally {
  setLoading(false);
}

}

if (!loggedIn || !student || !fee) {
return ( <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6"> <Card className="w-full max-w-md rounded-3xl shadow-2xl border-white/10 bg-white/95"> <CardContent className="p-8"> <div className="flex items-center gap-3 mb-6"> <div className="h-12 w-12 rounded-2xl bg-blue-950 text-white flex items-center justify-center"> <span className="text-2xl">🎓</span> </div> <div> <h1 className="text-xl font-bold text-slate-900">IUC Student Portal</h1> <p className="text-sm text-slate-500">Academic Progress & Fee Status</p> </div> </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">IC / Passport Number</label>
            <Input value={ic} onChange={(e) => setIc(e.target.value)} className="mt-2" placeholder="Example: 900101011234" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input value={ic} readOnly className="mt-2 bg-slate-50" />
            <p className="mt-1 text-xs text-slate-500">For preview: password follows IC/Passport.</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={login} className="w-full rounded-2xl bg-blue-950 hover:bg-blue-900">
            {loading ? "Loading..." : "🔐 Login"}
          </Button>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-xs text-slate-600">
          Demo IC: <b>900101011234</b>
        </div>
      </CardContent>
    </Card>
  </div>
);

}

const isBlocked = student["LMS Status"] === "Blocked";

return ( <div className="min-h-screen bg-slate-100"> <div className="bg-gradient-to-r from-slate-950 to-blue-950 text-white"> <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"> <div> <p className="text-sm text-blue-100">Innovative University College</p> <h1 className="text-2xl font-bold">Student Progress & Payment Portal</h1> </div>
<Button variant="secondary" onClick={() => setLoggedIn(false)} className="rounded-2xl">
Logout </Button> </div> </div>

  <main className="max-w-6xl mx-auto p-6 space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <a href={student["Student Portal Link"] || "#"} target="_blank" className="rounded-full bg-slate-900 hover:bg-slate-800 text-white text-center py-3 px-6 font-semibold shadow-md">🌐 Student Portal</a>
      <a href={student["LMS Link"] || "#"} target="_blank" className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-center py-3 px-6 font-semibold shadow-sm">📘 LMS (Moodle)</a>
      <a href={student["Schedule Link"] || "#"} target="_blank" className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-center py-3 px-6 font-semibold shadow-sm">📅 Class Schedule</a>
      <a href={student["Complaint Form Link"] || "#"} target="_blank" className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-center py-3 px-6 font-semibold shadow-sm">📝 Complaint Form</a>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="rounded-3xl shadow-sm lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{student["Student Name"]}</h2>
              <p className="text-slate-500">{student["Student ID"]} · {student["IC/Passport"]}</p>
            </div>
            <span className="rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">{student["Program"]}</span>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Info label="Program" value={student["Program"]} />
            <Info label="Intake" value={formatIntake(student["Intake"])} />
            <Info label="Fee Group" value={student["Fee Group"]} />
            <Info label="LMS" value={student["LMS Status"]} danger={isBlocked} />
            <Info label="Category" value={student["Student Category"]} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">💳</span>
            <h3 className="font-bold text-lg">Fee Summary</h3>
          </div>
          <div className="space-y-3 text-sm">
            <Row label="Total Fee" value={money(fee.totalFee)} />
            <Row label="Fee / Module" value={money(fee.feePerModule)} />
            <Row label="Should Pay" value={money(fee.shouldPay)} />
            <Row label="Paid Amount" value={money(fee.paidAmount)} />
            <div className="border-t pt-3">
              <Row label="Outstanding" value={money(fee.outstanding)} strong danger={fee.outstanding > 0} />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <a
            href={student["Student Portal Link"] || "#"}
            target="_blank"
            className="block w-full rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-center py-2 px-4 text-xs font-semibold shadow-sm"
          >
            🌐 View in Student Portal
          </a>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${fee.paymentStatus === "Clear" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{fee.paymentStatus}</span>
          </div>

          <div className="mt-4 text-xs text-slate-500 border-t pt-3">
            * Please ensure all fee figures tally with the official Student Portal (Sky Vialing). In case of discrepancy, the portal record shall prevail.
          </div>
        </CardContent>
      </Card>
    </div>

    {isBlocked && (
      <Card className="rounded-3xl border border-amber-300 bg-amber-50 shadow-sm">
        <CardContent className="p-5 flex gap-4 items-center">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-amber-900">LMS Access Notice</h3>
            <p className="text-sm text-amber-800">Your LMS access is currently blocked. Please settle the outstanding amount or contact the Registry/Bursar Office for assistance.</p>
          </div>
        </CardContent>
      </Card>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="rounded-3xl shadow-sm lg:col-span-2">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">📚</span>
            <h3 className="font-bold text-lg">Academic Progress</h3>
          </div>

          <div className="mb-6 rounded-3xl bg-slate-50 border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-slate-500">Overall Academic Progress</p>
                <h4 className="text-2xl font-bold text-slate-900">{fee.progressPercent}%</h4>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>{fee.taken} completed</p>
                <p>{fee.ongoing} ongoing</p>
                <p>{fee.notYet} not yet</p>
              </div>
            </div>

            <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 flex">
              <div className="h-full bg-emerald-500" style={{ width: `${fee.completedPercent}%` }} />
              <div className="h-full bg-blue-500" style={{ width: `${fee.ongoingPercent}%` }} />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
              <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-sm">
                <p className="font-bold text-emerald-700">{fee.taken}</p>
                <p className="text-xs text-slate-500">Completed</p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-sm">
                <p className="font-bold text-blue-700">{fee.ongoing}</p>
                <p className="text-xs text-slate-500">Ongoing</p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-slate-200 shadow-sm">
                <p className="font-bold text-slate-600">{fee.notYet}</p>
                <p className="text-xs text-slate-500">Not Yet</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4">Subject</th>
                  <th className="text-left p-4 w-36">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.subjectCode} className="border-t border-slate-200">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{subject.subjectCode}</div>
                      <div className="text-slate-500">{subject.subjectName}</div>
                    </td>
                    <td className="p-4"><span className={statusBadge(subject.status)}>{subject.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500 mt-3">* Result, marks, GPA/CGPA and detailed academic records are available in the Student Portal (Sky Vialing).</p>
          <div className="mt-3 flex gap-2">
            <a href={student["Student Portal Link"] || "#"} target="_blank" className="rounded-full text-xs border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 shadow-sm">🌐 Open Portal</a>
            <a href={student["Schedule Link"] || "#"} target="_blank" className="rounded-full text-xs border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50 shadow-sm">📅 View Schedule</a>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Current Module Billing</h3>
            <div className="space-y-3 text-sm">
              <Row label="Taken" value={`${fee.taken} module`} />
              <Row label="Ongoing" value={`${fee.ongoing} module`} />
              <Row label="Chargeable" value={`${fee.chargeableModules} module`} strong />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🧾</span>
              <h3 className="font-bold text-lg">Other Fees</h3>
            </div>
            <div className="space-y-3 text-sm">
              <Row label="Registration Fee" value={money(300)} />
              <Row label="Convocation Fee" value={money(700)} />
            </div>
            <div className="mt-4 text-xs text-slate-500 border-t pt-3">
              * These are one-time / separate charges and may not be included in module-based payment.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardContent className="p-6 space-y-3">
            <a href={student["Payment Link"] || "#"} target="_blank" className="block w-full rounded-full bg-blue-950 hover:bg-blue-900 text-white text-center py-3 px-6 font-semibold shadow-md">Pay Outstanding Now</a>
            <a href={student["WhatsApp PIC Link"] || "#"} target="_blank" className="block w-full rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-center py-3 px-6 font-semibold shadow-sm">💬 Contact Admin</a>
            <p className="text-xs text-slate-500">Payment link can be connected to FPX/payment gateway later.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</div>

);
}

function Info({ label, value, danger }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-semibold mt-1 ${danger ? "text-red-600" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Row({ label, value, strong, danger }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className={`${strong ? "font-bold" : "font-medium"} ${danger ? "text-red-600" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}
