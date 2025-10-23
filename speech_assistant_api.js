// speech_assistant_api.js

// --- CONFIGURATION AND STATE (MUST BE ACCESSIBLE GLOBALLY OR PASSED) ---
const apiKey = ""; // IMPORTANT: Set your actual API Key here if not provided by the environment.
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
const MAX_RETRIES = 3;

// Global state variables, assumed to be defined and managed by the main HTML file
// Example: let selectedMode = null; let isRecording = false; let finalTranscript = '';

// --- DOM References (Assumed to be set in the main script) ---
// These variables must be defined in your main HTML script after the DOM loads:
/*
const startPracticeBtn = document.getElementById('start-practice-btn');
const btnText = document.getElementById('btn-text');
const statusMessage = document.getElementById('status-message');
const currentTopicTitle = document.getElementById('current-topic-title');
const currentTopicPrompt = document.getElementById('current-topic-prompt');
const reviewInsightsSection = document.getElementById('review-insights-section');
const reviewContent = document.getElementById('review-content');
const reviewLoader = document.getElementById('review-loader');
const reviewLoadingText = document.getElementById('review-loading-text');
const micIcon = document.getElementById('mic-icon');
const transcribedTextDisplay = document.getElementById('transcribed-text-display');
const transcriptContent = document.getElementById('transcript-content');
const customGeneratorSection = document.getElementById('custom-generator-section');
*/

// --- Speech Recognition Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        window.isRecording = true;
        window.micIcon.classList.add('recording-pulse');
        window.btnText.textContent = "Stop & Review";
        window.statusMessage.textContent = "Listening... Click Stop or wait for silence.";
        window.transcriptContent.textContent = '';
        window.transcribedTextDisplay.classList.remove('hidden');
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let tempFinalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                tempFinalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        if (tempFinalTranscript) {
            window.finalTranscript += tempFinalTranscript;
        }
        window.transcriptContent.textContent = window.finalTranscript + interimTranscript + (interimTranscript ? '...' : '');
    };

    recognition.onend = async () => {
        window.isRecording = false;
        window.micIcon.classList.remove('recording-pulse');
        window.startPracticeBtn.disabled = true;
        window.btnText.textContent = "Processing...";
        window.statusMessage.textContent = "Finished recording. Analyzing speech.";
        
        window.transcriptContent.textContent = window.finalTranscript || "No speech detected. Please ensure your microphone is working.";
        
        await generateReview(window.finalTranscript);

        window.startPracticeBtn.disabled = false;
        window.btnText.textContent = "Start Practice";
        window.finalTranscript = '';
        window.isRecording = false;
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        window.statusMessage.textContent = `Error: ${event.error}. Try again.`;
        window.micIcon.classList.remove('recording-pulse');
        window.startPracticeBtn.disabled = false;
        window.btnText.textContent = "Start Practice";
        window.isRecording = false;
    };
}


// --- Core Functions ---

/**
 * Toggles microphone recording on or off.
 * This is the function called by the "Start Practice" button.
 */
function toggleRecording() {
    if (!recognition) return;

    if (window.isRecording) {
        recognition.stop();
    } else {
        window.finalTranscript = '';
        window.reviewInsightsSection.classList.add('hidden');
        window.reviewContent.innerHTML = '';
        
        try {
            recognition.start();
        } catch(e) {
            console.error("Recognition start failed:", e);
            window.statusMessage.textContent = "Error starting microphone. Ensure access is granted.";
        }
    }
}

/**
 * Generates the AI review based on the transcribed text.
 * @param {string} transcript - The text of the user's speech.
 */
async function generateReview(transcript) {
    if (!transcript) {
        window.reviewContent.innerHTML = '<p class="text-red-500 font-semibold">Could not generate a review: No speech was detected or transcribed.</p>';
        window.reviewInsightsSection.classList.remove('hidden');
        return;
    }

    window.reviewInsightsSection.classList.remove('hidden');
    window.reviewContent.innerHTML = '';
    window.reviewLoader.classList.remove('hidden');
    window.reviewLoadingText.classList.remove('hidden');

    const systemPrompt = `You are a professional AI Public Speaking Coach and Reviewer. The user has just delivered a speech for a task titled "${window.selectedMode.title}" with the prompt: "${window.selectedMode.prompt}".

Your task is to provide detailed feedback on the delivery based *only* on the provided transcript. Your response MUST strictly follow this Markdown structure:

## Overall Feedback
[A friendly, two-sentence summary of the strengths and areas for improvement.]

## Review Insights
* **Clarity:** [Comment on the coherence and word choice of the transcript.]
* **Structure/Flow:** [Comment on how well the speech addressed the prompt and flowed logically.]
* **Vocal Variety (Inferred):** [Based on the text structure (e.g., use of strong verbs, topic changes), infer and comment on suggested vocal variety/emphasis.]
* **Pace/Pauses (Inferred):** [Infer and comment on the implied pacing and where effective pauses could have been used based on sentence length and punctuation.]

## Suggested Next Steps
[One specific, actionable tip for improvement.]
`;

    const userQuery = `Transcript of my speech on the topic "${window.selectedMode.title}":\n\n---START OF TRANSCRIPT---\n${transcript}\n---END OF TRANSCRIPT---\n\nAnalyze this transcript and provide the structured review as requested in the system instructions.`;
    
    let responseText = "Review generation failed due to a technical error.";

    try {
        const result = await callGeminiAPI(systemPrompt, userQuery);
        responseText = result.text;
    } catch (error) {
        console.error("Gemini API call failed during review:", error);
    } finally {
        window.reviewLoader.classList.add('hidden');
        window.reviewLoadingText.classList.add('hidden');
        window.reviewContent.innerHTML = formatMarkdownToHtml(responseText);
        window.reviewInsightsSection.classList.remove('hidden');
    }
}

