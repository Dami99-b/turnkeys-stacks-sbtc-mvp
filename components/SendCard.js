import { useState } from "react";
import { toast } from "react-toastify";

export default function SendCard({ wallet }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipient || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    toast.info("Simulating sBTC transaction...");

    setTimeout(() => {
      toast.success(`Sent ${amount} sBTC to ${recipient}`);
      setRecipient("");
      setAmount("");
      setSending(false);
    }, 2500);
  };

  return (
    <div className="w-full bg-gray-900 bg-opacity-70 rounded-xl p-6 shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-teal-400 text-center">
        Send sBTC
      </h2>
      <form
        onSubmit={handleSend}
        className="flex flex-col gap-4 items-center w-full"
      >
        <input
          type="text"
          placeholder="Recipient Address"
          className="w-full px-4 py-3 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount (sBTC)"
          className="w-full px-4 py-3 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          type="submit"
          disabled={sending}
          className={`px-6 py-3 rounded-xl font-semibold w-full transition-all ${
            sending
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-teal-500 hover:bg-teal-400 text-black"
          }`}
        >
          {sending ? "Sending..." : "Send sBTC"}
        </button>
      </form>
    </div>
  );
}
