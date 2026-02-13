
import React, { useState } from 'react';

interface SEOCardProps {
  platform: string;
  icon: React.ReactNode;
  content: Array<{ label: string; value: string | string[] }>;
}

const SEOCard: React.FC<SEOCardProps> = ({ platform, icon, content }) => {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    setTimeout(() => setCopiedLabel(null), 2000);
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-[#007BFF]/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#007BFF]/20 rounded-lg text-[#007BFF]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{platform}</h3>
      </div>

      <div className="space-y-4">
        {content.map((item, idx) => {
          const textValue = Array.isArray(item.value) ? item.value.join('\n') : item.value;
          
          return (
            <div key={idx} className="group relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{item.label}</span>
                <button
                  onClick={() => handleCopy(textValue, item.label)}
                  className="text-xs bg-[#007BFF]/10 text-[#007BFF] px-2 py-1 rounded hover:bg-[#007BFF] hover:text-white transition-colors"
                >
                  {copiedLabel === item.label ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-black/30 p-3 rounded-lg border border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
                {Array.isArray(item.value) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {item.value.map((v, i) => (
                      <li key={i} className="text-sm text-gray-200">{v}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-200 whitespace-pre-wrap">{item.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SEOCard;
