export default function Skyline({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 800 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Buildings silhouette */}
        <rect x="20" y="80" width="40" height="120" rx="2" fill="rgba(26,10,46,0.3)" />
        <rect x="25" y="85" width="8" height="8" rx="1" fill="rgba(255,184,0,0.4)" />
        <rect x="37" y="85" width="8" height="8" rx="1" fill="rgba(255,184,0,0.2)" />
        <rect x="25" y="100" width="8" height="8" rx="1" fill="rgba(255,184,0,0.3)" />
        <rect x="37" y="100" width="8" height="8" rx="1" fill="rgba(255,184,0,0.5)" />
        <rect x="25" y="115" width="8" height="8" rx="1" fill="rgba(255,184,0,0.2)" />
        <rect x="37" y="115" width="8" height="8" rx="1" fill="rgba(255,184,0,0.4)" />

        <rect x="70" y="50" width="35" height="150" rx="2" fill="rgba(26,10,46,0.35)" />
        <rect x="75" y="55" width="6" height="6" rx="1" fill="rgba(255,184,0,0.3)" />
        <rect x="85" y="55" width="6" height="6" rx="1" fill="rgba(255,184,0,0.5)" />
        <rect x="75" y="70" width="6" height="6" rx="1" fill="rgba(255,184,0,0.4)" />
        <rect x="85" y="70" width="6" height="6" rx="1" fill="rgba(255,184,0,0.2)" />
        <rect x="75" y="85" width="6" height="6" rx="1" fill="rgba(255,184,0,0.5)" />
        <rect x="75" y="100" width="6" height="6" rx="1" fill="rgba(255,184,0,0.3)" />
        <rect x="85" y="100" width="6" height="6" rx="1" fill="rgba(255,184,0,0.4)" />

        <rect x="115" y="100" width="50" height="100" rx="2" fill="rgba(26,10,46,0.25)" />
        <rect x="120" y="105" width="8" height="8" rx="1" fill="rgba(255,184,0,0.3)" />
        <rect x="135" y="105" width="8" height="8" rx="1" fill="rgba(255,184,0,0.5)" />
        <rect x="150" y="105" width="8" height="8" rx="1" fill="rgba(255,184,0,0.2)" />

        <rect x="175" y="30" width="30" height="170" rx="2" fill="rgba(26,10,46,0.4)" />
        <rect x="180" y="35" width="5" height="5" rx="1" fill="rgba(255,184,0,0.5)" />
        <rect x="190" y="35" width="5" height="5" rx="1" fill="rgba(255,184,0,0.3)" />
        <rect x="180" y="50" width="5" height="5" rx="1" fill="rgba(255,184,0,0.2)" />
        <rect x="190" y="50" width="5" height="5" rx="1" fill="rgba(255,184,0,0.4)" />
        <rect x="180" y="65" width="5" height="5" rx="1" fill="rgba(255,184,0,0.5)" />
        <rect x="190" y="65" width="5" height="5" rx="1" fill="rgba(255,184,0,0.3)" />

        <rect x="220" y="70" width="45" height="130" rx="2" fill="rgba(26,10,46,0.3)" />
        <rect x="275" y="90" width="35" height="110" rx="2" fill="rgba(26,10,46,0.35)" />

        <rect x="320" y="60" width="55" height="140" rx="2" fill="rgba(26,10,46,0.28)" />
        <rect x="325" y="65" width="7" height="7" rx="1" fill="rgba(255,184,0,0.4)" />
        <rect x="340" y="65" width="7" height="7" rx="1" fill="rgba(255,184,0,0.2)" />
        <rect x="355" y="65" width="7" height="7" rx="1" fill="rgba(255,184,0,0.5)" />

        <rect x="385" y="40" width="40" height="160" rx="2" fill="rgba(26,10,46,0.38)" />

        <rect x="435" y="80" width="50" height="120" rx="2" fill="rgba(26,10,46,0.25)" />
        <rect x="495" y="55" width="35" height="145" rx="2" fill="rgba(26,10,46,0.35)" />
        <rect x="540" y="75" width="45" height="125" rx="2" fill="rgba(26,10,46,0.3)" />
        <rect x="595" y="45" width="30" height="155" rx="2" fill="rgba(26,10,46,0.4)" />
        <rect x="635" y="90" width="55" height="110" rx="2" fill="rgba(26,10,46,0.28)" />
        <rect x="700" y="65" width="40" height="135" rx="2" fill="rgba(26,10,46,0.35)" />
        <rect x="750" y="85" width="50" height="115" rx="2" fill="rgba(26,10,46,0.3)" />

        {/* Antenna on tallest building */}
        <line x1="195" y1="30" x2="195" y2="10" stroke="rgba(26,10,46,0.4)" strokeWidth="2" />
        <circle cx="195" cy="8" r="3" fill="rgba(233,30,140,0.6)" />

        <line x1="405" y1="40" x2="405" y2="18" stroke="rgba(26,10,46,0.4)" strokeWidth="2" />
        <circle cx="405" cy="16" r="3" fill="rgba(255,140,0,0.6)" />
      </svg>
    </div>
  );
}
