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
        .answer-area {
          border: 2px solid #ccc;
          padding: 10px;
          margin-top: 10px;
        }

        .tag {
          display: inline-block;
          background-color: #ddd;
          padding: 5px 10px;
          margin: 5px;
          cursor: move;
        }

        .hax-icon {
          height: 30%;
          width: 30%;
        }

        .answer-area {
          border: 3px solid hotpink;
          padding: 5px;
          margin-top: 5px;
          min-height: 80px;
        }
        .tag.correct {
          border: 2px solid green;
        }

        .tag.incorrect {
          border: 2px solid red;
        }

        .disabled {
          pointer-events: none; // Disable pointer events for tags in the answer area
          opacity: 0.5; // Optionally reduce opacity for disabled tags
        }
      `
    ];
  }

  render() {
    return html`
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
  

  /*handleDragStart(event) {
    const tagId = event.target.getAttribute('data-id');
    event.dataTransfer.setData('text/plain', tagId);
  }*/


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
    } else if (event.type === 'click') {
      // Handle click event to move tag between areas
      if (this.answerTags.includes(tagId)) {
        // Remove tag from solution area
        this.answerTags = this.answerTags.filter(tag => tag !== tagId);
      } else {
        // Move tag to solution area
        this.answerTags = [...this.answerTags, tagId];
      }
      this.requestUpdate();
    }
  }
  
  handleClick(event) {
    const tagId = event.target.getAttribute('data-id');
    const isAnswerArea = event.target.classList.contains('answer-area');
    
    if (isAnswerArea) {
      // Remove tag from solution area
      this.answerTags = this.answerTags.filter(tag => tag !== tagId);
      this.requestUpdate();
    } else {
      // Move tag to solution area
      if (!this.answerTags.includes(tagId)) {
        this.answerTags = [...this.answerTags, tagId];
        this.requestUpdate();
      }
    }
  }  

  /*handleDrop(event) {
    if (!this.answersChecked) {
      const tagId = event.dataTransfer.getData('text/plain');
      event.preventDefault();
      if (!this.answerTags.includes(tagId)) {
        this.answerTags = [...this.answerTags, tagId];
        this.requestUpdate();
      }
    }
  }*/

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
    this.requestUpdate(); 
  }

  reset() {
    // Shuffle the tagData array
    this.tagData = this.shuffleArray(this.tagData);
    
    // Set draggable property to true for all tags
    this.tagData.forEach(tag => {
      tag.draggable = true;
    });
    
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
