import { createElement } from 'lwc';
import DependentPicklist from 'c/dependentPicklist';

const initCmp = (
  el,
  {
    objectApiName = 'Case',
    parentFieldName = 'Type',
    childFieldName = 'Subtype__c'
  }
) => {
  const cmp = createElement('c-dependent-picklist', {
    is: el
  });

  cmp.objectApiName = objectApiName;
  cmp.parentFieldName = parentFieldName;
  cmp.childFieldName = childFieldName;

  document.body.appendChild(cmp);
  return cmp;
};

describe('c-dependent-picklist', () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it('constructs', () => {
    const cmp = initCmp(DependentPicklist, {});

    const inputs = cmp.shadowRoot.querySelectorAll('lightning-input-field');
    expect(inputs.length).toBe(2);
  });
});
