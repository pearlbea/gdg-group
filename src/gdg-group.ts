import { Seed, Property, html, TemplateResult } from "@nutmeg/seed";
import * as moment from "moment";

export class GdgGroup extends Seed {
  @Property() public showNextEvent: boolean;
  @Property() public urlName: string;
  @Property() public groupName: string;
  @Property() public eventName: string;
  @Property() public eventDate: string;

  constructor() {
    super();
  }

  /** The component instance has been inserted into the DOM. */
  public connectedCallback() {
    super.connectedCallback();
    this.fetchGDGInfo();
  }

  /** The component instance has been removed from the DOM. */
  public disconnectedCallback() {
    super.disconnectedCallback();
  }

  /** Watch for changes to these attributes. */
  public static get observedAttributes(): string[] {
    return super.observedAttributes;
  }

  /** Rerender when the observed attributes change. */
  public attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private fetchGDGInfo(): void {
    let self = this;
    fetch(`https://gdg-group-72e25.firebaseapp.com/meetup/${this.urlName}`)
      .then(res => {
        return res.json();
      })
      .then(json => {
        self.groupName = json[0].name;
        self.eventName = json[1][0].name;
        self.eventDate = json[1][0].local_date;
      })
      .catch(err => self.handleError(err));
  }

  private handleError(err: any) {
    return err;
  }

  private get displayDate() {
    if (!this.eventDate) {
      return "";
    }
    return `${moment(this.eventDate).format("MMM D")}:`;
  }

  private get nextEvent(): TemplateResult {
    return html`
       <div class="event">${this.displayDate} ${this.eventName}</div>
    `;
  }
  /** Styling for the component. */
  public get styles(): TemplateResult {
    return html`
      <style>
          a {
            align-items: center;
            color: black;
            display: flex;
            font-family: Open Sans, sans-serif;
            justify-content: flex-start;
            text-decoration: none;
          }
          h1, .event {
            margin: 0;
          }
      </style>
    `;
  }

  /** HTML Template for the component. */
  public get template(): TemplateResult {
    return html`
      <div class="content">
        <a href="https://www.meetup.com/${this.urlName}/">
          <img src="https://gdg-logo-generator.appspot.com/gdg_icon.svg" width="70px"/>
          <div>
            <h1>${this.groupName}</h1>
            ${this.showNextEvent ? this.nextEvent : ""}
            <slot></slot>
          </div>
        </a>
      </div>
    `;
  }
}

window.customElements.define("gdg-group", GdgGroup);
