
import React from 'react';

interface SummaryViewProps {
  summary: string | null;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">No summary available.</p>
      </div>
    );
  }

  // A simple markdown-like parser for bullet points
  const renderSummary = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={index} className="ml-5 text-slate-700">
            {line.trim().substring(2)}
          </li>
        );
      }
      if(line.trim().length === 0) {
        return <br key={index} />
      }
      return (
        <p key={index} className="text-slate-700 leading-relaxed mb-4">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="prose max-w-none prose-slate">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Summary</h2>
      <div className="space-y-4">{renderSummary(summary)}</div>
    </div>
  );
};
