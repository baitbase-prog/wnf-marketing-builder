// WNF Marketing Strategy Builder
// Basic wizard implementation in plain JavaScript

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Application state collects user selections across steps.
   */
  const state = {
    projectType: null,
    stage: null,
    launchDate: null,
    prepDays: 14,
    budget: 5000,
    feePercent: 0.3,
    feeAmount: 1500,
    executionBudget: 3500,
    funnel: [],
    influencers: [],
    plan: [],
  };

  // Step handling
  let currentStep = 1;
  const totalSteps = 8;

  // DOM references
  const progressItems = Array.from(document.querySelectorAll('.progress-item'));
  const steps = Array.from(document.querySelectorAll('.step'));
  const mascotText = document.getElementById('mascot-text');

  // Step descriptions for mascot
  const mascotMessages = {
    1: 'Select the category that best matches your crypto project.',
    2: 'Tell us what stage you are at in your journey.',
    3: 'Choose your target launch date and how long you have to prepare.',
    4: 'Set your marketing budget and see our commission.',
    5: 'Arrange the marketing funnel to suit your goals.',
    6: 'Pick key influencers and media partners.',
    7: 'Review and tweak your marketing plan.',
    8: 'Enter your contact details to receive your custom plan.',
  };

  /**
   * Update progress indicator and mascot message.
   */
  function updateProgress() {
    progressItems.forEach((item, index) => {
      item.classList.toggle('active', index + 1 === currentStep);
    });
    mascotText.textContent = mascotMessages[currentStep] || '';
  }

  /**
   * Go to a specific step by index.
   * @param {number} stepIndex
   */
  function goToStep(stepIndex) {
    currentStep = stepIndex;
    steps.forEach((step, idx) => {
      step.classList.toggle('hidden', idx + 1 !== currentStep);
    });
    updateProgress();
  }

  // Initialize project types cards
  const projectTypes = [
    'DeFi',
    'Memecoin',
    'GameFi',
    'NFT',
    'SocialFi',
    'RWA',
    'Infrastructure',
    'AI x Web3',
    'Gambling & Casino',
    'Other',
  ];
  const typeGrid = document.getElementById('project-type-grid');
  // Mapping of project types to icon filenames for display in the wizard
  const projectIcons = {
    'DeFi': 'defi.png',
    'Memecoin': 'meme.png',
    'GameFi': 'game.png',
    'NFT': 'nft.png',
    'SocialFi': 'social.png',
    'RWA': 'rwa.png',
    'Infrastructure (L1, L2, tools)': 'infra.png',
    'AI x Web3': 'ai.png',
    'Gambling & Casino': 'gamble.png',
    'Other': 'other.png'
  };
  const step1Next = document.querySelector('#step-1 .next');
  projectTypes.forEach((type) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.tabIndex = 0;
    // Append an image and a label instead of plain text for the project type
    const img = document.createElement('img');
    img.src = projectIcons[type] || '';
    img.alt = `${type} icon`;
    card.appendChild(img);
    const span = document.createElement('span');
    span.textContent = type;
    card.appendChild(span);
    card.addEventListener('click', () => {
      state.projectType = type;
      // toggle selection UI
      document.querySelectorAll('#project-type-grid .card').forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      step1Next.disabled = false;
    });
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
    typeGrid.appendChild(card);
  });

  // Step 1 navigation
  const step1Back = document.querySelector('#step-1 .back');
  step1Back.addEventListener('click', () => {});
  step1Next.addEventListener('click', () => {
    goToStep(2);
  });

  // Initialize project stages
  const stages = ['Concept', 'Pre seed', 'Seed', 'Private sale', 'Public sale', 'TGE', 'Post TGE'];
  const stageContainer = document.getElementById('stage-options');
  const step2Next = document.querySelector('#step-2 .next');
  stages.forEach((stage) => {
    const btn = document.createElement('div');
    btn.className = 'stage-option';
    btn.textContent = stage;
    btn.tabIndex = 0;
    btn.addEventListener('click', () => {
      state.stage = stage;
      document.querySelectorAll('#stage-options .stage-option').forEach((el) => el.classList.remove('selected'));
      btn.classList.add('selected');
      step2Next.disabled = false;
    });
    btn.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') btn.click();
    });
    stageContainer.appendChild(btn);
  });
  const step2Back = document.querySelector('#step-2 .back');
  step2Back.addEventListener('click', () => {
    goToStep(1);
  });
  step2Next.addEventListener('click', () => {
    goToStep(3);
  });

  // Step 3: dates & prep
  const launchInput = document.getElementById('launch-date');
  const prepRange = document.getElementById('prep-days');
  const prepDisplay = document.getElementById('prep-days-display');
  const prepHintsContainer = document.getElementById('prep-hints');
  const step3Next = document.querySelector('#step-3 .next');
  const step3Back = document.querySelector('#step-3 .back');

  // Update prep hints based on range value
  function updatePrepHints(days) {
    let hint = '';
    if (days <= 3) {
      hint = '0–3 days: only fast deliverables such as press releases and quick influencer shoutouts.';
    } else if (days <= 6) {
      hint = '4–6 days: add AMA sessions, short content pieces and basic KOL involvement.';
    } else if (days <= 13) {
      hint = '7–13 days: full KOL programs, partnerships and native media articles become feasible.';
    } else {
      hint = '14–30 days: long‑lead media, comprehensive content and large partnerships are possible.';
    }
    prepHintsContainer.textContent = hint;
  }

  prepRange.addEventListener('input', (e) => {
    const days = parseInt(e.target.value, 10);
    state.prepDays = days;
    prepDisplay.textContent = days;
    updatePrepHints(days);
    // launch date must be selected to proceed
    step3Next.disabled = !launchInput.value;
  });

  launchInput.addEventListener('change', (e) => {
    state.launchDate = e.target.value;
    // step3 can continue only if a launch date is chosen
    step3Next.disabled = !state.launchDate;
  });

  step3Back.addEventListener('click', () => {
    goToStep(2);
  });
  step3Next.addEventListener('click', () => {
    goToStep(4);
  });
  // Initialize hints display
  updatePrepHints(state.prepDays);
  prepDisplay.textContent = state.prepDays;
  step3Next.disabled = true;

  // Step 4: Budget
  const budgetRange = document.getElementById('budget-range');
  const budgetDisplay = document.getElementById('budget-display');
  const budgetDetails = document.getElementById('budget-details');
  const step4Next = document.querySelector('#step-4 .next');
  const step4Back = document.querySelector('#step-4 .back');

  function calculateFee(budget) {
    // Fee tiers: 1–5k:30%, 5–10k:25%, 10–25k:20%, 25–50k:18%, 50–100k:15%, 100k+:10%
    let percent;
    if (budget <= 5000) percent = 0.3;
    else if (budget <= 10000) percent = 0.25;
    else if (budget <= 25000) percent = 0.2;
    else if (budget <= 50000) percent = 0.18;
    else if (budget <= 100000) percent = 0.15;
    else percent = 0.1;
    return percent;
  }

  function updateBudgetDetails(budget) {
    const feePercent = calculateFee(budget);
    const feeAmount = Math.round(budget * feePercent);
    const execBudget = budget - feeAmount;
    state.budget = budget;
    state.feePercent = feePercent;
    state.feeAmount = feeAmount;
    state.executionBudget = execBudget;
    budgetDisplay.textContent = budget;
    // Build details text
    budgetDetails.innerHTML = '';
    const lines = [
      `Agency fee: ${Math.round(feePercent * 100)}%`,
      `Fee amount: $${feeAmount.toLocaleString()}`,
      `Execution budget: $${execBudget.toLocaleString()}`,
    ];
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.className = 'detail';
      div.textContent = line;
      budgetDetails.appendChild(div);
    });
  }

  budgetRange.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    updateBudgetDetails(val);
  });

  step4Back.addEventListener('click', () => {
    goToStep(3);
  });
  step4Next.addEventListener('click', () => {
    goToStep(5);
  });
  // Initialize budget details
  updateBudgetDetails(state.budget);

  // Step 5: Funnel builder
  const funnelList = document.getElementById('funnel-list');
  const blockLibrary = document.getElementById('block-library');
  const step5Next = document.querySelector('#step-5 .next');
  const step5Back = document.querySelector('#step-5 .back');

  // Predefined funnel blocks (id, title, mandatory)
  const defaultBlocks = [
    { id: 'messaging', title: 'Positioning & Messaging', mandatory: true },
    { id: 'branding', title: 'Branding & Design', mandatory: true },
    { id: 'content', title: 'Content Production', mandatory: false },
    { id: 'community', title: 'Community Setup', mandatory: true },
    { id: 'influencers', title: 'Influencers Activation', mandatory: true },
    { id: 'kol', title: 'KOL Program', mandatory: false },
    { id: 'pr', title: 'PR & Press Release', mandatory: false },
    { id: 'media', title: 'Native Media Articles', mandatory: false },
    { id: 'paid', title: 'Paid Traffic', mandatory: false },
    { id: 'partnerships', title: 'Partnerships', mandatory: false },
  ];
  const availableBlocks = [
    { id: 'listings', title: 'Listing Preparation' },
    { id: 'referral', title: 'Referral & Quests' },
    { id: 'analytics', title: 'Analytics & Tracking' },
  ];

  // Initialize funnel with mandatory blocks + two optional defaults
  function initFunnel() {
    state.funnel = [];
    // Choose mandatory blocks and top optional ones based on project type/stage (simplified)
    defaultBlocks.forEach((block) => {
      if (block.mandatory || block.id === 'content') {
        state.funnel.push(block.id);
      }
    });
    renderFunnel();
  }

  function renderFunnel() {
    // Clear list
    funnelList.innerHTML = '';
    state.funnel.forEach((id) => {
      const block = defaultBlocks.find((b) => b.id === id) || availableBlocks.find((b) => b.id === id);
      const li = document.createElement('li');
      li.className = 'funnel-item';
      li.draggable = true;
      li.dataset.id = id;
      li.innerHTML = `
        <span>${block.title}</span>
        <span class="handle">☰</span>
      `;
      funnelList.appendChild(li);
    });
    attachDragHandlers();
  }

  function renderBlockLibrary() {
    blockLibrary.innerHTML = '';
    availableBlocks.forEach((block) => {
      const el = document.createElement('div');
      el.className = 'block';
      el.textContent = block.title;
      el.addEventListener('click', () => {
        state.funnel.push(block.id);
        renderFunnel();
      });
      blockLibrary.appendChild(el);
    });
  }

  function attachDragHandlers() {
    const items = funnelList.querySelectorAll('.funnel-item');
    let dragSrcEl = null;
    items.forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        dragSrcEl = item;
        item.classList.add('dragging');
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        const target = e.currentTarget;
        if (dragSrcEl && target !== dragSrcEl) {
          const bounding = target.getBoundingClientRect();
          const offset = e.clientY - bounding.top;
          const half = bounding.height / 2;
          const parent = target.parentNode;
          if (offset > half) {
            parent.insertBefore(dragSrcEl, target.nextSibling);
          } else {
            parent.insertBefore(dragSrcEl, target);
          }
        }
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        // After drag, update state order
        state.funnel = Array.from(funnelList.querySelectorAll('.funnel-item')).map((el) => el.dataset.id);
      });
    });
  }

  step5Back.addEventListener('click', () => {
    goToStep(4);
  });
  step5Next.addEventListener('click', () => {
    goToStep(6);
  });
  // Initialize funnel builder
  initFunnel();
  renderBlockLibrary();

  // Step 6: Influencers & media
  const influencerList = document.getElementById('influencer-list');
  const step6Back = document.querySelector('#step-6 .back');
  const step6Next = document.querySelector('#step-6 .next');
  const influencerData = [
    { id: 'inf1', name: 'CryptoKing', platform: 'X' },
    { id: 'inf2', name: 'DeFiQueen', platform: 'YouTube' },
    { id: 'inf3', name: 'GameFiGuru', platform: 'X' },
    { id: 'inf4', name: 'NFTWizard', platform: 'YouTube' },
    { id: 'inf5', name: 'SocialFiStar', platform: 'X' },
  ];

  function renderInfluencers() {
    influencerList.innerHTML = '';
    influencerData.forEach((inf) => {
      const card = document.createElement('div');
      card.className = 'influencer-card';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = inf.id;
      checkbox.checked = state.influencers.includes(inf.id);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          if (!state.influencers.includes(inf.id)) state.influencers.push(inf.id);
        } else {
          state.influencers = state.influencers.filter((id) => id !== inf.id);
        }
      });
      const label = document.createElement('label');
      label.htmlFor = inf.id;
      label.innerHTML = `<strong>${inf.name}</strong><br/><span style="font-size:0.8rem; color: var(--muted-color)">${inf.platform}</span>`;
      card.appendChild(checkbox);
      card.appendChild(label);
      influencerList.appendChild(card);
    });
  }

  step6Back.addEventListener('click', () => {
    goToStep(5);
  });
  step6Next.addEventListener('click', () => {
    // Before moving to plan builder, generate plan items from current funnel
    buildPlan();
    goToStep(7);
  });
  renderInfluencers();

  // Step 7: Plan builder (simplified)
  const planContainer = document.getElementById('plan-items');
  const step7Back = document.querySelector('#step-7 .back');
  const step7Next = document.querySelector('#step-7 .next');

  function buildPlan() {
    planContainer.innerHTML = '';
    state.plan = [];
    // For each funnel block, create a basic plan entry
    state.funnel.forEach((id) => {
      const block = defaultBlocks.find((b) => b.id === id) || availableBlocks.find((b) => b.id === id);
      const item = {
        id,
        title: block.title,
        quantity: 1,
      };
      state.plan.push(item);
    });
    renderPlan();
  }

  function renderPlan() {
    planContainer.innerHTML = '';
    state.plan.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'plan-item';
      div.innerHTML = `
        <span>${item.title}</span>
        <input type="number" min="1" value="${item.quantity}" data-index="${idx}" />
      `;
      const input = div.querySelector('input');
      input.addEventListener('input', (e) => {
        const i = parseInt(e.target.dataset.index, 10);
        state.plan[i].quantity = parseInt(e.target.value, 10);
      });
      planContainer.appendChild(div);
    });
  }

  step7Back.addEventListener('click', () => {
    goToStep(6);
  });
  step7Next.addEventListener('click', () => {
    goToStep(8);
    renderSummary();
  });

  // Plan will be built in step6Next before entering step 7

  // Step 8: Lead form and submit
  const finalSummary = document.getElementById('final-summary');
  const step8Back = document.querySelector('#step-8 .back');
  step8Back.addEventListener('click', () => {
    goToStep(7);
  });
  const wizardForm = document.getElementById('wizard-form');
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Collect lead info
    const email = document.getElementById('lead-email').value.trim();
    const tg = document.getElementById('lead-telegram').value.trim();
    const site = document.getElementById('lead-website').value.trim();
    const link = document.getElementById('lead-project-link').value.trim();
    const consent = document.getElementById('lead-consent').checked;
    // Compose payload
    const payload = {
      answers: {
        projectType: state.projectType,
        stage: state.stage,
        launchDate: state.launchDate,
        prepDays: state.prepDays,
        budget: state.budget,
        feePercent: state.feePercent,
        feeAmount: state.feeAmount,
        executionBudget: state.executionBudget,
      },
      funnel: state.funnel,
      influencers: state.influencers,
      plan: state.plan,
      lead: {
        email,
        telegram: tg,
        website: site,
        projectLink: link,
        consent,
      },
    };
    // Show summary
    finalSummary.innerHTML = `<pre>${JSON.stringify(payload, null, 2)}</pre>`;
    alert('Thank you! Your request has been recorded.');
  });

  function renderSummary() {
    // Called when entering step 8; update summary (optional: show human readable summary)
    finalSummary.innerHTML = '';
  }

  // Initially go to step 1
  goToStep(1);
});
