// Speech Recognition & Synthesis Service (Bulletproof with mic permissions & audio stream check)

class SpeechService {
  constructor() {
    this.recognition = null;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.isSpeaking = false;
    this.selectedVoice = null;
    this.onResultCallback = null;
    this.onInterimCallback = null;
    this.onStateChangeCallback = null;
    this.onErrorCallback = null;
    this.onVoicesChanged = null;
    this.availableVoices = [];
    this.hasMicPermission = false;
    this.mediaStream = null;

    this.initVoices();
  }

  // Request explicit browser microphone permission via getUserMedia
  async requestMicPermission() {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.hasMicPermission = true;
      return true;
    } catch (err) {
      console.warn('Microphone permission request failed/denied:', err);
      this.hasMicPermission = false;
      if (this.onErrorCallback) {
        this.onErrorCallback('Microphone permission was denied or not detected. Please allow microphone access in your browser address bar.');
      }
      return false;
    }
  }

  initRecognition() {
    if (typeof window === 'undefined') return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition API is not supported in this browser.');
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-IN'; // Indian English recognition
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.emitState('listening');
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript && this.onInterimCallback) {
          this.onInterimCallback(interimTranscript);
        }

        if (finalTranscript && finalTranscript.trim().length > 0) {
          if (this.onResultCallback) {
            this.onResultCallback(finalTranscript.trim());
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (this.onErrorCallback) {
            this.onErrorCallback('Microphone blocked. Please click the icon in your browser address bar and choose "Allow Microphone".');
          }
        } else if (event.error !== 'no-speech') {
          if (this.onErrorCallback) this.onErrorCallback(`Audio recognition: ${event.error}`);
        }
        
        if (event.error === 'not-allowed') {
          this.isListening = false;
          this.emitState('idle');
        }
      };

      this.recognition.onend = () => {
        // If we were supposed to be listening and it closed, restart if desired or set idle
        if (this.isListening) {
          this.isListening = false;
          this.emitState('idle');
        }
      };

      return true;
    } catch (e) {
      console.warn('Error constructing SpeechRecognition:', e);
      return false;
    }
  }

  initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      this.availableVoices = this.synth.getVoices();
      
      const preferred = this.availableVoices.find(v => 
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Siri') || v.name.includes('Victoria')) && 
        v.lang.startsWith('en')
      ) || this.availableVoices.find(v => v.lang.startsWith('en')) || this.availableVoices[0];

      if (preferred && !this.selectedVoice) {
        this.selectedVoice = preferred;
      }

      if (this.onVoicesChanged) {
        this.onVoicesChanged(this.availableVoices, this.selectedVoice);
      }
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  getVoices() {
    if (!this.synth) return [];
    if (this.availableVoices.length === 0) {
      this.availableVoices = this.synth.getVoices();
    }
    return this.availableVoices;
  }

  setVoice(voiceURI) {
    const voice = this.availableVoices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  emitState(state) {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(state);
    }
  }

  async startListening(onResult, onInterim) {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    this.onResultCallback = onResult;
    this.onInterimCallback = onInterim;

    // Explicitly verify microphone hardware access
    if (!this.hasMicPermission) {
      const allowed = await this.requestMicPermission();
      if (!allowed) {
        return;
      }
    }

    if (!this.recognition) {
      this.initRecognition();
    }

    if (this.recognition) {
      try {
        this.recognition.start();
        this.isListening = true;
        this.emitState('listening');
      } catch (err) {
        // If already started, stop and restart
        if (err.name === 'InvalidStateError') {
          try {
            this.recognition.stop();
            setTimeout(() => {
              try {
                this.recognition.start();
                this.isListening = true;
                this.emitState('listening');
              } catch (e) {
                console.warn('Recognition restart failed:', e);
              }
            }, 100);
          } catch (e) {
            console.warn('Could not reset recognition:', e);
          }
        } else {
          console.warn('Could not start recognition:', err);
        }
      }
    } else {
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech Recognition is not supported by your current browser. Please use Chrome, Edge, or Safari.');
      }
    }
  }

  stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
      this.emitState('idle');
    }
  }

  speak(text, { pitch = 1.0, rate = 1.0, volume = 1.0, onStart, onEnd } = {}) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();

    const cleanText = text
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.emitState('speaking');
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.emitState('idle');
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      this.emitState('idle');
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.emitState('idle');
    }
  }
}

export const speechService = new SpeechService();
