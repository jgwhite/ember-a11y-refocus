import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { schedule } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

const DEFAULT_PREDICATE = () => true;

export default class NavigationNarratorComponent extends Component {
  @service router;

  @tracked isSkipLinkFocused = false;

  get skipLink() {
    return this.args.skipLink ?? true;
  }

  get skipTo() {
    return this.args.skipTo ?? '#main';
  }

  get skipText() {
    return this.args.skipText ?? 'Skip to main content';
  }

  get navigationText() {
    return (
      this.args.navigationText ??
      'The page navigation is complete. You may now navigate the page content as you wish.'
    );
  }

  get predicate() {
    return this.args.predicate ?? DEFAULT_PREDICATE;
  }

  constructor() {
    super(...arguments);

    // focus on the navigation message after render
    this.router.on('routeDidChange', () => {
      let shouldFocus = this.predicate();

      if (!shouldFocus) {
        return;
      }

      schedule('afterRender', this, function () {
        document.body.querySelector('#ember-a11y-refocus-nav-message').focus();
      });
    });
  }

  @action
  handleSkipLinkFocus() {
    this.isSkipLinkFocused = !this.isSkipLinkFocused;
  }
}
