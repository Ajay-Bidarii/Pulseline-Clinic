import { useEffect, useState } from "react";
import { queueService } from "../services/queueService";
import { APP_NAME } from "../utils/constants";

export default function QueueDisplayPage() {
  const [queue, setQueue] = useState([]);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const load = () => queueService.getQueue().then(setQueue);
    load();
    const dataInterval = setInterval(load, 3000);
    const clockInterval = setInterval(() => setClock(new Date()), 1000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const inConsult = queue.filter((q) => q.status === "in-consult");
  const waiting = queue.filter((q) => q.status === "waiting");

  return (
    <div className="min-h-screen bg-clinic-950 text-white flex flex-col p-8 md:p-12">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="#1B7A69" />
            <path d="M6 34h9l4-14 8 26 6-18 4 6h21" fill="none" stroke="#F1F8F4" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-xl font-semibold">{APP_NAME} &mdash; Waiting Room</span>
        </div>
        <span className="font-display text-2xl tabular-nums text-clinic-200">
          {clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2">
          <h2 className="text-clinic-300 text-sm uppercase tracking-wider mb-4">Now serving</h2>
          {inConsult.length === 0 ? (
            <p className="text-clinic-400">No patients currently being seen.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inConsult.map((entry) => (
                <div key={entry.id} className="bg-clinic-900 border border-clinic-800 rounded-2xl p-6 animate-fadeUp">
                  <p className="text-5xl font-display font-semibold text-white">{entry.token}</p>
                  <p className="text-lg mt-2 text-clinic-100">{entry.patientName}</p>
                  <p className="text-sm text-clinic-300 mt-1">{entry.doctorName} &middot; {entry.department}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-clinic-300 text-sm uppercase tracking-wider mb-4">Waiting ({waiting.length})</h2>
          <div className="space-y-2">
            {waiting.length === 0 ? (
              <p className="text-clinic-400">Queue is empty.</p>
            ) : (
              waiting.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between bg-clinic-900/60 rounded-xl px-4 py-3">
                  <span className="font-display font-semibold text-clinic-100">{entry.token}</span>
                  <span className="text-sm text-clinic-300 truncate ml-3">{entry.doctorName}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-clinic-500 mt-10">
        This screen refreshes automatically. A production deployment would push updates instantly over
        Socket.IO instead of polling.
      </p>
    </div>
  );
}
