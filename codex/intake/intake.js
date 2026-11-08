(() => {
  const params = new URLSearchParams(window.location.search);
  const german = params.get('lang') === 'de';
  const booking = params.get('booking');
  const token = params.get('token');
  const status = document.getElementById('intake-status');
  const area = document.getElementById('intake-area');
  const form = document.getElementById('intake-form');
  const message = document.getElementById('form-message');
  const birthTime = form.elements.birthTime;
  const birthTimeUnknown = form.elements.birthTimeUnknown;

  const fieldsets = {
    current_sky: document.getElementById('current-sky-fields'),
    personal_pattern: document.getElementById('personal-pattern-fields'),
    astrological_foundations: document.getElementById('foundations-fields'),
    codex_2027_entry: document.getElementById('annual-fields')
  };

  const requiredFields = {
    current_sky: ['currentSkyContext', 'currentSkyFocus'],
    personal_pattern: ['personalPatternTheme', 'personalPatternQuestion'],
    astrological_foundations: ['foundationsFocus', 'foundationsQuestion'],
    codex_2027_entry: ['annualIntention']
  };

  const offerCopy = {
    current_sky: 'Current Sky · birth details and one present focus',
    personal_pattern: 'Personal Pattern · birth details and your chosen theme',
    astrological_foundations: 'Astrological Foundations · birth details and your reading focus',
    codex_2027_entry: 'Codex 2027 · birth details and your annual intention'
  };

  const de = {
    'PRIVATE INTAKE': 'PRIVATER INTAKE',
    'THE DETAILS THAT MAKE THIS READING PERSONAL.': 'DIE ANGABEN, DIE DEINE LESUNG PERSÖNLICH MACHEN.',
    'THE DETAILS THAT': 'DIE ANGABEN, DIE', 'MAKE THIS READING PERSONAL.': 'DEINE LESUNG PERSÖNLICH MACHEN.',
    'Loading your private intake…': 'Dein privater Intake wird geladen …',
    'Private handling, clear purpose.': 'Private Verarbeitung, klarer Zweck.',
    'We ask only for information used to prepare your selected reading. Your details are encrypted before storage and are not sent by email. Please do not include medical, urgent, legal or financial information here.': 'Wir fragen nur Angaben ab, die zur Vorbereitung deiner gewählten Lesung dienen. Deine Angaben werden vor der Speicherung verschlüsselt und nicht per E-Mail versendet. Bitte trage hier keine medizinischen, dringenden, rechtlichen oder finanziellen Informationen ein.',
    'Birth details': 'Geburtsangaben',
    'These details are used to prepare the reading. If a recorded birth time is unavailable, simply tell us rather than estimating one.': 'Diese Angaben dienen der Vorbereitung deiner Lesung. Wenn keine dokumentierte Geburtszeit vorliegt, teile uns das bitte mit, statt eine Zeit zu schätzen.',
    'Date of birth': 'Geburtsdatum', 'Place of birth': 'Geburtsort', 'City or town and country': 'Ort und Land', 'Time of birth': 'Geburtszeit', 'Use the recorded time where known': 'Nutze die dokumentierte Zeit, falls bekannt', 'My birth time is unknown.': 'Meine Geburtszeit ist unbekannt.',
    'Your present context': 'Dein aktueller Kontext', 'A little context keeps the Current Sky reading close to the moment you are living.': 'Ein wenig Kontext hält die Current-Sky-Lesung nah an dem, was du gerade erlebst.', 'What is most present?': 'Was ist gerade am stärksten präsent?', 'Choose one': 'Bitte wählen', 'A current decision or turning point': 'Eine aktuelle Entscheidung oder ein Wendepunkt', 'A change in work, direction or responsibility': 'Eine Veränderung in Arbeit, Richtung oder Verantwortung', 'A relationship or relational pattern': 'Eine Beziehung oder ein Beziehungsmuster', 'A wider transition or period of change': 'Ein größerer Übergang oder eine Zeit der Veränderung', 'Another present theme': 'Ein anderes aktuelles Thema', 'What would you like this reading to help you reflect on?': 'Worüber soll dir diese Lesung eine klarere Reflexion ermöglichen?', 'One or two sentences are enough.': 'Ein oder zwei Sätze genügen.',
    'Your chosen pattern': 'Dein gewähltes Muster', 'Choose the one area you would like to place at the centre of this reading.': 'Wähle den einen Bereich, den du in den Mittelpunkt dieser Lesung stellen möchtest.', 'Focus': 'Fokus', 'Love & Relationships': 'Liebe & Beziehungen', 'Identity & Expression': 'Identität & Ausdruck', 'Direction & Responsibility': 'Richtung & Verantwortung', 'What repeats, or what would you like to understand more clearly?': 'Was wiederholt sich oder was möchtest du klarer verstehen?', 'Please keep this to your own experience.': 'Bitte bleibe bei deiner eigenen Erfahrung.',
    'Your reading focus': 'Der Fokus deiner Lesung', 'Choose the balance that would be most useful, then name the question or context you are bringing.': 'Wähle die Perspektive, die für dich am hilfreichsten wäre, und benenne dann deine Frage oder deinen Kontext.', 'Primary focus': 'Hauptfokus', 'Natal-chart foundations': 'Grundlagen des Geburtshoroskops', 'Current transits in context': 'Aktuelle Transite im Zusammenhang', 'Both, as one connected picture': 'Beides als zusammenhängendes Bild', 'What question or present context would make this reading useful?': 'Welche Frage oder welcher aktuelle Kontext würde diese Lesung für dich hilfreich machen?',
    'Your 2027 intention': 'Deine Intention für 2027', 'This is not a goal-setting exercise. A few honest words help us place the annual reading in the life you are actually meeting.': 'Dies ist keine Zielsetzungsübung. Ein paar ehrliche Worte helfen uns, die Jahreslesung in deinem tatsächlichen Leben zu verorten.', 'What would you like to meet more consciously in 2027?': 'Was möchtest du 2027 bewusster begleiten?', 'Is there a transition, responsibility or timing context already known?': 'Gibt es bereits einen bekannten Übergang, eine Verantwortung oder einen zeitlichen Kontext?', 'Optional': 'Optional',
    'I understand that these details are used to prepare my selected reading and agree to their private handling as described in the Privacy Notice.': 'Ich verstehe, dass diese Angaben zur Vorbereitung meiner gewählten Lesung genutzt werden, und stimme ihrer privaten Verarbeitung gemäß den Datenschutzhinweisen zu.', 'Send private intake': 'Privaten Intake senden'
  };
  if (german) {
    document.documentElement.lang = 'de'; document.title = 'Privater Codex-Intake | Human Architecture';
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => { const original = node.nodeValue; const key = original.trim(); if (!de[key]) return; node.nodeValue = original.match(/^\s*/)[0] + de[key] + original.match(/\s*$/)[0]; });
  }

  function setBirthTimeState() {
    const unknown = birthTimeUnknown.checked;
    birthTime.disabled = unknown;
    if (unknown) birthTime.value = '';
  }

  function showFields(offerKey) {
    Object.entries(fieldsets).forEach(([key, fieldset]) => {
      const active = key === offerKey;
      fieldset.hidden = !active;
      fieldset.querySelectorAll('input, select, textarea').forEach((input) => {
        input.disabled = !active;
        input.required = active && requiredFields[offerKey].includes(input.name);
      });
    });
  }

  if (!booking || !token) {
    status.textContent = german ? 'Dieser private Intake-Link ist unvollständig. Bitte verwende den Link aus deiner Buchungs-E-Mail.' : 'This private intake link is incomplete. Please use the link from your booking email.';
    return;
  }

  history.replaceState({}, '', window.location.pathname + '?booking=' + encodeURIComponent(booking));
  birthTimeUnknown.addEventListener('change', setBirthTimeState);
  setBirthTimeState();

  fetch('/api/body-language-paypal-return?codex=intake&booking=' + encodeURIComponent(booking) + '&token=' + encodeURIComponent(token))
    .then(async (response) => {
      let body;
      try { body = await response.json(); } catch (_) { body = { error: 'This private intake link is unavailable.' }; }
      return { response, body };
    })
    .then(({ response, body }) => {
      if (!response.ok || !body.ok || !fieldsets[body.offerKey]) {
        throw new Error(body.error || 'This private intake link is unavailable.');
      }
      showFields(body.offerKey);
      status.textContent = german ? ({ current_sky: 'Current Sky · Geburtsangaben und ein aktueller Fokus', personal_pattern: 'Personal Pattern · Geburtsangaben und dein gewähltes Thema', astrological_foundations: 'Astrologische Grundlagen · Geburtsangaben und dein Lesefokus', codex_2027_entry: 'Codex 2027 · Geburtsangaben und deine Jahresintention' }[body.offerKey]) : offerCopy[body.offerKey];
      area.hidden = false;
    })
    .catch((error) => {
      status.textContent = error.message || 'This private intake link is unavailable.';
    });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    message.textContent = german ? 'Dein privater Intake wird gesendet …' : 'Sending your private intake…';

    const payload = {
      booking,
      token,
      birthDate: form.elements.birthDate.value,
      birthPlace: form.elements.birthPlace.value,
      birthTime: birthTime.value,
      birthTimeUnknown: birthTimeUnknown.checked,
      currentSkyContext: form.elements.currentSkyContext.value,
      currentSkyFocus: form.elements.currentSkyFocus.value,
      personalPatternTheme: form.elements.personalPatternTheme.value,
      personalPatternQuestion: form.elements.personalPatternQuestion.value,
      foundationsFocus: form.elements.foundationsFocus.value,
      foundationsQuestion: form.elements.foundationsQuestion.value,
      annualIntention: form.elements.annualIntention.value,
      annualContext: form.elements.annualContext.value,
      dataConsent: form.elements.dataConsent.checked
    };

    try {
      const response = await fetch('/api/body-language-paypal-return?codex=intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      let result;
      try { result = await response.json(); } catch (_) { result = { error: 'Your intake could not be saved.' }; }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Your intake could not be saved.');

      form.hidden = true;
      status.textContent = german ? 'Danke. Dein privater Intake ist eingegangen. Wir bereiten deine gewählte Lesung innerhalb der genannten Lieferzeit vor.' : 'Thank you. Your private intake has been received. We will prepare your selected reading within the stated delivery time.';
    } catch (error) {
      message.textContent = error.message || 'Your intake could not be saved. Please try again.';
      submit.disabled = false;
    }
  });
})();
