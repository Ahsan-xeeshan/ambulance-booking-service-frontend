import { useState } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaCheck,
  FaTimes,
  FaComments,
  FaMinus,
} from "react-icons/fa";

import { apiCall } from "../../services/api";

const AIAmbulanceAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! 👋 I'm your AI ambulance assistant. I can help you check ambulance availability, prepare a booking, or get information about your bookings.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [busyConfirmationId, setBusyConfirmationId] = useState(null);

  const sendMessage = async (e) => {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user",
        content: text,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const data = await apiCall("/api/ai/assistant", {
        method: "POST",
        body: JSON.stringify({
          messages: updatedMessages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "I couldn't generate a response.",
          confirmation: data.confirmation ?? null,
        },
      ]);
    } catch (error) {
      console.error("AI assistant error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, the AI service is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (messageIndex, action) => {
    const confirmation = messages[messageIndex]?.confirmation;

    if (
      !confirmation?.id ||
      confirmation.status !== "pending" ||
      busyConfirmationId !== null
    ) {
      return;
    }

    const confirmationId = confirmation.id;

    setBusyConfirmationId(confirmationId);

    try {
      const endpoint =
        `/api/ai/booking-confirmations/` +
        `${encodeURIComponent(confirmationId)}/${action}`;

      const data = await apiCall(endpoint, {
        method: "POST",
      });

      setMessages((prev) =>
        prev.map((message, index) => {
          if (index !== messageIndex) return message;

          return {
            ...message,
            confirmation: {
              ...message.confirmation,
              status: action === "confirm" ? "confirmed" : "cancelled",
              result: data,
              error: null,
            },
          };
        }),
      );
    } catch (error) {
      console.error("Booking confirmation error:", error);

      setMessages((prev) =>
        prev.map((message, index) => {
          if (index !== messageIndex) return message;

          return {
            ...message,
            confirmation: {
              ...message.confirmation,
              error:
                error?.message ||
                "Unable to process your request. Please try again.",
            },
          };
        }),
      );
    } finally {
      setBusyConfirmationId(null);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          type="button"
          onClick={() => setIsChatOpen(true)}
          aria-label="Open AI ambulance assistant"
          className="fixed bottom-5 right-5 z-1000 flex h-14 w-14
                     items-center justify-center rounded-full
                     bg-primary text-primary-content shadow-xl
                     transition-all duration-200 hover:scale-105
                     hover:shadow-2xl cursor-pointer"
        >
          <FaComments className="text-2xl" />

          {/* Online indicator */}
          <span
            className="absolute right-0 top-0 h-3.5 w-3.5
                           rounded-full border-2 border-base-100
                           bg-success"
          />
        </button>
      )}

      {/* Chat Popup */}
      {isChatOpen && (
        <section
          aria-label="AI Ambulance Assistant chat"
          className="fixed bottom-3 right-3 z-1000
                     flex h-[min(620px,calc(100dvh-1.5rem))]
                     w-[min(400px,calc(100vw-1.5rem))]
                     flex-col overflow-hidden rounded-2xl
                     border border-base-300 bg-base-100
                     shadow-2xl sm:bottom-5 sm:right-5
                     sm:h-[min(620px,calc(100dvh-2.5rem))]
                     sm:w-100"
        >
          {/* Header */}
          <header
            className="flex shrink-0 items-center justify-between
                             bg-primary px-4 py-4 text-primary-content"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center
                              justify-center rounded-full
                              bg-primary-content/15"
              >
                <FaRobot className="text-xl" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold sm:text-base">
                  AI Ambulance Assistant
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs opacity-90">
                  <span className="h-2 w-2 rounded-full bg-success" />
                  Online · Here to help
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              aria-label="Minimize chat"
              className="btn btn-ghost btn-sm btn-circle
                         shrink-0 text-primary-content
                         hover:bg-primary-content/15"
            >
              <FaMinus />
            </button>
          </header>

          {/* Messages */}
          <div
            className="flex min-h-0 flex-1 flex-col gap-4
                       overflow-y-auto overscroll-contain p-4"
            aria-live="polite"
          >
            {messages.map((message, index) => {
              const confirmation = message.confirmation;

              const isBusy = busyConfirmationId === confirmation?.id;

              return (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[92%] space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.role === "user"
                          ? "rounded-br-md bg-primary text-primary-content"
                          : "rounded-bl-md bg-base-200 text-base-content"
                      }`}
                    >
                      <p className="whitespace-pre-wrap wrap-break-word">
                        {message.content}
                      </p>
                    </div>

                    {/* Booking Confirmation Card */}
                    {message.role === "assistant" && confirmation && (
                      <div
                        className="rounded-xl border border-base-300
                                        bg-base-100 p-3 shadow-sm sm:p-4"
                      >
                        <h4 className="mb-3 text-sm font-bold">
                          Booking Details
                        </h4>

                        <div className="space-y-2 text-sm">
                          <p className="wrap-break-word">
                            <span className="font-semibold">Patient:</span>{" "}
                            {confirmation.patient_name}
                          </p>

                          <p className="wrap-break-word">
                            <span className="font-semibold">Phone:</span>{" "}
                            {confirmation.patient_phone}
                          </p>

                          <p className="wrap-break-word">
                            <span className="font-semibold">Pickup:</span>{" "}
                            {confirmation.pickup_address}
                          </p>

                          <p className="wrap-break-word">
                            <span className="font-semibold">Destination:</span>{" "}
                            {confirmation.dropoff_address}
                          </p>

                          {confirmation.expires_at && (
                            <p
                              className="wrap-break-word text-xs
                                            text-base-content/60"
                            >
                              Expires: {confirmation.expires_at}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {confirmation.status === "pending" && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              disabled={busyConfirmationId !== null}
                              onClick={() =>
                                handleConfirmation(index, "confirm")
                              }
                            >
                              {isBusy ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <FaCheck />
                              )}
                              Confirm
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline btn-error btn-sm"
                              disabled={busyConfirmationId !== null}
                              onClick={() =>
                                handleConfirmation(index, "cancel")
                              }
                            >
                              <FaTimes />
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* Confirmed Result */}
                        {confirmation.status === "confirmed" && (
                          <div
                            className="alert alert-success mt-3
                                            items-start text-sm"
                          >
                            <FaCheck />

                            <div className="min-w-0">
                              <p className="font-semibold">
                                Booking confirmed!
                              </p>

                              {confirmation.result?.booking_id && (
                                <p className="mt-1 break-all text-xs">
                                  Booking ID: {confirmation.result.booking_id}
                                </p>
                              )}

                              <p className="mt-1 text-xs">
                                Status:{" "}
                                {confirmation.result?.status || "pending"}
                              </p>
                            </div>
                          </div>
                        )}

                        {confirmation.status === "cancelled" && (
                          <div className="alert mt-3 text-sm">
                            <FaTimes />
                            Confirmation cancelled.
                          </div>
                        )}

                        {confirmation.error && (
                          <p className="mt-3 wrap-break-word text-sm text-error">
                            {confirmation.error}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="flex items-center gap-2 rounded-2xl
                                rounded-bl-md bg-base-200 px-4 py-3"
                >
                  <FaRobot className="text-primary" />
                  <span className="loading loading-dots loading-sm" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && !loading && (
            <div className="flex shrink-0 flex-wrap gap-2 px-4 pb-3">
              {["Check ambulance availability", "I need an ambulance"].map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setInput(suggestion)}
                    className="btn btn-outline btn-primary btn-xs rounded-full"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          )}

          {/* Message Input */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 items-center gap-2
                       border-t border-base-200 bg-base-100 p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              aria-label="Type a message"
              className="input input-bordered input-sm
                         min-w-0 flex-1 rounded-full sm:input-md"
              disabled={loading}
            />

            <button
              type="submit"
              aria-label="Send message"
              className="btn btn-primary btn-circle btn-sm shrink-0
                         sm:btn-md"
              disabled={!input.trim() || loading}
            >
              <FaPaperPlane />
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default AIAmbulanceAssistant;
