import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class taggingquestion extends DDD {
    static get tag() {
        return 'tagging-question';
      }

      constructor() {
        super();
        this.tagData = []; // Array to hold tag data fetched from JSON
        this.answerTags = []; // Array to hold tags in the answer area
      }
    
      firstUpdated() {
        /* The user should be able to fetch data from a JSON File*/
        fetch('tag_data.json')
          .then(response => response.json())
          .then(data => {
            /* Store fetched data in the tagData property*/
            this.tagData = data;
            this.requestUpdate(); /* Update the component to render fetched data*/
          })
          .catch(error => {
            console.error('Error fetching tag data:', error);
          });
      }
    
      static get styles() {
        return [
          super.styles,
          css`
            /* Need to make sure styles follow the DDD pattern. */
            .answer-area {
              border: 2px solid #ccc;
              padding: 10px;
              margin-top: 10px;
            }
          `
        ];
      }
    
      render() {
        return html`
          <div class="interactive-element">
            <div class="question">
            <label for="tagging-input">Question:</label>
              <input type="text" id="tagging-input" placeholder="Type your answer here...">
            </div>
            <div class="image"></div>
            <div class="tags-container">
              <div class="tags">
                <!-- Available tags to choose from should also update and visible to the user -->
                ${this.renderAvailableTags()}
              </div>
              <div class="answer-area" @drop="${this.handleDrop}" @dragover="${this.handleDragOver}">
                <!-- Answer area for draggable tags -->
                ${this.renderAnswerArea()}
              </div>
            </div>
            <div class="buttons">
              <button class="check-answer">Check Answer</button>
              <button class="reset">Reset</button>
            </div>
            <div class="feedback">
              <!-- Feedback for correct and incorrect answers -->
            </div>
          </div>
        `;
      }
    
      renderAvailableTags() {
        return this.tagData.map(tag => html`
          <div class="tag" draggable="true" @dragstart="${this.handleDragStart}">
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
    
      handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.textContent);
      }
    
      handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData('text/plain');
        if (!this.answerTags.includes(data)) {
          this.answerTags = [...this.answerTags, data];
          this.requestUpdate();
        }
      }
    
      handleDragOver(event) {
        event.preventDefault();
      }
    }
    
    customElements.define(taggingquestion.tag, taggingquestion);


    /*Make sure data uses, fetch.
    
    - Create an array of objects for title,image
    - Correct and Incorrect can be boolean values.
    - Answer tags should be draggable

    */
    

