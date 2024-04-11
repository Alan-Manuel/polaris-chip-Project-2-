import { LitElement, html, css } from 'lit';
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

export class taggingquestion extends DDD {
    static get tag() {
        return 'tagging-question';
      }

      constructor() {

      }

      constructor() {
        super();
        
      
      }
    
      static get styles() {
        return [
          super.styles,
          css`
           
          `
        ];
      }
    
      
      
    render() {
      return html`
          <confetti-container id="confetti">
          
          </confetti-container>
      `;
    }
      makeItRain() {
        import('@lrnwebcomponents/multiple-choice/lib/confetti-container.js').then((module) => {
          setTimeout(() => {
            this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
          }, 0);
        });
      }
    
    
      static get properties() {
        return {
          ...super.properties,
        
        };
      }
      
    }
    
    customElements.define(taggingquestion.tag, taggingquestion);
    

