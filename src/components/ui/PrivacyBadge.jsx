import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyBadge = () => (
  <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-widest bg-green-50 px-2 py-1 rounded-full">
    <ShieldCheck size={12} />
    Secure & Encrypted
  </div>
);

export default PrivacyBadge;