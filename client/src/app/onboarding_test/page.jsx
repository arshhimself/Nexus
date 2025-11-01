"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderOne } from "@/components/ui/loader";

export default function ProctoredTestPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null); // 🎥 Added for Recording
  const recordedChunksRef = useRef([]); // 🎥 Added for Recording

  const [showLoader, setShowLoader] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [quizData, setdata] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const warningTimeoutRef = useRef(null);
  const visibilityRef = useRef(true);
  const timerRef = useRef(null);

  const [questions] = useState([
    { id: 1, question: "Explain the difference between Git and GitHub." },
    { id: 2, question: "How can you revert a commit that has already been pushed to a remote repository?"   },
    { id: 3, question: "What is a Git rebase and how is it different from merge?" },
    { id: 4, question: "Fareed’s last minute commit modifies key dependency versions, causing build failures and breaking the project. Rehbar identifies the issue, rolls back the faulty commit, and restores the last stable version. Which Git commands did he likely use to revert the broken commit and fix the build" },
    { id: 5, question: "Ali accidentally pushed his '.env' file with sensitive credentials to GitHub. What git steps should he follow to permanently remove it from the repo’s history (without making the repo private)?" },
    { id: 6, question: "Fareed and Rehbar are working on the backend’ branch. Aafiya accidentally force-pushes an old version of the same branch to origin. Now, all of Fareed’s commits are gone from GitHub, but they still exist on his local machine. What exact git commands should Fareed run to recover his lost commits, make sure the branch history stays clean (no duplicated commits), and push it safely to remote without overwriting Rehbar’s pending PR?" },
    { id: 7, question: "Tanushree pushes her half-written code right before Fareed merges his PR.Merge conflicts explode across 12 files ,Rehbar wants a clean rebase to merge without losing work.Which exact rebase workflow should Rehbar use to merge both PRs while keeping linear commit history?" },

  ]);

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Hide any navbar coming from parent layout on this page
    const navSelectors = 'nav, [role="navigation"], .navbar, .nav';
    const navElements = Array.from(document.querySelectorAll(navSelectors));
    const previousDisplays = navElements.map((el) => ({
      el,
      display: el.style.display,
    }));
    navElements.forEach((el) => {
      el.style.display = "none";
    });

    return () => {
      previousDisplays.forEach(({ el, display }) => {
        el.style.display = display || "";
      });
    };
  }, []);

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });

        streamRef.current = stream;
        setCameraAccess(true);
      } catch (error) {
        console.error("Camera access denied:", error);
        setCameraAccess(false);
      }
    };

    initializeCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isLocked && testStarted) {
      const timer = setTimeout(() => setShowLoader(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [isLocked, testStarted]);

  useEffect(() => {
    if (cameraAccess === true && videoRef.current && streamRef.current) {
      try {
        if (videoRef.current.srcObject !== streamRef.current) {
          videoRef.current.srcObject = streamRef.current;
        }
        const playPromise = videoRef.current.play();
        if (playPromise && playPromise.catch) playPromise.catch(() => {});
      } catch (err) {
        console.warn("Unable to attach stream to video element:", err);
      }
    }
  }, [cameraAccess]);

  useEffect(() => {
    if (!testStarted || isLocked) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setIsLocked(true);
          addToast("⏰ Time's up! Test submitted.", "error");
          stopRecording(); // 🎥 Stop recording on time-up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [testStarted, isLocked]);

  const addToast = (message, type = "warning") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityRef.current = false;
        if (!isLocked) triggerWarning();
      } else visibilityRef.current = true;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isLocked, warnings]);

  const triggerWarning = () => {
    setWarnings((prev) => {
      const newWarnings = prev + 1;
      addToast(
        `Warning ${newWarnings} of 3: Please do not switch tabs or minimize the window.`,
        "warning"
      );

      if (newWarnings >= 3) {
        setIsLocked(true);
        stopRecording(); // 🎥 Stop recording on lock
        addToast("Test locked due to multiple warnings", "error");
      }
      return newWarnings;
    });
  };

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

      if (
        (ctrlKey &&
          (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "u")) ||
        (e.ctrlKey && e.shiftKey && e.key === "i") ||
        e.key === "F12"
      )
        e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const handleCopy = (e) => e.preventDefault();
    const handlePaste = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
    };
  }, []);

  const handleStartTest = async() => {
    if (cameraAccess === true) {
       if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
      setTestStarted(true);
      addToast("Test started. Answer each question and submit to continue.", "success");
      startRecording(); // 🎥 Start recording when test starts
    }
  };
  useEffect(() => {
  if (isLocked && document.fullscreenElement) {
    document.exitFullscreen();
  }
}, [isLocked]);
useEffect(() => {
  const handleFullScreenChange = () => {
    if (!document.fullscreenElement && testStarted && !isLocked) {
      // exited fullscreen → count warning
      triggerWarning();
    }
  };

  document.addEventListener("fullscreenchange", handleFullScreenChange);
  return () => {
    document.removeEventListener("fullscreenchange", handleFullScreenChange);
  };
}, [testStarted, isLocked]);
  const handleSubmitQuestion = async () => {
    const qId = questions[currentQuestionIndex].id;
    const answer = answers[qId];
    if (!answer) {
      addToast("Please answer the question before submitting.", "warning");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      addToast("Answer submitted. Next question loaded.", "success");
    } else {
      const formattedOutput = {
        questions_answers: questions.map((q) => ({
          q: q.question,
          a: answers[q.id] || "",
        })),
      };

      console.log("All submitted answers:");
      console.log(JSON.stringify(formattedOutput, null, 2));

      setIsLocked(true);
      stopRecording(); // 🎥 Stop recording when test finishes
      addToast("All questions submitted successfully!", "success");

      try {
        const analyzeRes = await fetch(`api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedOutput),
        });

        const analyzedData = await analyzeRes.json();
        setdata(analyzedData);

        const token = localStorage.getItem("token");
        const submitRes = await fetch(`/api/quiz/submit/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(analyzedData),
        });

        const submitResponse = await submitRes.json();
        console.log("Quiz Submit Response:", submitResponse);
        addToast("Quiz submitted successfully", "success");
      } catch (error) {
        console.error("Error during quiz submission:", error);
        addToast("Error submitting quiz. Please try again.", "error");
      }
    }
  };

  // 🎥 RECORDING FUNCTIONS
  const startRecording = () => {
    if (!streamRef.current) return;
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm; codecs=vp9",
    });
    
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };

