import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

interface PaymentSimulatorProps {
  method: 'bKash' | 'Nagad' | null;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function PaymentSimulator({ method, amount, onSuccess, onClose }: PaymentSimulatorProps) {
  const [step, setStep] = useState<'number' | 'otp' | 'pin' | 'processing' | 'success'>('number');
  const [walletNo, setWalletNo] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');

  if (!method) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'number') {
      if (!walletNo.startsWith('01') || walletNo.length !== 11) {
        setError('Please enter a valid 11-digit mobile number (e.g., 017xxxxxxxx)');
        return;
      }
      setStep('otp');
    } else if (step === 'otp') {
      if (otpCode.length !== 6 || isNaN(Number(otpCode))) {
        setError('Please enter the correct 6-digit OTP code (e.g., 123456)');
        return;
      }
      setStep('pin');
    } else if (step === 'pin') {
      if (pinCode.length < 4 || pinCode.length > 5 || isNaN(Number(pinCode))) {
        setError('Please enter your 4 or 5-digit wallet PIN');
        return;
      }
      setStep('processing');
      setTimeout(() => {
        setStep('success');
      }, 1800);
    }
  };

  const isBkash = method === 'bKash';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 p-3 rounded-[40px] overflow-hidden">
      <div 
        className={`w-full max-w-[280px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between h-[420px] text-white ${
          isBkash ? 'bg-[#C11B4F]' : 'bg-[#E33B26]'
        }`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-3 border-b border-white/20 bg-black/10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-tight">
              {isBkash ? 'bKash Payment' : 'Nagad Payment'}
            </span>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-white hover:bg-white/15 p-1 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          {step === 'number' && (
            <form onSubmit={handleNextStep} className="space-y-4 flex flex-col items-center">
              <div className="bg-white/10 p-2 rounded-xl mb-1">
                <img 
                  src={isBkash 
                    ? "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=120" 
                    : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=120"
                  } 
                  className="h-10 w-10 object-contain rounded-lg bg-white p-1" 
                  alt="logo"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-center text-sm font-semibold">
                {isBkash ? 'Enter bKash Account Number' : 'Enter Nagad Account Number'}
              </h3>
              <p className="text-center text-[10px] text-white/70">
                Total Payable: <span className="font-bold underline">৳{amount.toLocaleString()}</span>
              </p>

              <div className="w-full">
                <input 
                  type="text"
                  maxLength={11}
                  placeholder="017XXXXXXXX"
                  value={walletNo}
                  onChange={(e) => setWalletNo(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white text-black px-3 py-2 text-center text-sm font-bold tracking-widest rounded-lg border-2 border-white/30 focus:border-white focus:outline-none placeholder:text-gray-400"
                />
                {error && (
                  <p className="text-[10px] text-yellow-300 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10} className="shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-2 bg-black/30 hover:bg-black/50 text-white font-bold text-xs rounded-lg transition-all border border-white/20 active:scale-95"
              >
                Next Step
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleNextStep} className="space-y-4 flex flex-col items-center">
              <h3 className="text-center text-sm font-semibold">
                Verify SIM Card
              </h3>
              <p className="text-center text-[10px] text-white/80">
                Enter the 6-digit OTP (One-Time Password) sent to {walletNo}.
              </p>

              <div className="w-full">
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white text-black px-3 py-2 text-center text-sm font-bold tracking-widest rounded-lg border-2 border-white/30 focus:border-white focus:outline-none placeholder:text-gray-400 font-mono"
                />
                <button 
                  type="button"
                  onClick={() => alert('SIM Simulation: A new OTP code has been sent! Code: 123456')}
                  className="text-[9px] text-white/60 hover:text-white underline mt-1 block text-right w-full"
                >
                  Didn't receive code? Resend
                </button>
                {error && (
                  <p className="text-[10px] text-yellow-300 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full">
                <button 
                  type="button"
                  onClick={() => setStep('number')}
                  className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] rounded transition-all"
                >
                  Go Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-1.5 bg-black/30 hover:bg-black/50 text-white text-[11px] font-bold rounded transition-all border border-white/10"
                >
                  Verify Code
                </button>
              </div>
            </form>
          )}

          {step === 'pin' && (
            <form onSubmit={handleNextStep} className="space-y-4 flex flex-col items-center">
              <h3 className="text-center text-sm font-semibold">
                Enter Secret PIN
              </h3>
              <p className="text-center text-[10px] text-white/80">
                Type your secret wallet PIN. This is completely secure and fully encrypted by the gateway.
              </p>

              <div className="w-full">
                <input 
                  type="password"
                  maxLength={5}
                  placeholder="•••••"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white text-black px-3 py-2 text-center text-sm font-bold tracking-widest rounded-lg border-2 border-white/30 focus:border-white focus:outline-none font-mono"
                />
                {error && (
                  <p className="text-[10px] text-yellow-300 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full">
                <button 
                  type="button"
                  onClick={() => setStep('otp')}
                  className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[11px] rounded transition-all"
                >
                  Go Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-1.5 bg-black/40 hover:bg-black/60 text-white text-[11px] font-bold rounded transition-all border border-white/20"
                >
                  Complete Payment
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center space-y-3 h-full">
              <RefreshCw size={36} className="text-white animate-spin" />
              <h3 className="text-sm font-bold tracking-wide">Secure Gateway Transaction...</h3>
              <p className="text-[10px] text-white/70 text-center">
                Waiting for payment confirmation from server, do not close this window...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-3 h-full text-center">
              <CheckCircle2 size={48} className="text-green-300 animate-bounce" />
              <h3 className="text-base font-bold text-white">Payment Successful!</h3>
              <p className="text-[10px] text-white/90">
                Transaction ID: <span className="font-mono font-bold tracking-wider underline">TXN8491A{Math.floor(Math.random() * 90000 + 10000)}B</span>
              </p>
              <p className="text-[9px] text-white/70">
                A total of ৳{amount.toLocaleString()} has been deducted from your account.
              </p>

              <button 
                type="button"
                onClick={onSuccess}
                className="w-full mt-2 py-1.5 bg-white text-black font-bold text-xs rounded hover:bg-white/90 transition-all font-display"
              >
                Return to Orders
              </button>
            </div>
          )}
        </div>

        {/* Footer info text */}
        <div className="bg-black/30 p-2 text-center text-[8px] text-white/60 tracking-wider">
          © {isBkash ? 'bKash Limited 2026' : 'Nagad Bangladesh Limited 2026'}
        </div>
      </div>
    </div>
  );
}
