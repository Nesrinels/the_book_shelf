import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function EmailVerification() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(2);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timer > 0 && isResending) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setIsResending(false);
      setTimer(2);
    }
  }, [timer, isResending]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value !== '' && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResend = () => {
    setIsResending(true);
    // Simulate OTP resend
    console.log('Resending OTP...');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Email Verification</h2>
          <p className="mt-2 text-sm text-gray-600">
            We have sent a code to your email email123@gmail.com
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl border rounded-md focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 outline-none"
              />
            ))}
          </div>
          <Link to='/changepassword'>
          <button
            className="w-full py-3 px-4 text-white bg-emerald-700 rounded-md hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          >
            Verify Account
          </button>
          </Link>
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-gray-600 hover:text-emerald-700"
            >
              {isResending 
                ? `Didn't receive code? Resend OTP in ${timer}s`
                : "Didn't receive code? Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}