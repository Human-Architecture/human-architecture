(() => {
  const isGerman = () => new URLSearchParams(window.location.search).get('lang') === 'de';

  const copy = {
    en: {
      recognitionEyebrow: 'RECOGNITION',
      recognitionTitle: 'Same world. Different people. Different needs.',
      recognitionIntro: 'The same situation can ask something different of each person. Human Architecture creates space to look at what is present without reducing you to a type, label or single explanation.',
      recognitionItems: [
        ['Stress', 'How demand, pace and recovery are experienced.'],
        ['Body & movement', 'How physical needs and everyday movement show up.'],
        ['Relationships', 'How connection, boundaries and roles are lived.'],
        ['Decisions', 'How priorities and choices are approached.'],
        ['Environment', 'How spaces, rhythms and conditions shape daily life.']
      ],
      perspectivesEyebrow: 'A CLEARER FIRST VIEW',
      perspectivesTitle: 'Everything is connected. The individual is at the centre.',
      perspectivesIntro: 'These five perspectives offer a simple first language for looking at a wider human context. They are an invitation to observe, not a fixed classification.',
      perspectives: [
        ['Body', 'Movement, rest and lived physical experience.'],
        ['Patterns & behaviour', 'Recurring ways of responding, interpreting and organising.'],
        ['Relationships', 'Connection, dynamics, roles and boundaries.'],
        ['Environment', 'Spaces, rhythms and conditions around everyday life.'],
        ['Direction & decisions', 'Priorities, transitions and the choices in front of you.']
      ],
      systemEyebrow: 'THE HUMAN SYSTEM',
      systemTitle: 'Explore the complete Human System.',
      systemIntro: 'The wider system brings eight connected dimensions into view.'
    },
    de: {
      recognitionEyebrow: 'WIEDERERKENNEN',
      recognitionTitle: 'Gleiche Welt. Unterschiedliche Menschen. Unterschiedliche Bedürfnisse.',
      recognitionIntro: 'Dieselbe Situation kann von jedem Menschen etwas anderes verlangen. Human Architecture schafft Raum, um das Gegenwärtige zu betrachten – ohne dich auf einen Typ, ein Label oder eine einzelne Erklärung zu reduzieren.',
      recognitionItems: [
        ['Stress', 'Wie Anforderungen, Tempo und Erholung erlebt werden.'],
        ['Körper & Bewegung', 'Wie körperliche Bedürfnisse und Bewegung im Alltag spürbar werden.'],
        ['Beziehungen', 'Wie Verbindung, Grenzen und Rollen gelebt werden.'],
        ['Entscheidungen', 'Wie Prioritäten und Entscheidungen angegangen werden.'],
        ['Umfeld', 'Wie Räume, Rhythmen und Bedingungen den Alltag mitprägen.']
      ],
      perspectivesEyebrow: 'EIN KLARER ERSTER BLICK',
      perspectivesTitle: 'Alles hängt zusammen. Der Mensch steht im Mittelpunkt.',
      perspectivesIntro: 'Diese fünf Perspektiven bieten eine einfache erste Sprache für einen umfassenderen menschlichen Kontext. Sie laden zum Beobachten ein, nicht zu einer festen Einordnung.',
      perspectives: [
        ['Körper', 'Bewegung, Ruhe und gelebte körperliche Erfahrung.'],
        ['Muster & Verhalten', 'Wiederkehrende Arten zu reagieren, wahrzunehmen und zu organisieren.'],
        ['Beziehungen', 'Verbindung, Dynamiken, Rollen und Grenzen.'],
        ['Umfeld', 'Räume, Rhythmen und Bedingungen des Alltags.'],
        ['Richtung & Entscheidungen', 'Prioritäten, Übergänge und die Entscheidungen, die vor dir liegen.']
      ],
      systemEyebrow: 'DAS MENSCHLICHE SYSTEM',
      systemTitle: 'Das vollständige Human System entdecken.',
      systemIntro: 'Das umfassendere System bringt acht verbundene Dimensionen in den Blick.'
    }
  };

  const cards = (items, className) => items.map(([title, description]) => `
    <article class="${className}__item">
      <h3>${title}</h3>
      <p>${description}</p>
    </article>`).join('');

  const render = () => {
    const language = isGerman() ? 'de' : 'en';
    const text = copy[language];
    const entry = document.querySelector('#find-your-way');
    const philosophy = document.querySelector('#philosophy');
    const system = document.querySelector('#human-system');

    if (entry && !document.querySelector('#recognition')) {
      const recognition = document.createElement('section');
      recognition.id = 'recognition';
      recognition.className = 'homepage-recognition';
      recognition.setAttribute('aria-labelledby', 'recognition-title');
      entry.insertAdjacentElement('afterend', recognition);
    }

    const recognition = document.querySelector('#recognition');
    if (recognition) {
      recognition.innerHTML = `
        <div class="homepage-directive__inner">
          <p class="homepage-directive__eyebrow">${text.recognitionEyebrow}</p>
          <h2 id="recognition-title">${text.recognitionTitle}</h2>
          <p class="homepage-directive__intro">${text.recognitionIntro}</p>
          <div class="homepage-recognition__grid">${cards(text.recognitionItems, 'homepage-recognition')}</div>
        </div>`;
    }

    if (philosophy && !document.querySelector('#human-perspectives')) {
      const perspectives = document.createElement('section');
      perspectives.id = 'human-perspectives';
      perspectives.className = 'homepage-perspectives';
      perspectives.setAttribute('aria-labelledby', 'human-perspectives-title');
      philosophy.insertAdjacentElement('afterend', perspectives);
    }

    const perspectives = document.querySelector('#human-perspectives');
    if (perspectives) {
      perspectives.innerHTML = `
        <div class="homepage-directive__inner">
          <p class="homepage-directive__eyebrow">${text.perspectivesEyebrow}</p>
          <h2 id="human-perspectives-title">${text.perspectivesTitle}</h2>
          <p class="homepage-directive__intro">${text.perspectivesIntro}</p>
          <div class="homepage-perspectives__grid">${cards(text.perspectives, 'homepage-perspectives')}</div>
        </div>`;
    }

    if (system) {
      const eyebrow = system.querySelector('.section-marker p');
      const title = system.querySelector('#system-title');
      const intro = system.querySelector('.system-intro p');
      if (eyebrow) eyebrow.textContent = text.systemEyebrow;
      if (title) title.textContent = text.systemTitle;
      if (intro) intro.textContent = text.systemIntro;
    }
  };

  document.addEventListener('DOMContentLoaded', render);
  window.addEventListener('popstate', render);
})();