/**
 * Uses Gemini to generate a unique speaking prompt based on user input.
 */
async function generateCustomPrompt() {
    const topic = document.getElementById('custom-topic').value.trim();
    const style = document.getElementById('custom-style').value;
    const duration = document.getElementById('custom-duration').value;
    
    if (!topic) {
        window.statusMessage.textContent = "Please enter a Topic/Category before generating a prompt.";
        return;
    }

    // Disable UI and show loader
    const generateBtn = document.getElementById('generate-prompt-btn');
    const generateBtnText = document.getElementById('generate-btn-text');
    const generateLoader = document.getElementById('generate-loader');
    
    generateBtn.disabled = true;
    generateBtnText.textContent = "Generating...";
    generateLoader.classList.remove('hidden');
    window.statusMessage.textContent = "The AI is crafting your new speaking prompt...";

    const systemPrompt = "You are a creative public speaking prompt generator. Your task is to generate a single, specific, and engaging speaking prompt based on the user's input. The output must be ONLY the prompt text, no headers, no explanation, no quotes.";
    
    const userQuery = `Create a prompt for a ${style} speech about "${topic}" that should last approximately ${duration}.`;
    
    let newPrompt = "Error generating prompt. Try a different topic.";

    try {
        const result = await callGeminiAPI(systemPrompt, userQuery);
        newPrompt = result.text.trim().replace(/^['"]|['"]$/g, '');
        
        // Create a temporary mode object for the generated prompt
        const generatedMode = {
            id: 'generated',
            title: `${style} Speech Practice`,
            level: `${duration} Target`,
            time: 'Custom',
            prompt: newPrompt
        };

        // Call the global function defined in the HTML script to update the UI
        window.selectMode(generatedMode);

        window.statusMessage.textContent = "Your new custom prompt is ready! Click 'Start Practice' when ready.";
        
    } catch (error) {
        console.error("Gemini API call failed during prompt generation:", error);
        window.statusMessage.textContent = newPrompt; 
    } finally {
        generateBtn.disabled = false;
        generateBtnText.textContent = "✨ Generate New Prompt";
        generateLoader.classList.add('hidden');
    }
}

/**
 * Fetches content from the Gemini API with exponential backoff for retries.
 * @param {string} systemInstruction - The LLM's role and rules.
 * @param {string} userQuery - The specific task for the LLM.
 */
async function callGeminiAPI(systemInstruction, userQuery, maxRetries = MAX_RETRIES) {
    const payload = {
        contents: [{ role: 'user', parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    let lastError = null;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.status === 429 || response.status >= 500) {
                throw new Error(`API error with status ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                return { text: candidate.content.parts[0].text };
            }
            
            throw new Error("Invalid response structure from API.");

        } catch (error) {
            lastError = error;
            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`Failed to get response after ${maxRetries} attempts. Last error: ${lastError.message}`);
}

/**
 * Simple utility to format the Markdown critique into readable HTML structure.
 * @param {string} markdown - The markdown content from the AI model.
 */
function formatMarkdownToHtml(markdown) {
    let html = markdown;
    // Headers
    html = html.replace(/^## (.*$)/gim, '<h3 class="text-xl font-semibold mt-4 mb-2 text-gray-800">$1</h3>');
    // Lists
    html = html.replace(/^\* (.*$)/gim, '<div class="flex items-start"><span class="font-bold mr-2 text-blue-600">•</span><p>$1</p></div>');
    // Paragraphs/other text
    html = html.replace(/\[([^\]]+)\]/g, '<span class="italic text-green-700">$1</span>');
    return html;
}

// Expose functions to the global scope for the HTML file to call
window.toggleRecording = toggleRecording;
window.generateReview = generateReview;
window.generateCustomPrompt = generateCustomPrompt;
window.callGeminiAPI = callGeminiAPI;
