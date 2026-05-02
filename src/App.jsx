import React, { useMemo, useState } from "react";
import React from "react";

const students = [
  // studentCategory: IUC / YEG / YPR / Sponsored / etc
  {
    studentId: "MBA25001",
    name: "Ahmad Ali",
    ic: "900101011234",
    program: "Master of Business Administration",
    programShort: "MBA",
    intake: "Jan 2026",
    feeGroup: "MBA_FULL",
    studentCategory: "IUC",
    totalFee: 15000,
    registrationFee: 300,
    convocationFee: 700,
    totalModule: 12,
    paidAmount: 1100,
    moodleStatus: "Blocked",
    paymentLink: "#",
    subjects: [
      { code: "MBA2133", name: "Organisational Behaviour", status: "Taken" },
      { code: "MBA2143", name: "Human Resource Management", status: "Taken" },
      { code: "MBA2153", name: "Business Statistics", status: "Ongoing" },
      { code: "MBA2163", name: "Strategic Management", status: "Not Yet" },
      { code: "MBA2173", name: "Marketing Management", status: "Not Yet" },
      { code: "MBA2183", name: "Business Research Methodology", status: "Not Yet" },
      { code: "MBA2193", name: "Financial Management", status: "Not Yet" },
      { code: "MBA2203", name: "Operations Management", status: "Not Yet" },
      { code: "MBA2213", name: "Entrepreneurship", status: "Not Yet" },
      { code: "MBA2223", name: "Business Ethics", status: "Not Yet" },
      { code: "MBA2233", name: "International Business", status: "Not Yet" },
      { code: "MBA2243", name: "Project Paper", status: "Not Yet" }
    ]
  },
  {
    studentId: "MBA25002",
    name: "Siti Noor",
    ic: "920202025678",
    program: "Master of Business Administration",
    programShort: "MBA",
    intake: "Jan 2026",
    feeGroup: "MBA_FULL",
    studentCategory: "YEG",
    totalFee: 15000,
    registrationFee: 300,
    convocationFee: 700,
    totalModule: 12,
    paidAmount: 3750,
    moodleStatus: "Active",
    paymentLink: "#",
    subjects: [
      { code: "MBA2133", name: "Organisational Behaviour", status: "Taken" },
      { code: "MBA2143", name: "Human Resource Management", status: "Taken" },
      { code: "MBA2153", name: "Business Statistics", status: "Ongoing" },
      { code: "MBA2163", name: "Strategic Management", status: "Not Yet" },
      { code: "MBA2173", name: "Marketing Management", status: "Not Yet" },
      { code: "MBA2183", name: "Business Research Methodology", status: "Not Yet" },
      { code: "MBA2193", name: "Financial Management", status: "Not Yet" },
      { code: "MBA2203", name: "Operations Management", status: "Not Yet" },
      { code: "MBA2213", name: "Entrepreneurship", status: "Not Yet" },
      { code: "MBA2223", name: "Business Ethics", status: "Not Yet" },
      { code: "MBA2233", name: "International Business", status: "Not Yet" },
      { code: "MBA2243", name: "Project Paper", status: "Not Yet" }
    ]
  }
];

function money(n) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2
  }).format(n);
}

function statusBadge(status) {
  const base = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
  if (status === "Taken") return `${base} bg-emerald-100 text-emerald-700`;
  if (status === "Ongoing") return `${base} bg-blue-100 text-blue-700`;
  return `${base} bg-slate-100 text-slate-600`;
}

