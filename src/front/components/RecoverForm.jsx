import React, { useState, useRef } from "react";

export const RecoverForm = ({ onSendCode, onVerifyCode, onResetPassword }) => {
  const [recoverStep, setRecoverStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputRefs = useRef([]);

  const handleSend = async () => {
    const success = await onSendCode(email);
    if (success) setRecoverStep(2);
  };

  const handleVerify = async () => {
    const success = await onVerifyCode(email, code);
    if (success) setRecoverStep(3);
  };

  const handleReset = async () => {
    await onResetPassword({ email, codeArray: code, password, confirmPassword });
  };


  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; 

    const newCode = [...code];

    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

 
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedData)) {
      const pastedArray = pastedData.slice(0, 6).split("");
      const newCode = [...code];

      pastedArray.forEach((char, idx) => {
        newCode[idx] = char;
      });

      setCode(newCode);

      const nextFocusIndex = Math.min(pastedArray.length, 5);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className="space-y-6 my-auto">
      {/* Stepper Visual */}
      <div className="mb-6 flex justify-between items-center px-4">
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              recoverStep >= 1
                ? "bg-[#ff6b00] text-white shadow-[0_0_15px_#ff6b00]"
                : "bg-white/5 border border-white/10 text-white/50"
            }`}
          >
            1
          </div>
          <span className="text-[10px] font-mono uppercase tracking-tighter text-[#e2bfb0]">
            Email
          </span>
        </div>
        <div className="h-px flex-grow bg-white/10 mx-2 mt-[-20px]"></div>
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              recoverStep >= 2
                ? "bg-[#ff6b00] text-white shadow-[0_0_15px_#ff6b00]"
                : "bg-white/5 border border-white/10 text-white/50"
            }`}
          >
            2
          </div>
          <span className="text-[10px] font-mono uppercase tracking-tighter text-[#e2bfb0]">
            Código
          </span>
        </div>
        <div className="h-px flex-grow bg-white/10 mx-2 mt-[-20px]"></div>
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              recoverStep === 3
                ? "bg-[#ff6b00] text-white shadow-[0_0_15px_#ff6b00]"
                : "bg-white/5 border border-white/10 text-white/50"
            }`}
          >
            3
          </div>
          <span className="text-[10px] font-mono uppercase tracking-tighter text-[#e2bfb0]">
            Nueva
          </span>
        </div>
      </div>

      {/* Paso 1 */}
      {recoverStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl text-white font-bold">¿Olvidaste tu acceso?</h3>
            <p className="text-sm text-[#e2bfb0]/80">
              Ingresa tu email para resetear tu clave.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#e2bfb0]/60 block uppercase tracking-widest">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="atleta@trainnote.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
            />
          </div>
          <button
            onClick={handleSend}
            className="w-full py-5 bg-[#ff6b00] text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all uppercase tracking-widest cursor-pointer"
          >
            Enviar Código
          </button>
        </div>
      )}

      {/* Paso 2 */}
      {recoverStep === 2 && (
        <div className="space-y-8 text-center">
          <div className="space-y-2">
            <h3 className="text-2xl text-white font-bold">Código de Seguridad</h3>
            <p className="text-sm text-[#e2bfb0]/80">
              Lo enviamos a tu bandeja de entrada.
            </p>
          </div>
          <div className="flex justify-center gap-3">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-2xl font-bold bg-black/40 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] text-[#ff6b00] transition-all"
              />
            ))}
          </div>
          <button
            onClick={handleVerify}
            className="w-full py-5 bg-[#ff6b00] text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all uppercase tracking-widest cursor-pointer"
          >
            Verificar
          </button>
        </div>
      )}

      {/* Paso 3 */}
      {recoverStep === 3 && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl text-white font-bold">Nueva Identidad</h3>
            <p className="text-sm text-[#e2bfb0]/80">
              Establece tu nueva contraseña de acceso.
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Nueva Clave"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
            />
            <input
              type="password"
              placeholder="Confirmar Nueva Clave"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/40 px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-[#ff6b00] transition-all text-white"
            />
          </div>
          <button
            onClick={handleReset}
            className="w-full py-5 bg-[#ff6b00] text-white font-bold rounded-xl hover:shadow-[0_0_25px_rgba(255,107,0,0.4)] transition-all uppercase tracking-widest cursor-pointer"
          >
            Actualizar
          </button>
        </div>
      )}
    </div>
  );
};