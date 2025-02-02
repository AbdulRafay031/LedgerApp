import React, { useState, useEffect } from "react";

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const beforeInstallPromptEvent = (event) => {
      event.preventDefault(); // Prevent the default install prompt
      setDeferredPrompt(event); // Store the event to show the prompt later
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptEvent);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptEvent
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log(
          choiceResult.outcome === "accepted"
            ? "User accepted the install prompt"
            : "User dismissed the install prompt"
        );
        setDeferredPrompt(null); // Reset the deferred prompt after user choice
      });
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="bg-white text-black px-4 py-2 rounded hover:bg-red-600"
    >
      Install
    </button>
  );
};

export default InstallButton;
