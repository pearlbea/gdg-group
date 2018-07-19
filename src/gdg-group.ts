import { Seed, Property, html, TemplateResult } from "@nutmeg/seed";
import {
  Failure,
  fold,
  Initialized,
  Pending,
  RemoteData,
  Success
} from "@abraham/remotedata";

interface GDGGroupEvent {
  name: string;
  local_date: string;
  link: string;
}

interface GDGGroupData {
  name: string;
  nextEvent: GDGGroupEvent;
}

interface ErrorResponse {
  message: string;
}

type State = RemoteData<ErrorResponse, GDGGroupData>;

export class GdgGroup extends Seed {
  @Property() public eventDate: string;
  @Property() public eventLink: string;
  @Property() public eventName: string;
  @Property() public groupName: string;
  @Property() public imageUrl: string;
  @Property() public imageWidth: string;
  @Property() public showNextEvent: boolean;
  @Property() public urlName: string;

  private state: State = new Initialized();
  private ROOT_URL: string = "https://gdg-group-72e25.firebaseapp.com/meetup/";

  constructor() {
    super();
  }

  /** The component instance has been inserted into the DOM. */
  public connectedCallback() {
    super.connectedCallback();
    this.getData();
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

  // need to define interface for returned data
  private async getData() {
    this.state = new Pending();
    const response = await fetch(`${this.ROOT_URL}${this.urlName}`);
    if (response) {
      const gdgData: GDGGroupData = await response.json();
      this.state = new Success(gdgData);
      this.setValues(gdgData);
    } else {
      this.state = new Failure(response);
    }
  }

  private get view(): (state: State) => TemplateResult {
    return fold<TemplateResult, ErrorResponse, GDGGroupData>(
      () => html`Initialized`,
      () => html`Loading...`,
      (error: ErrorResponse) => this.errMessage(error),
      (data: GDGGroupData) => this.content()
    );
  }

  private setValues(data: GDGGroupData) {
    this.imageUrl =
      this.imageUrl || "https://gdg-logo-generator.appspot.com/gdg_icon.svg";
    this.imageWidth = this.imageWidth || "70";
    this.groupName = this.groupName || data.name;
    const event = data.nextEvent;
    if (event) {
      this.eventName = event.name;
      this.eventDate = event.local_date;
      this.eventLink = event.link;
    }
  }

  private errMessage(err: any) {
    return html`${err}`;
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

  public content(): TemplateResult {
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

  /** HTML Template for the component. */
  public get template(): TemplateResult {
    return this.view(this.state);
  }
}

window.customElements.define("gdg-group", GdgGroup);
