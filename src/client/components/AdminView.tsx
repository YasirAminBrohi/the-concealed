import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Send, CheckCircle, Clock } from 'lucide-react';
import { showToast } from '@devvit/web/client';

type AdminCaseSummary = {
  id: string;
  caseNumber: string;
  title: string;
  difficulty: string;
  scheduledDate: string;
  revealDate: string;
  status: string;
  objectsCount: number;
};

export const AdminView: React.FC = () => {
  const [cases, setCases] = useState<AdminCaseSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/cases');
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } catch (err) {
      console.error('Error fetching admin cases:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/cases')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) {
          setCases(data.cases || []);
        }
      })
      .catch((err) => console.error('Error fetching admin cases:', err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handlePublishCase = async (caseId: string) => {
    try {
      setPublishingId(caseId);
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Published ${caseId} successfully! (Post ID: ${data.postId || 'OK'})`);
        void fetchCases();
      } else {
        showToast(`Publish error: ${data.message || 'Failed'}`);
      }
    } catch (err) {
      showToast(`Publish error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-[#1A1C20] border border-[#A94E4E]/50 p-5 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#A94E4E]/20 border border-[#A94E4E]/60 flex items-center justify-center text-[#A94E4E]">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#A94E4E] font-bold">
              Subreddit Moderator Controls
            </span>
            <h1 className="text-xl font-serif font-bold text-[#F2EFE8]">
              THE UNSEEN Case Management
            </h1>
          </div>
        </div>
        <button
          onClick={fetchCases}
          className="bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] text-xs font-mono px-3 py-1.5 rounded border border-[#33363D] cursor-pointer"
        >
          Refresh
        </button>
      </div>

      {/* Case Management Table */}
      <div className="bg-[#1A1C20] border border-[#33363D] rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#33363D] flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9C9B98] font-bold">
            Case Library Status & Publishing Schedules
          </span>
          <span className="text-xs text-[#78A88F] flex items-center gap-1 font-mono">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Devvit Scheduler Active (05:05 AM PKT / 00:05 UTC)</span>
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-[#9C9B98]">Loading cases...</div>
        ) : (
          <div className="divide-y divide-[#33363D]/60">
            {cases.map((c) => (
              <div
                key={c.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#202227] transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D5A45B]">
                      {c.caseNumber}
                    </span>
                    <h2 className="text-base font-serif font-bold text-[#F2EFE8]">
                      {c.title}
                    </h2>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        c.status === 'published'
                          ? 'text-[#78A88F] border-[#78A88F]/40 bg-[#78A88F]/10'
                          : 'text-[#D5A45B] border-[#D5A45B]/40 bg-[#D5A45B]/10'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-[#9C9B98]">
                    <span>Difficulty: <strong className="text-[#F2EFE8]">{c.difficulty}</strong></span>
                    <span>•</span>
                    <span>Scheduled: <strong className="text-[#F2EFE8]">{c.scheduledDate}</strong></span>
                    <span>•</span>
                    <span>Objects: <strong className="text-[#F2EFE8]">{c.objectsCount} items</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handlePublishCase(c.id)}
                    disabled={publishingId === c.id}
                    className="flex-1 sm:flex-none bg-[#D5A45B] hover:bg-[#B88942] disabled:opacity-50 text-[#101114] font-bold text-xs py-2 px-4 rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{publishingId === c.id ? 'Publishing...' : 'Publish Post'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diagnostic & Validation Checklist */}
      <div className="bg-[#101114] border border-[#33363D] p-4 rounded-lg space-y-2 text-xs text-[#9C9B98]">
        <h3 className="font-mono uppercase font-bold text-[#D5A45B] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Case Integrity & Automated Validation</span>
        </h3>
        <p>
          Every mystery in the library is checked for:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Minimum 6 inspectable objects per crime scene with verified coordinates.</li>
          <li>Server-enforced 3-inspection limit with no client-side leaks of uninspected clues.</li>
          <li>Independent evaluation rubric with semantic paraphrase matching.</li>
          <li>Idempotent daily scheduler publishing preventing duplicate Reddit posts.</li>
        </ul>
      </div>
    </div>
  );
};
