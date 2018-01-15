import "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as moment from "moment";

let data = [
  {
    created: 1514823219000,
    duration: 7200000,
    id: "246372386",
    name: "Build a Web Component with Nutmeg",
    status: "upcoming",
    time: 1516060800000,
    local_date: "2018-01-15",
    local_time: "18:00",
    updated: 1514824815000,
    utc_offset: -21600000,
    waitlist_count: 0,
    yes_rsvp_count: 13,
    venue: {
      id: 25067449,
      name: "Bendyworks",
      lat: 43.074459075927734,
      lon: -89.38077545166016,
      repinned: false,
      address_1: "106 E Doty St",
      address_2: "Suite 200",
      city: "Madison",
      country: "us",
      localized_country_name: "USA",
      zip: "53703",
      state: "WI"
    },
    group: {
      created: 1487783398000,
      name: "GDG Madison",
      id: 22571140,
      join_mode: "open",
      lat: 43.08000183105469,
      lon: -89.37999725341797,
      urlname: "gdg-madison",
      who: "Members",
      localized_location: "Madison, WI",
      region: "en_US"
    },
    link: "https://www.meetup.com/gdg-madison/events/246372386/",
    description:
      '<p>• What we\'ll do<br/>Build, test, and deploy a web component using Nutmeg. Nutmeg is a tool that scaffolds a component with tests and best practices baked in. We will walk you through the process, and you will leave with a basic component that you can modify and build upon.</p> <p>• What to bring<br/>Laptop with Node version 8 or above installed (<a href="https://nodejs.org/en/" class="linkified">https://nodejs.org/en/</a>)</p> ',
    visibility: "public"
  }
];

describe("<gdg-group>", () => {
  let component;

  describe("with urlName only", () => {
    beforeEach(() => {
      component = fixture("<gdg-group urlName='gdg-madison'></gdg-group>");
      this.fakeFetch = sinon.stub(window, "fetch");
    });

    afterEach(() => {
      this.fakeFetch.restore();
    });

    it("should display group name", done => {
      this.fakeFetch.yields(JSON.stringify(data));
      this.fakeFetch("", res => {
        let json = JSON.parse(res);
        this.groupName = json[0].group.name;
        component.groupName = this.groupName;
      });
      expect(component.$(".content").innerText).to.include(this.groupName);
      done();
    });

    it("should not display next event", done => {
      this.fakeFetch.yields(JSON.stringify(data));
      this.fakeFetch("", res => {
        let json = JSON.parse(res);
        this.eventName = json[0].name;
        component.eventName = this.eventName;
      });
      expect(component.$(".content").innerText).to.not.include(this.eventName);
      done();
    });
  });

  describe("with showNextEvent", () => {
    beforeEach(() => {
      component = fixture(
        "<gdg-group showNextEvent urlName='gdg-madison'></gdg-group>"
      );
      this.fakeFetch = sinon.stub(window, "fetch");
    });

    afterEach(() => {
      this.fakeFetch.restore();
    });

    it("should display next event", done => {
      this.fakeFetch.yields(JSON.stringify(data));
      this.fakeFetch("", res => {
        let json = JSON.parse(res);
        this.eventName = json[0].name;
        component.eventName = this.eventName;
      });
      expect(component.$(".content").innerText).to.include(this.eventName);
      done();
    });

    it("should display a pretty date", done => {
      this.fakeFetch.yields(JSON.stringify(data));
      this.fakeFetch("", res => {
        let json = JSON.parse(res);
        this.eventDate = json[0].local_date;
        component.eventDate = this.eventDate;
      });
      let displayDate = moment(this.eventDate).format("MMM D");
      expect(component.$(".content").innerText).to.include(displayDate);
      done();
    });
  });

  describe("slot", () => {
    beforeEach(() => {
      component = fixture("<gdg-group>slot content</gdg-group>");
    });

    it("is rendered", () => {
      // Firefox has different output so testing for inclusion instead of exact match.
      expect(component.$("slot").assignedNodes()[0].wholeText).to.include(
        "slot content"
      );
      // TODO: Switch to simpler test when Firefox is no longer polyfilled.
      // expect(component.innerText).equal('slot content');
    });
  });
});

function fixture(tag: string): HTMLElement {
  function fixtureContainer(): HTMLElement {
    let div = document.createElement("div");
    div.classList.add("fixture");
    return div;
  }
  let fixture =
    document.body.querySelector(".fixture") ||
    document.body.appendChild(fixtureContainer());
  fixture.innerHTML = tag;
  return fixture.children[0] as HTMLElement;
}
