import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQuestion extends DDD {
  static get tag() {
    return 'tagging-question';
  }

  constructor() {
    super();
    this.image = "image";
    this.question = "question";
    this.tagData = [];
    this.answerTags = [];
    this.correctAnswer = [];
    this.jsonURL = "./";
    this.answersChecked = false; // Flag to track whether answers have been checked
  }

  firstUpdated() {
    fetch(this.jsonURL)
      .then(response => response.json())
      .then(data => {
        console.log("collecting data")
        console.log(data)
        this.tagData = data;
        this.requestUpdate();
      })
      .catch(error => {
        console.error('Error fetching tag data:', error);
      });
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .tag {
          display: inline-block;
          background-color: var(--ddd-theme-default-limestoneLight);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-5);
          margin: var(--ddd-spacing-2);
          transform: scale(1.1);
          cursor: move;
        }
        .tag:hover{
          background-color: var(--ddd-theme-default-creekLight) ;
        }
        .tags-container {
          flex-direction: column; /* Stack tags vertically on smaller screens */
          }
        

        .hax-icon {
          height: 30%;
          width: 30%;
        }

        .answer-area {
          border: 3px solid var(--ddd-theme-default-shrineTan);
          border-radius:var(--ddd-radius-md);
          padding: var(--ddd-spacing-5);
          margin-top: var(--ddd-spacing-5);
          min-height: 80px;
          background-color: var(--ddd-theme-default-alertUrgent);
        }

        .tag.correct {
          border: 2px solid var(--ddd-theme-default-opportunityGreen);
        }

        .tag.incorrect {
          border: 2px solid var(--ddd-theme-default-original87Pink) ;
        }
        .check-answer:hover {
        margin-top: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
        background-color: var(--ddd-theme-default-futureLime); 
        color: var(--ddd-theme-default-white);
        transform: scale(1.1); 
        cursor: pointer;
        }

       
        .reset:hover {
        margin-top: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-1) var(--ddd-spacing-1);
        background-color: var(--ddd-theme-default-athertonViolet); 
        color: var(--ddd-theme-default-white);
        transform: scale(1.1); 
        cursor: pointer;
        }

        .disabled {
          background-color: var(--ddd-theme-default-limestoneGray);
          pointer-events: none; // Disable pointer events for tags in the answer area
          opacity: 0.5; // Optionally reduce opacity for disabled tags
        }
        .question {
          font-weight: bold;
          font-size:var(--ddd-spacing-5);
        }
       
      `
    ];
  }

  render() {
    return html`
      <confetti-container id="confetti">
        <div class="interactive-element">
          <div class="image">
            <img src="${this.image}" class="hax-icon">
          </div>
          <div class="question">
            <p>${this.question}</p>  
          </div>
          <div class="tags-container">
            <div class="tags">
              ${this.renderAvailableTags()}
            </div>
            <div class="answer-area" @drop="${this.handleDrop}" @dragover="${this.handleDragOver}">
              ${this.renderAnswerArea()}
            </div>
          </div>
          <div class="feedback">
            ${this.renderFeedback()}
          </div>
          <div class="buttons">
            <button class="check-answer" @click="${this.checkAnswer}" ?disabled="${this.answersChecked}">Check Answer</button>
            <button class="reset" @click="${this.reset}">Reset</button>
          </div>
        </div>
      </confetti-container>
    `;
  }

  renderAvailableTags() {
    return this.tagData.map(tag => html`
      <div class="tag" draggable="true" @dragstart="${this.handleDragStart}" @click="${this.handleClick}" data-id="${tag.tag}">
        ${tag.tag}
      </div>
    `);
  }

  renderAnswerArea() {
    return this.answerTags.map(tag => html`
      <div class="tag ${this.answersChecked ? 'disabled' : ''}" @click="${this.removeTagFromAnswerArea}">
        ${tag}
      </div>
    `);
  }

  handleDragStart(event) {
    const tagId = event.target.getAttribute('data-id');
    event.dataTransfer.setData('text/plain', tagId);
  }

  handleDrop(event) {
    event.preventDefault();
    const tagId = event.dataTransfer.getData('text/plain');
    const isAnswerArea = event.target.classList.contains('answer-area');
    
    if (isAnswerArea) {
      // Move tag to solution area
      if (!this.answerTags.includes(tagId)) {
        this.answerTags = [...this.answerTags, tagId];
        this.requestUpdate();
      }
    }
  }
  
  handleClick(event) {
    const tagId = event.target.getAttribute('data-id');
    const isAnswerArea = event.target.classList.contains('answer-area');
    
    if (isAnswerArea) {
      // Remove tag from solution area
      this.toggleAnswer(tagId);
    } else {
      // Move tag to solution area
      if (!this.answerTags.includes(tagId)) {
        this.answerTags = [...this.answerTags, tagId];
        this.requestUpdate();
      }
    }
  }  

  toggleAnswer(tagId) {
    if (this.answerTags.includes(tagId)) {
      this.answerTags = this.answerTags.filter(tag => tag !== tagId);
    } else {
      this.answerTags = [...this.answerTags, tagId];
    }
    this.requestUpdate();
  }

  handleDragOver(event) {
    event.preventDefault();
  }

  checkAnswer() {
    // Reset styles before checking
    this.shadowRoot.querySelectorAll('.tag').forEach(tag => {
      tag.classList.remove('correct', 'incorrect');
    });
  
    this.correctAnswer = [];
    this.answerTags.forEach(tag => {
      const isCorrect = this.tagData.find(t => t.tag === tag).correct;
      const feedback = this.tagData.find(t => t.tag === tag).feedback;
      this.correctAnswer.push({ tag, isCorrect, feedback });
      this.shadowRoot.querySelector(`.tag[data-id="${tag}"]`).classList.add(isCorrect ? 'correct' : 'incorrect');
    });
  
    this.answersChecked = true; // Disable dragging into answer area
  
    // Check if all answers are correct
    const allCorrect = this.correctAnswer.every(entry => entry.isCorrect);
    if (allCorrect) {
      this.makeItRain(); // Trigger confetti effect
    }
  
    this.requestUpdate(); 
  }

  reset() {
    // Shuffle the tagData array
    this.tagData = this.shuffleArray(this.tagData);
    
    // Clear answerTags and correctAnswer arrays
    this.answerTags = [];
    this.correctAnswer = [];
    
    // Remove correct and incorrect classes from all tags
    this.shadowRoot.querySelectorAll('.tag').forEach(tag => {
      tag.classList.remove('correct', 'incorrect');
    });

    this.answersChecked = false; // Enable dragging into answer area
    this.requestUpdate();
  }

  removeTagFromAnswerArea(event) {
    if (!this.answersChecked) {
      const tagToRemove = event.target.textContent;
      this.answerTags = this.answerTags.filter(tag => tag !== tagToRemove);
      this.requestUpdate();
    }
  }

  renderFeedback() {
    if (this.correctAnswer.length > 0) {
      return html`
        <div class="feedback">
          ${this.correctAnswer.map(entry => html`<p>${entry.feedback}</p>`)}
        </div>
      `;
    } else {
      return html``;
    }
  }

  makeItRain() {
    const allCorrect = this.correctAnswer.every(entry => entry.isCorrect);
  
    if (allCorrect) {
      import('@lrnwebcomponents/multiple-choice/lib/confetti-container.js').then((module) => {
        setTimeout(() => {
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      });
    }
  }

  static get properties() {
    return {
      ...super.properties,
      image: { type: String, reflect: true },
      question: { type: String, reflect: true },
      tagData: { type: Array },
      answerTags: { type: Array },
      correctAnswer: { type: Array },
      jsonURL: { type: String }
    }
  }
}

customElements.define(TaggingQuestion.tag, TaggingQuestion);
