import 'mocha';
import { expect } from 'chai';

describe('<gdg-group>', () => {
  let component;

  describe('without properties', () => {
    beforeEach(() => {
      component = fixture('<gdg-group></gdg-group>');
    });

    it('renders default', () => {
      expect(component.$('.content').innerText).to.include('Welcome to <gdg-group>');
    });
  });

  
  describe('showNextEvent', () => {
    beforeEach(() => {
      component = fixture('<gdg-group showNextEvent></gdg-group>');
    });

    it('is rendered', () => {
      expect(component.$('.content').innerText).to.include('showNextEvent: true');
    });
  });

  describe('urlName', () => {
    beforeEach(() => {
      component = fixture('<gdg-group urlName="Pickle"></gdg-group>');
    });

    it('is rendered', () => {
      expect(component.$('.content').innerText).to.include('urlName: Pickle');
    });
  });


  describe('slot', () => {
    beforeEach(() => {
      component = fixture('<gdg-group>slot content</gdg-group>');
    });

    it('is rendered', () => {
      // Firefox has different output so testing for inclusion instead of exact match.
      expect(component.$('slot').assignedNodes()[0].wholeText).to.include('slot content');
      // TODO: Switch to simpler test when Firefox is no longer polyfilled.
      // expect(component.innerText).equal('slot content');
    });
  });

  describe('--gdg-group-background-color', () => {
    describe('with default', () => {
      beforeEach(() => {
        component = fixture('<gdg-group></gdg-group>');
      });

      it('is set', () => {
        expect(getComputedStyle(component.$('.content')).backgroundColor).equal('rgb(250, 250, 250)');
      });
    });

    describe('with outside value', () => {
      beforeEach(() => {
        component = fixture(`
          <div>
            <style>
              gdg-group.blue {
                --gdg-group-background-color: #03A9F4;
              }
            </style>
            <gdg-group class="blue"></gdg-group>
          </div>
        `).querySelector('gdg-group');
      });

      it('is set', () => {
        expect(getComputedStyle(component.$('.content')).backgroundColor).equal('rgb(3, 169, 244)');
      });
    });
  });
});

function fixture(tag: string): HTMLElement {
  function fixtureContainer(): HTMLElement {
    let div = document.createElement('div');
    div.classList.add('fixture');
    return div;
  }
  let fixture = document.body.querySelector('.fixture') || document.body.appendChild(fixtureContainer());
  fixture.innerHTML = tag;
  return fixture.children[0] as HTMLElement;
}