mediaRecorder.ondataavailable = (event) => {
  if (event.data.size > 0) {
    recordedChunksRef.current.push(event.data);
  }
};

mediaRecorder.onstop = async () => {
  const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
  const randomId = Math.random().toString(36).substring(2, 10);
  const file = new File([blob], `proctored_test_${randomId}.webm`, { type: "video/webm" });
  await uploadToServer(file);
};



    mediaRecorder.start();
    console.log("🎥 Recording started...");
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      console.log("🎥 Recording stopped.");
    }
  };

  const uploadToServer = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("🎥 Upload success:", data);
    } catch (err) {
      console.error("🎥 Upload error:", err);
      addToast("Error uploading video recording", "error");
    }
  };
  // 🎥 END RECORDING

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Toast Notifications */}
      <div className="fixed top-6 left-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-xl border rounded-xl px-4 py-3 text-sm font-medium ${
              toast.type === "warning"
                ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-200"
                : toast.type === "error"
                  ? "bg-red-500/20 border-red-500/30 text-red-200"
                  : "bg-green-500/20 border-green-500/30 text-green-200"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {testStarted && (
        <div className="fixed top-6 left-6 z-40">
          <div
            className={`backdrop-blur-xl border rounded-xl px-6 py-3 font-mono text-lg font-bold ${
              timeLeft <= 60
                ? "bg-red-500/20 border-red-500/30 text-red-200"
                : "bg-white/5 border-white/10 text-white"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      )}

      {/* Webcam Preview - Top Right */}
      <div className="fixed top-6 right-6 z-40">
        {cameraAccess === true ? (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-lg backdrop-blur-xl bg-white/5">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        ) : cameraAccess === false ? (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-red-500/50 shadow-lg backdrop-blur-xl bg-red-500/10 flex items-center justify-center">
            <span className="text-xs text-red-400 text-center px-2">
              Camera Denied
            </span>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 shadow-lg backdrop-blur-xl bg-white/5 flex items-center justify-center">
            <span className="text-xs text-white/50">Loading...</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-3xl">
          {!testStarted ? (
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Nexus Onboarding Test
              </h1>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 mb-8">
                <h2 className="text-2xl font-semibold text-white mb-3">
                  Camera Permission Required
                </h2>
                <p className="text-white/60 mb-8 text-lg">
                  {cameraAccess === null
                    ? "Checking camera access..."
                    : cameraAccess === true
                      ? "Camera access granted. Ready to start the test."
                      : "Camera access was denied. Please enable it to continue."}
                </p>
                <button
                  onClick={handleStartTest}
                  disabled={cameraAccess !== true}
                  className={`py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    cameraAccess === true
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {cameraAccess === true
                    ? "Start Test"
                    : "Waiting for Camera..."}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Nexus Onboarding Test
                </h1>
                <p className="text-white/50 text-lg">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>

              {/* Current Question */}
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] transition-colors duration-300 mb-8">
                {/* Question Number and Text */}
                <div className="mb-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {currentQuestionIndex + 1}
                      </span>
                    </div>
                    <p className="text-white text-xl font-medium leading-relaxed">
                      {questions[currentQuestionIndex].question}
                    </p>
                  </div>
                </div>

                {/* Answer Text Box */}
                <textarea
                  value={answers[questions[currentQuestionIndex].id] || ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [questions[currentQuestionIndex].id]: e.target.value,
                    }))
                  }
                  disabled={isLocked}
                  placeholder="Type your answer here..."
                  className="w-full h-72 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all duration-300 resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSubmitQuestion}
                  disabled={isLocked}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isLocked
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl active:scale-95"
                  }`}
                >
                  {isLocked
                    ? "Test Completed"
                    : currentQuestionIndex === questions.length - 1
                      ? "Submit & Finish"
                      : "Submit & Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lock Overlay */}
{isLocked && testStarted && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 animate-in fade-in duration-300">
    {showLoader ? (
<LoaderOne />
    ) : (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-white mb-3">Test Completed</h2>
        <p className="text-white/60">
          All your answers have been submitted successfully. You will receive
          your results in a few seconds. Thank you for participating in our test!
        </p>
        <button
          onClick={() => (window.location.href = "/result")}
          aria-label="View score"
          className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-white text-black hover:bg-black hover:text-white border border-white/10 shadow-sm active:scale-95"
        >
          View your score
        </button>
        <button
          onClick={() => (window.location.href = "/leaderboard")}
          aria-label="View leaderboard"
          className="mt-4 w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-white text-black hover:bg-black hover:text-white border border-white/10 shadow-sm active:scale-95"
        >
          View Leaderboard
        </button>
      </div>
    )}
  </div>
)}

    </div>
  );
}
