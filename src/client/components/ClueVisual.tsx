import React from 'react';
import type { VisualClueType } from '../../shared/types';

type ClueVisualProps = {
  type: VisualClueType;
  className?: string;
};

export const ClueVisual: React.FC<ClueVisualProps> = ({ type, className = 'w-24 h-24' }) => {
  switch (type) {
    case 'clock':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="#D5A45B" strokeWidth="4" fill="#1A1C20" />
          <circle cx="50" cy="50" r="38" stroke="#33363D" strokeWidth="1" strokeDasharray="3 3" />
          {/* Hour markers */}
          <line x1="50" y1="12" x2="50" y2="18" stroke="#D5A45B" strokeWidth="3" />
          <line x1="88" y1="50" x2="82" y2="50" stroke="#D5A45B" strokeWidth="3" />
          <line x1="50" y1="88" x2="50" y2="82" stroke="#D5A45B" strokeWidth="3" />
          <line x1="12" y1="50" x2="18" y2="50" stroke="#D5A45B" strokeWidth="3" />
          {/* Hands frozen at 11:14 */}
          <line x1="50" y1="50" x2="35" y2="24" stroke="#F2EFE8" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="50" y1="50" x2="72" y2="40" stroke="#D5A45B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="4" fill="#D5A45B" />
          {/* Cut wire */}
          <path d="M72 70 C 76 75, 78 82, 85 85" stroke="#A94E4E" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      );

    case 'ticket':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="25" width="70" height="50" rx="3" fill="#25272B" stroke="#D5A45B" strokeWidth="2" />
          <line x1="38" y1="25" x2="38" y2="75" stroke="#33363D" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="45" y1="36" x2="75" y2="36" stroke="#F2EFE8" strokeWidth="2" />
          <line x1="45" y1="46" x2="70" y2="46" stroke="#9C9B98" strokeWidth="1.5" />
          <line x1="45" y1="56" x2="65" y2="56" stroke="#9C9B98" strokeWidth="1.5" />
          {/* Red stamp */}
          <rect x="44" y="60" width="32" height="10" rx="2" stroke="#A94E4E" strokeWidth="1" fill="#A94E4E22" />
          <text x="60" y="67" fill="#A94E4E" fontSize="5" fontWeight="bold" textAnchor="middle">CARGO #402</text>
          {/* Hole punch */}
          <circle cx="15" cy="50" r="4" fill="#101114" />
          <circle cx="85" cy="50" r="4" fill="#101114" />
        </svg>
      );

    case 'footprints':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large Bootprint (Size 10) */}
          <g transform="translate(20, 15) rotate(10)">
            <ellipse cx="14" cy="20" rx="8" ry="14" fill="#33363D" stroke="#D5A45B" strokeWidth="1" />
            <ellipse cx="14" cy="40" rx="6" ry="7" fill="#33363D" stroke="#D5A45B" strokeWidth="1" />
            <line x1="9" y1="16" x2="19" y2="16" stroke="#1A1C20" strokeWidth="1.5" />
            <line x1="8" y1="22" x2="20" y2="22" stroke="#1A1C20" strokeWidth="1.5" />
          </g>
          {/* Small Bootprint (Size 8) */}
          <g transform="translate(55, 35) rotate(-15)">
            <ellipse cx="12" cy="16" rx="6" ry="11" fill="#25272B" stroke="#78A88F" strokeWidth="1" />
            <ellipse cx="12" cy="33" rx="4.5" ry="5.5" fill="#25272B" stroke="#78A88F" strokeWidth="1" />
            <line x1="8" y1="14" x2="16" y2="14" stroke="#1A1C20" strokeWidth="1.2" />
          </g>
        </svg>
      );

    case 'cctv':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="18" width="70" height="52" rx="4" fill="#101114" stroke="#33363D" strokeWidth="2" />
          <rect x="19" y="22" width="62" height="44" fill="#1A2E22" />
          {/* Scanlines */}
          <line x1="19" y1="30" x2="81" y2="30" stroke="#78A88F33" strokeWidth="1" />
          <line x1="19" y1="40" x2="81" y2="40" stroke="#78A88F33" strokeWidth="1" />
          <line x1="19" y1="50" x2="81" y2="50" stroke="#78A88F33" strokeWidth="1" />
          {/* Silhouette */}
          <circle cx="50" cy="34" r="5" fill="#78A88F" />
          <path d="M40 54 L44 42 L56 42 L60 54 Z" fill="#78A88F" />
          {/* Rec dot and timecode */}
          <circle cx="26" cy="28" r="2.5" fill="#A94E4E" />
          <text x="32" y="30" fill="#F2EFE8" fontSize="4.5" fontFamily="monospace">REC 11:32:04</text>
          {/* Stand */}
          <path d="M42 70 L40 82 L60 82 L58 70 Z" fill="#25272B" stroke="#33363D" strokeWidth="1.5" />
        </svg>
      );

    case 'logbook':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="15" width="60" height="70" rx="3" fill="#1A1C20" stroke="#D5A45B" strokeWidth="2" />
          <line x1="28" y1="15" x2="28" y2="85" stroke="#D5A45B" strokeWidth="1.5" />
          <line x1="36" y1="28" x2="68" y2="28" stroke="#F2EFE8" strokeWidth="2" />
          <line x1="36" y1="38" x2="72" y2="38" stroke="#9C9B98" strokeWidth="1.5" />
          <line x1="36" y1="48" x2="65" y2="48" stroke="#9C9B98" strokeWidth="1.5" />
          <line x1="36" y1="58" x2="70" y2="58" stroke="#9C9B98" strokeWidth="1.5" />
          {/* Rejected stamp */}
          <rect x="34" y="66" width="38" height="12" rx="2" stroke="#A94E4E" strokeWidth="1.5" fill="#A94E4E22" />
          <text x="53" y="74" fill="#A94E4E" fontSize="6" fontWeight="bold" textAnchor="middle">DENIED</text>
        </svg>
      );

    case 'suitcase':
    case 'briefcase':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Handle */}
          <path d="M38 28 C 38 20, 62 20, 62 28" stroke="#D5A45B" strokeWidth="3" fill="none" />
          {/* Bag Body */}
          <rect x="18" y="28" width="64" height="48" rx="5" fill="#25272B" stroke="#D5A45B" strokeWidth="2" />
          {/* Straps */}
          <line x1="32" y1="28" x2="32" y2="76" stroke="#33363D" strokeWidth="3" />
          <line x1="68" y1="28" x2="68" y2="76" stroke="#33363D" strokeWidth="3" />
          <line x1="18" y1="52" x2="82" y2="52" stroke="#33363D" strokeWidth="1.5" />
          {/* Latches */}
          <rect x="30" y="48" width="4" height="8" rx="1" fill="#D5A45B" />
          <rect x="66" y="48" width="4" height="8" rx="1" fill="#D5A45B" />
          {/* Peeking paper */}
          <polygon points="44,28 56,28 54,20 42,20" fill="#F2EFE8" stroke="#9C9B98" strokeWidth="1" />
        </svg>
      );

    case 'watch':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Crown and loop */}
          <circle cx="50" cy="14" r="7" stroke="#D5A45B" strokeWidth="2" fill="none" />
          <rect x="47" y="19" width="6" height="5" fill="#D5A45B" />
          {/* Watch Case */}
          <circle cx="50" cy="54" r="36" fill="#1A1C20" stroke="#D5A45B" strokeWidth="3" />
          <circle cx="50" cy="54" r="30" fill="#25272B" stroke="#33363D" strokeWidth="1" />
          {/* Hands at 10:30 */}
          <line x1="50" y1="54" x2="33" y2="40" stroke="#F2EFE8" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="54" x2="50" y2="74" stroke="#D5A45B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="54" r="3" fill="#D5A45B" />
          {/* Smashed crack lines */}
          <path d="M30 30 L45 48 L65 38 M45 48 L58 64" stroke="#F2EFE888" strokeWidth="1.5" />
        </svg>
      );

    case 'poison':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Bottle neck */}
          <rect x="42" y="16" width="16" height="12" fill="#25272B" stroke="#A94E4E" strokeWidth="2" />
          {/* Stopper */}
          <ellipse cx="50" cy="16" rx="10" ry="4" fill="#A94E4E" />
          {/* Bottle body */}
          <path d="M38 28 L24 45 L24 78 C 24 84, 76 84, 76 78 L76 45 L62 28 Z" fill="#1A1C20" stroke="#A94E4E" strokeWidth="2" />
          {/* Toxic Liquid */}
          <path d="M26 56 Q 50 50, 74 56 L74 76 C 74 81, 26 81, 26 76 Z" fill="#A94E4E44" />
          {/* Skull emblem */}
          <circle cx="50" cy="48" r="6" fill="#F2EFE8" />
          <rect x="48" y="53" width="4" height="4" fill="#F2EFE8" />
          <circle cx="48" cy="47" r="1.5" fill="#1A1C20" />
          <circle cx="52" cy="47" r="1.5" fill="#1A1C20" />
        </svg>
      );

    case 'safe':
    case 'painting':
    default:
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="18" width="64" height="64" rx="4" fill="#1A1C20" stroke="#D5A45B" strokeWidth="2" />
          <rect x="26" y="26" width="48" height="48" fill="#25272B" stroke="#33363D" strokeWidth="1" />
          <circle cx="50" cy="50" r="14" stroke="#D5A45B" strokeWidth="2" />
          <line x1="50" y1="36" x2="50" y2="42" stroke="#D5A45B" strokeWidth="2" />
          <line x1="50" y1="58" x2="50" y2="64" stroke="#D5A45B" strokeWidth="2" />
          <line x1="36" y1="50" x2="42" y2="50" stroke="#D5A45B" strokeWidth="2" />
          <line x1="58" y1="50" x2="64" y2="50" stroke="#D5A45B" strokeWidth="2" />
          <circle cx="50" cy="50" r="3" fill="#D5A45B" />
        </svg>
      );
  }
};
