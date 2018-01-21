import "mocha";
import { expect } from "chai";
import * as sinon from "sinon";
import * as moment from "moment";

describe("<gdg-group>", () => {
  let component, stub;

  beforeEach(async () => {
    let response = await fetch("./base/test/test-data.json");
    stub = sinon.stub(window, "fetch").resolves(response);
  });

  afterEach(() => {
    stub.restore();
  });

  describe("with urlName only", () => {
    beforeEach(async () => {
      component = await timeout(
        fixture("<gdg-group urlName='gdg-madison'></gdg-group>")
      );
    });

    it("should display group name", () => {
      expect(component.$(".content").innerText).to.include("GDG Madison");
    });

    it("should not display next event", () => {
      expect(component.$(".content").innerText).to.not.include(
        "Build a Web Component with Nutmeg"
      );
    });
  });

  describe("with showNextEvent", () => {
    beforeEach(async () => {
      component = await timeout(
        fixture("<gdg-group urlName='gdg-madison' showNextEvent></gdg-group>")
      );
    });

    it("should display next event", () => {
      expect(component.$(".content").innerText).to.include(
        "Build a Web Component with Nutmeg"
      );
    });

    it("should display a pretty date", () => {
      let displayDate = moment("2018-01-15").format("MMM D");
      expect(component.$(".content").innerText).to.include(displayDate);
    });
  });

  describe("with groupName", () => {
    beforeEach(async () => {
      component = await timeout(
        fixture(
          "<gdg-group urlName='gdg-madison' groupName='maddy'></gdg-group>"
        )
      );
    });

    it("should display a custom", () => {
      expect(component.$(".content").innerText).to.include("maddy");
    });
  });

  describe("with custom Image", () => {
    beforeEach(async () => {
      component = await timeout(
        fixture(
          "<gdg-group urlName='gdg-madison' imageUrl='https://cdn.pixabay.com/photo/2017/12/14/14/02/cat-3019090_1280.jpg' imageWidth='100'></gdg-group>"
        )
      );
    });

    it("should set the custom url", () => {
      expect(component.$(".content img").src).to.equal(
        "https://cdn.pixabay.com/photo/2017/12/14/14/02/cat-3019090_1280.jpg"
      );
    });

    it("should set the custom image width", () => {
      expect(component.$(".content img").width).to.equal(100);
    });
  });

  describe("slot", () => {
    beforeEach(async () => {
      component = await timeout(fixture("<gdg-group>slot content</gdg-group>"));
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

function timeout(fn) {
  return new Promise(resolve => {
    window.setTimeout(() => {
      resolve(fn);
    }, 100);
  });
}

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
