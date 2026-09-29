/* ==========================================================================
   StudyMate - AI Student Utility Assistant
   Frontend JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- UI Elements ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const apiStatus = document.getElementById('apiStatus');
    const statusText = document.getElementById('statusText');
    
    // Feature Selector Tabs
    const featureBtns = document.querySelectorAll('.feature-btn');
    const activeFeatureTitle = document.getElementById('activeFeatureTitle');
    const activeFeatureDesc = document.getElementById('activeFeatureDesc');
    
    // Input Area Elements
    const studentInput = document.getElementById('studentInput');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const loadPresetBtn = document.getElementById('loadPresetBtn');
    const clearBtn = document.getElementById('clearBtn');
    const generateBtn = document.getElementById('generateBtn');
    const alertBanner = document.getElementById('alertBanner');
    const alertText = document.getElementById('alertText');
    
    // Output Area Elements
    const placeholderState = document.getElementById('placeholderState');
    const loadingState = document.getElementById('loadingState');
    const loadingSubtitle = document.getElementById('loadingSubtitle');
    const markdownOutput = document.getElementById('markdownOutput');
    const outputActions = document.getElementById('outputActions');
    const copyBtn = document.getElementById('copyBtn');
    const speechBtn = document.getElementById('speechBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const interactiveQuizContainer = document.getElementById('interactiveQuizContainer');
    const quizQuestionsList = document.getElementById('quizQuestionsList');
    const quizScoreBadge = document.getElementById('quizScoreBadge');

    // Current Application State
    let activeFeature = 'ask';
    let rawResponseText = '';
    let isSpeaking = false;

    // --- Feature Config & Sample Presets ---
    const FEATURE_CONFIGS = {
        ask: {
            title: "💬 General Study Q&A",
            desc: "Type any study question from Python, Java, AI/ML, NLP, Math, Cloud, Networks, Data Mining, etc.",
            placeholder: "Type your question here (e.g., 'What is machine learning?', 'Explain the CAP theorem')...",
            preset: "What is machine learning and how does supervised learning differ from unsupervised learning?"
        },
        summarize: {
            title: "📝 Note Summarization",
            desc: "Paste lecture notes or textbook passages below to generate concise summaries.",
            placeholder: "Paste your biology, history, or engineering study notes here...",
            preset: `CELLULAR RESPIRATION NOTES:
Cellular respiration is a set of metabolic reactions and processes that take place in the cells of organisms to convert biochemical energy from nutrients into adenosine triphosphate (ATP), and then release waste products. The reactions involved in respiration are catabolic reactions, which break large molecules into smaller ones, releasing energy. 

Respiration is one of the key ways a cell gains useful energy to fuel cellular activity. The overall reaction occurs in four main stages: 
1. Glycolysis: Takes place in the cytoplasm. One molecule of glucose is broken down into two molecules of pyruvate, producing a net gain of 2 ATP and 2 NADH.
2. Pyruvate Oxidation: Pyruvate moves into the mitochondrial matrix and is converted into Acetyl-CoA.
3. Citric Acid Cycle (Krebs Cycle): Occurs in the mitochondrial matrix. Acetyl-CoA is processed to generate 2 ATP, 6 NADH, and 2 FADH2.
4. Oxidative Phosphorylation (Electron Transport Chain): Occurs on the inner mitochondrial membrane. Electrons pass through proteins, creating a proton gradient that drives ATP Synthase to generate approximately 26 to 28 ATP molecules.

Overall, oxygen acts as the final electron acceptor, combining with protons to form water. Without oxygen, cellular respiration halts at glycolysis and switches to fermentation.`
        },
        quiz: {
            title: "🧪 Quiz Generation",
            desc: "Enter study materials to automatically generate a multiple-choice practice quiz.",
            placeholder: "Paste textbook content or notes to generate quiz questions...",
            preset: `NEWTON'S LAWS OF MOTION:
Newton's laws of motion are three physical laws that together laid the foundation for classical mechanics. They describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.

First Law (Law of Inertia): An object at rest remains at rest, and an object in motion remains in motion at constant velocity, unless acted upon by a net external force. Inertia is the natural resistance of any physical object to any change in its velocity.

Second Law (F = ma): The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The direction of the acceleration is in the direction of the net force applied. The equation is represented as Force = mass × acceleration.

Third Law (Action and Reaction): When one body exerts a force on a second body, the second body simultaneously exerts a force equal in magnitude and opposite in direction on the first body. For every action, there is an equal and opposite reaction.`
        },
        improve: {
            title: "✨ Answer Improvement",
            desc: "Enter a rough draft or weak answer to polish grammar, tone, and academic clarity.",
            placeholder: "Enter your short answer draft here for AI improvement...",
            preset: `Question: Explain how photosynthesis works and why plants are green.

Student Draft: Photosynthesis is when plants make their own food using sunlight. They take in carbon dioxide from the air and water from the soil. Then they turn it into sugar for energy and oxygen which they let out into the air so we can breathe. Plants look green because of chlorophyll which is inside the plant cells. Chlorophyll absorbs red and blue sunlight but doesn't like green light so it bounces the green light back into our eyes.`
        },
        explain: {
            title: "🚀 Concept Explanation",
            desc: "Enter any complex topic or term to receive a simple, analogy-driven explanation.",
            placeholder: "Type a topic or concept (e.g., 'Quantum Entanglement', 'Time Complexity', 'Inflation')...",
            preset: "Recursion in Computer Science and Programming"
        }
    };

    // --- 1. Check Backend Connectivity ---
    checkBackendHealth();

    async function checkBackendHealth() {
        try {
            const res = await fetch('/api/health');
            const data = await res.json();
            if (data.status === 'online') {
                statusText.textContent = `Backend Ready (${data.configured_provider})`;
                apiStatus.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            }
        } catch (err) {
            statusText.textContent = "Backend Offline";
            apiStatus.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        }
    }

    // --- 2. Theme Toggle ---
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', nextTheme);
        themeToggleBtn.innerHTML = nextTheme === 'light' 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
    });

    // --- 3. Feature Switching ---
    featureBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feature = btn.getAttribute('data-feature');
            switchFeature(feature);
        });
    });

    function switchFeature(featureKey) {
        activeFeature = featureKey;
        
        // Update tab buttons state
        featureBtns.forEach(b => {
            if (b.getAttribute('data-feature') === featureKey) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });

        // Update header & placeholder
        const config = FEATURE_CONFIGS[featureKey] || FEATURE_CONFIGS.ask;
        activeFeatureTitle.textContent = config.title;
        activeFeatureDesc.textContent = config.desc;
        studentInput.placeholder = config.placeholder;

        // Hide alert if open
        hideAlert();
    }

    // --- 4. Preset Input & Clear Controls ---
    loadPresetBtn.addEventListener('click', () => {
        const config = FEATURE_CONFIGS[activeFeature] || FEATURE_CONFIGS.ask;
        studentInput.value = config.preset;
        updateCounts();
        hideAlert();
    });

    clearBtn.addEventListener('click', () => {
        studentInput.value = '';
        updateCounts();
        hideAlert();
    });

    studentInput.addEventListener('input', updateCounts);

    function updateCounts() {
        const text = studentInput.value;
        charCount.textContent = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = words;
    }

    // --- 5. Generate Response Logic ---
    generateBtn.addEventListener('click', handleGenerate);

    async function handleGenerate() {
        const content = studentInput.value.trim();

        // Basic Input Validation
        if (!content) {
            showAlert("Please enter a study question or content before generating an answer.");
            return;
        }

        if (content.length < 3) {
            showAlert("Your input is too short. Please enter a complete phrase or question.");
            return;
        }

        hideAlert();
        showLoadingState();

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feature: activeFeature,
                    content: content
                })
            });

            const data = await response.json();

            if (!data.success) {
                showErrorState(data.error || "Failed to generate response.");
                return;
            }

            rawResponseText = data.result;
            displayOutput(data.result);

        } catch (err) {
            showErrorState("Network or server connection failed. Please check your internet connection.");
        }
    }

    // --- 6. Output Rendering & Interactive Quiz ---
    function displayOutput(markdownText) {
        // Hide loading and placeholder
        placeholderState.classList.add('hidden');
        loadingState.classList.add('hidden');
        
        // Show markdown container & actions
        markdownOutput.classList.remove('hidden');
        outputActions.classList.remove('hidden');

        // Render Markdown using Marked.js
        markdownOutput.innerHTML = marked.parse(markdownText);

        // Check for Interactive Quiz JSON payload
        interactiveQuizContainer.classList.add('hidden');
        quizQuestionsList.innerHTML = '';

        if (activeFeature === 'quiz') {
            try {
                // Extract ```json ... ``` block if present
                const jsonMatch = markdownText.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                    const quizData = JSON.parse(jsonMatch[1]);
                    renderInteractiveQuiz(quizData);
                }
            } catch (jsonErr) {
                console.warn("Could not parse quiz JSON format for interactive player:", jsonErr);
            }
        }
    }

    function renderInteractiveQuiz(quizData) {
        if (!Array.isArray(quizData) || quizData.length === 0) return;

        interactiveQuizContainer.classList.remove('hidden');
        let userScore = 0;
        let totalQuestions = quizData.length;
        quizScoreBadge.textContent = `Score: 0 / ${totalQuestions}`;

        quizQuestionsList.innerHTML = quizData.map((q, qIndex) => `
            <div class="quiz-card" id="quiz-card-${qIndex}">
                <div class="quiz-question-title">Q${qIndex + 1}: ${escapeHtml(q.question)}</div>
                <div class="quiz-options-list">
                    ${q.options.map((opt, optIndex) => `
                        <button class="quiz-option-btn" 
                                data-q="${qIndex}" 
                                data-opt="${optIndex}" 
                                data-correct="${q.answer}">
                            ${['A', 'B', 'C', 'D'][optIndex]}) ${escapeHtml(opt)}
                        </button>
                    `).join('')}
                </div>
                <div class="quiz-explanation hidden" id="quiz-exp-${qIndex}">
                    💡 <strong>Explanation:</strong> ${escapeHtml(q.explanation || 'Correct!')}
                </div>
            </div>
        `).join('');

        // Add interactive option event listeners
        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const qIdx = parseInt(btn.getAttribute('data-q'));
                const chosenOptIdx = parseInt(btn.getAttribute('data-opt'));
                const correctOptIdx = parseInt(btn.getAttribute('data-correct'));
                
                const card = document.getElementById(`quiz-card-${qIdx}`);
                const optionBtns = card.querySelectorAll('.quiz-option-btn');
                const expBox = document.getElementById(`quiz-exp-${qIdx}`);

                // Prevent re-answering
                optionBtns.forEach(b => b.disabled = true);

                if (chosenOptIdx === correctOptIdx) {
                    btn.classList.add('selected-correct');
                    userScore++;
                } else {
                    btn.classList.add('selected-wrong');
                    // Highlight correct option too
                    optionBtns[correctOptIdx].classList.add('selected-correct');
                }

                expBox.classList.remove('hidden');
                quizScoreBadge.textContent = `Score: ${userScore} / ${totalQuestions}`;
            });
        });
    }

    // --- 7. Utility Actions (Copy, Read Aloud, Download) ---
    copyBtn.addEventListener('click', () => {
        if (!rawResponseText) return;
        navigator.clipboard.writeText(rawResponseText).then(() => {
            const origText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = origText; }, 2000);
        });
    });

    speechBtn.addEventListener('click', () => {
        if (!rawResponseText) return;

        if ('speechSynthesis' in window) {
            if (isSpeaking) {
                window.speechSynthesis.cancel();
                isSpeaking = false;
                speechBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
                return;
            }

            // Strip markdown tags for clean reading
            const plainText = rawResponseText.replace(/[#*`>-]/g, '');
            const utterance = new SpeechSynthesisUtterance(plainText);
            
            utterance.onend = () => {
                isSpeaking = false;
                speechBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
            };

            window.speechSynthesis.speak(utterance);
            isSpeaking = true;
            speechBtn.innerHTML = '<i class="fa-solid fa-square"></i> Stop';
        } else {
            alert("Speech Synthesis is not supported in your browser.");
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (!rawResponseText) return;
        const blob = new Blob([rawResponseText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `StudyMate_${activeFeature}_${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(url);
    });

    // --- 8. UI Helper Functions ---
    function showAlert(msg) {
        alertText.textContent = msg;
        alertBanner.classList.remove('hidden');
    }

    function hideAlert() {
        alertBanner.classList.add('hidden');
    }

    function showLoadingState() {
        placeholderState.classList.add('hidden');
        markdownOutput.classList.add('hidden');
        interactiveQuizContainer.classList.add('hidden');
        outputActions.classList.add('hidden');
        
        loadingState.classList.remove('hidden');
        generateBtn.disabled = false;
        
        const subtitles = [
            "Analyzing core concepts & structure...",
            "Consulting Gemini AI...",
            "Formatting concise bullet points...",
            "Finalizing response for easy reading..."
        ];
        let step = 0;
        loadingSubtitle.textContent = subtitles[0];
        const timer = setInterval(() => {
            step = (step + 1) % subtitles.length;
            if (loadingState.classList.contains('hidden')) {
                clearInterval(timer);
            } else {
                loadingSubtitle.textContent = subtitles[step];
            }
        }, 1500);
    }

    function showErrorState(errMessage) {
        loadingState.classList.add('hidden');
        placeholderState.classList.add('hidden');
        generateBtn.disabled = false;
        
        markdownOutput.classList.remove('hidden');
        markdownOutput.innerHTML = `
            <div class="alert alert-error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <div>
                    <strong>Generation Failed:</strong> ${escapeHtml(errMessage)}
                </div>
            </div>
        `;
    }

    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
