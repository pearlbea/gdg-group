import { Seed, Property, html, TemplateResult } from "@nutmeg/seed";

export class GdgGroup extends Seed {
  @Property() public eventDate: string;
  @Property() public eventLink: string;
  @Property() public eventName: string;
  @Property() public groupName: string;
  @Property() public imageUrl: string;
  @Property() public imageWidth: string;
  @Property() public showNextEvent: boolean;
  @Property() public urlName: string;

  constructor() {
    super();
    this.imageUrl =
      this.imageUrl || "https://gdg-logo-generator.appspot.com/gdg_icon.svg";
    this.imageWidth = this.imageWidth || "70";
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
        self.groupName = self.groupName || json[0].name;
        const event = json[1][0];
        self.eventName = event.name;
        self.eventDate = event.local_date;
        self.eventLink = event.link;
      })
      .catch(err => self.handleError(err));
  }

  private handleError(err: any) {
    return err;
  }

  private monthWord(int: number) {
    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec"
    ];
    return month[int];
  }
  private get displayDate() {
    if (!this.eventDate) {
      return "";
    }
    const date = this.eventDate.split("-");
    const month = this.monthWord(Number(date[1]) - 1);
    const day = Number(date[2]);
    return `${month} ${day}`;
  }

  private get nextEvent(): TemplateResult {
    return html`
       <div class="event">
        <a href="${this.eventLink}">${this.displayDate} ${this.eventName}</a>
      </div>
    `;
  }
  /** Styling for the component. */
  public get styles(): TemplateResult {
    return html`
      <style>
          a {
            color: #000;
            text-decoration: none;
          }
          .content {
            align-items: center;
            display: flex;
            font-family: Open Sans, sans-serif;
            justify-content: flex-start;
          }
          .group-name {
            font-size: 1.5em;
            font-weight: 600;
          }
      </style>
    `;
  }

  /** HTML Template for the component. */
  public get template(): TemplateResult {
    return html`
      <div class="content">
        <img src="${this.imageUrl}" width="${this.imageWidth}" />
        <div class="wrapper">
          <a href="https://www.meetup.com/${this.urlName}/">
            <div class="group-name">${this.groupName}</div>
          </a>
          ${this.showNextEvent ? this.nextEvent : ""}
          <slot></slot>
        </div>
      </div>
    `;
  }
}

window.customElements.define("gdg-group", GdgGroup);
