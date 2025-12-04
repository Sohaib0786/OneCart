import React, { useContext, useState, useEffect, useRef } from "react";
import ai from "../assets/ai.png";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import open from "../assets/open.mp3";

function Ai() {
  const { showSearch, setShowSearch } = useContext(shopDataContext);
  const navigate = useNavigate();
  const [activeAi, setActiveAi] = useState(false);

  const openingSound = new Audio(open);
  const recognitionRef = useRef(null);

  // === FEMALE VOICE FUNCTION ===
  function speak(message) {
    
    let utterance = new SpeechSynthesisUtterance(message);

    // Wait for voices to load
    const setFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();

      if (voices.length > 0) {
        // Try to find a female voice
        const femaleVoice =
          voices.find((v) =>
            v.name.toLowerCase().includes("female")
          ) ||
          voices.find((v) =>
            v.name.toLowerCase().includes("google") &&
            v.name.toLowerCase().includes("female")
          ) ||
          voices.find((v) =>
            v.name.toLowerCase().includes("google us english")
          ) ||
          voices.find((v) =>
            v.name.toLowerCase().includes("english")
          ) ||
          voices[0];

        utterance.voice = femaleVoice;
      }

      window.speechSynthesis.speak(utterance);
    };

    // If voices not loaded yet
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setFemaleVoice;
    } else {
      setFemaleVoice();
    }
  }

  // === SPEECH RECOGNITION ===
  useEffect(() => {
    const SpeechRecognition = 
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Browser does not support speech recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();

      console.log("VOICE:", transcript);

      if (transcript.includes("search") && transcript.includes("open") && !showSearch) {
        speak("Opening search");
        setShowSearch(true);
        navigate("/collection");
      } 
      else if (transcript.includes("search") && transcript.includes("close") && showSearch) {
        speak("Closing search");
        setShowSearch(false);
      } 
      else if (
        transcript.includes("collection") ||
        transcript.includes("collections") ||
        transcript.includes("product") ||
        transcript.includes("products")
      ) {
        speak("Opening collection page");
        navigate("/collection");
      } 
      else if (transcript.includes("about")) {
        speak("Opening about page");
        navigate("/about");
        setShowSearch(false);
      } 
      else if (transcript.includes("home")) {
        speak("Opening home page");
        navigate("/");
        setShowSearch(false);
      } 
      else if (
        transcript.includes("cart") ||
        transcript.includes("kaat") ||
        transcript.includes("caat")
      ) {
        speak("Opening your cart");
        navigate("/cart");
        setShowSearch(false);
      } 
      else if (transcript.includes("contact")) {
        speak("Opening contact page");
        navigate("/contact");
        setShowSearch(false);
      } 
      else if (
        transcript.includes("order") ||
        transcript.includes("myorder") ||
        transcript.includes("orders")
      ) {
        speak("Opening your orders page");
        navigate("/order");
        setShowSearch(false);
      } 
      else {
        toast.error("Try again");
      }
    };

    recognition.onend = () => {
      setActiveAi(false);
    };

    recognitionRef.current = recognition;
  }, [navigate, showSearch, setShowSearch]);

  function startListening() {
    if (!recognitionRef.current) return;

    recognitionRef.current.start();
    openingSound.play();
    setActiveAi(true);
  }

  return (
    <div
      className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[2%]"
      onClick={startListening}
    >
      <img
        src={ai}
        alt=""
        className={`w-[100px] cursor-pointer ${
          activeAi
            ? "translate-x-[10%] translate-y-[-10%] scale-125"
            : "translate-x-[0] translate-y-[0] scale-100"
        } transition-transform`}
        style={{
          filter: `${
            activeAi
              ? "drop-shadow(0px 0px 30px #00d2fc)"
              : "drop-shadow(0px 0px 20px black)"
          }`,
        }}
      />
    </div>
  );
}

export default Ai;
