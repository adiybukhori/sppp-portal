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
        setError(data.message || "IC/Passport not found.");
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl border-white/10 bg-white/95">
          <CardContent className="p-8">
            <h1 className="text-xl font-bold mb-4">IUC Student Portal</h1>

            <Input value={ic} onChange={(e) => setIc(e.target.value)} />
            {error && <p className="text-red-500 mt-2">{error}</p>}

            <Button onClick={login} className="w-full mt-4">
              {loading ? "Loading..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isBlocked = student["LMS Status"] === "Blocked";

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="max-w-6xl mx-auto p-6 space-y-6">

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">{student["Student Name"]}</h2>
            <p>{student["Student ID"]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Academic Progress</h3>

            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.subjectCode}>
                    <td className="p-2">
                      {subject.subjectCode} - {subject.subjectName}
                    </td>
                    <td className="p-2">
                      <span className={statusBadge(subject.status)}>
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </CardContent>
        </Card>

      </main>
    </div>
  );
}