export default function StudentProgressPaymentPortalPreview() {
  const [ic, setIc] = useState("900101011234");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const student = useMemo(() => students.find((s) => s.ic === ic), [ic]);

  const fee = useMemo(() => {
    // include registration & convocation into total payable logic if needed
    if (!student) return null;
    const feePerModule = student.totalFee / student.totalModule;
    const taken = student.subjects.filter((s) => s.status === "Taken").length;
    const ongoing = student.subjects.filter((s) => s.status === "Ongoing").length;
    const notYet = student.subjects.filter((s) => s.status === "Not Yet").length;
    const chargeableModules = taken + ongoing;
    const shouldPay = chargeableModules * feePerModule;
    const outstanding = Math.max(shouldPay - student.paidAmount, 0);
    const paymentStatus = student.paidAmount <= 0 ? "Unpaid" : student.paidAmount < shouldPay ? "Partially Paid" : "Clear";
    const totalSubjects = student.subjects.length;
    const completedPercent = totalSubjects ? Math.round((taken / totalSubjects) * 100) : 0;
    const ongoingPercent = totalSubjects ? Math.round((ongoing / totalSubjects) * 100) : 0;
    const progressPercent = totalSubjects ? Math.round(((taken + ongoing) / totalSubjects) * 100) : 0;
    return { feePerModule, taken, ongoing, notYet, chargeableModules, shouldPay, outstanding, paymentStatus, totalSubjects, completedPercent, ongoingPercent, progressPercent };
  }, [student]);

  function login() {
    if (!student) {
      setError("IC/Passport not found. Please check and try again.");
      return;
    }
    setLoggedIn(true);
    setError("");
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl border-white/10 bg-white/95">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-950 text-white flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">IUC Student Portal</h1>
                <p className="text-sm text-slate-500">Academic Progress & Fee Status</p>
              </div>
            </div>

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
                🔐 Login
              </Button>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-xs text-slate-600">
              Demo IC: <b>900101011234</b> or <b>920202025678</b>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-slate-950 to-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100">Innovative University College</p>
            <h1 className="text-2xl font-bold">Student Progress & Payment Portal</h1>
          </div>
          <Button variant="secondary" onClick={() => setLoggedIn(false)} className="rounded-2xl">
            Logout
          </Button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Quick Access */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800">🌐 Student Portal</Button>
          <Button variant="outline" className="rounded-2xl">📘 LMS (Moodle)</Button>
          <Button variant="outline" className="rounded-2xl">📅 Class Schedule</Button>
          <Button variant="outline" className="rounded-2xl">📝 Complaint Form</Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="rounded-3xl shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
                  <p className="text-slate-500">{student.studentId} · {student.ic}</p>
                </div>
                <span className="rounded-full bg-blue-100 text-blue-700 px-4 py-1 text-sm font-semibold">{student.programShort}</span>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info label="Program" value={student.programShort} />
                <Info label="Intake" value={student.intake} />
                <Info label="Fee Group" value={student.feeGroup} />
                <Info label="LMS" value={student.moodleStatus} danger={student.moodleStatus === "Blocked"} />
                <Info label="Category" value={student.studentCategory} />
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
                <Row label="Total Fee" value={money(student.totalFee)} />
                                <Row label="Fee / Module" value={money(fee.feePerModule)} />
                <Row label="Should Pay" value={money(fee.shouldPay)} />
                <Row label="Paid Amount" value={money(student.paidAmount)} />
                <div className="border-t pt-3">
                  <Row label="Outstanding" value={money(fee.outstanding)} strong danger={fee.outstanding > 0} />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <Button variant="outline" className="w-full rounded-xl text-xs">🌐 View in Student Portal</Button>
                
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${fee.paymentStatus === "Clear" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{fee.paymentStatus}</span>
              </div>
                            <div className="mt-4 text-xs text-slate-500 border-t pt-3">
                  * Please ensure all fee figures tally with the official Student Portal (Sky Vialing). In case of discrepancy, the portal record shall prevail.
                </div>
              </CardContent>
            </Card>
          
          </div>

        {student.moodleStatus === "Blocked" && (
          <Card className="rounded-3xl border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-5 flex gap-3 items-start">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-amber-900">LMS Access Notice</h3>
                <p className="text-sm text-amber-800">Your LMS access is currently blocked. Please settle the outstanding amount or contact the Registry/Bursar Office for assistance.
                </p>
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

              <div className="mb-6 rounded-3xl bg-slate-50 border p-5">
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
                  <div className="rounded-2xl bg-white p-3 border">
                    <p className="font-bold text-emerald-700">{fee.taken}</p>
                    <p className="text-xs text-slate-500">Completed</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border">
                    <p className="font-bold text-blue-700">{fee.ongoing}</p>
                    <p className="text-xs text-slate-500">Ongoing</p>
                  </div>
                  <div className="rounded-2xl bg-white p-3 border">
                    <p className="font-bold text-slate-600">{fee.notYet}</p>
                    <p className="text-xs text-slate-500">Not Yet</p>
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left p-4">Subject</th>
                      <th className="text-left p-4 w-36">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjects.map((subject) => (
                      <tr key={subject.code} className="border-t">
                        <td className="p-4">
                          <div className="font-semibold text-slate-900">{subject.code}</div>
                          <div className="text-slate-500">{subject.name}</div>
                        </td>
                        <td className="p-4"><span className={statusBadge(subject.status)}>{subject.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-3">* Result, marks, GPA/CGPA and detailed academic records are available in the Student Portal (Sky Vialing).</p>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="rounded-xl text-xs">🌐 Open Portal</Button>
                <Button variant="outline" className="rounded-xl text-xs">📅 View Schedule</Button>
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

            {/* Other Fees */}
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🧾</span>
                  <h3 className="font-bold text-lg">Other Fees</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <Row label="Registration Fee" value={money(student.registrationFee)} />
                  <Row label="Convocation Fee" value={money(student.convocationFee)} />
                </div>
                <div className="mt-4 text-xs text-slate-500 border-t pt-3">
                  * These are one-time / separate charges and may not be included in module-based payment.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-6 space-y-3">
                <Button className="w-full rounded-2xl bg-blue-950 hover:bg-blue-900">Pay Outstanding Now</Button>
                <Button variant="outline" className="w-full rounded-2xl">💬 Contact Admin</Button>
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
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`font-bold mt-1 ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

function Row({ label, value, strong, danger }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className={`${strong ? "font-bold" : "font-medium"} ${danger ? "text-red-600" : "text-slate-900"}`}>{value}</span>
    </div>
  );
}
