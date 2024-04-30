import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class TaggingQuestion extends DDD {
  static get tag() {
    return 'tagging-question';
  }

  constructor() {
    super();
    this.tagData = [];
    this.answerTags = [];
    this.correctAnswer = [];
  }

  firstUpdated() {
    fetch('tagdata.json')
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
          border: 3px solid #ccc;
          padding: 5px;
          margin-top: 5px;
          min-height: 80px;
        }
        
      `
    ];
  }

  render() {
    return html`
      <div class="interactive-element">
        
        <div class="image">
         <img src="./Hax-Logo.png" class="hax-icon" alt="Your Image">
        </div>
        <div class="question">
          <label for="tagging-input">Question: Which of the following big ideas would YOU associate with this artistic work? </label>
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
          <button class="check-answer" @click="${this.checkAnswer}">Check Answer</button>
          <button class="reset" @click="${this.reset}">Reset</button>
        </div>
      </div>
    `;
  }

  renderAvailableTags() {
    return this.tagData.map(tag => html`
      <div class="tag" draggable="true" @dragstart="${this.handleDragStart}" data-id="${tag.tag}">
        ${tag.tag}
      </div>
    `);
  }

  renderAnswerArea() {
    return this.answerTags.map(tag => html`
      <div class="tag">
        ${tag}
      </div>
    `);
  }

  renderFeedback() {
    if (this.correctAnswer.length > 0) {
      return html`
        <p>${this.correctAnswer[0].feedback}</p>
      `;
    } else {
      return '';
    }
  }

  handleDragStart(event) {
    const tagId = event.target.getAttribute('data-id');
    event.dataTransfer.setData('text/plain', tagId);

    //event.dataTransfer.setData('text/plain', event.target.textContent);
  }

  handleDrop(event) {
    event.preventDefault();
    const tagId = event.dataTransfer.getData('text/plain');
    if (!this.answerTags.includes(tagId)) {
      this.answerTags = [...this.answerTags, tagId];
      this.requestUpdate();
    }
  }

  //handleDrop(event) {
    //event.preventDefault();
    //const data = event.dataTransfer.getData('text/plain');
  //  const tagId = event.target.getAttribute('data-id');
   // if (!this.answerTags.includes(tagId)) {
    //  this.answerTags = [...this.answerTags, tagId];
     // this.tagData[tagId].draggable = false;
     
  //  }
   // this.requestUpdate();
//  }

  handleDragOver(event) {
    event.preventDefault();
  }

  checkAnswer() {
    this.correctAnswer = this.tagData.filter(tag => tag.correct && this.answerTags.includes(tag.tag));
    this.requestUpdate();
  }

  reset() {
    this.tagData.forEach(tag => {
      tag.draggable = true;
    });
    this.answerTags = [];
    this.correctAnswer = [];
    this.requestUpdate();
  }
}

customElements.define(TaggingQuestion.tag, TaggingQuestion);

    /*Make sure data uses, fetch.
    
    - Create an array of objects for title,image
    - Correct and Incorrect can be boolean values.
    - Answer tags should be draggable

    */
    