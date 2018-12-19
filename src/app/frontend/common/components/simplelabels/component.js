// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Number of simplelabels, that are always visible.
 * @type {number}
 */
const alwaysVisibleSimplelabelsNumber = 15;

/**
 * Regular expression for URL validation created by @dperini.
 * https://gist.github.com/dperini/729294
 *
 * @type {RegExp}
 */
const urlRegexp = new RegExp(
    '^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)' +
        '(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|' +
        '22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?' +
        ':(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u' +
        '00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$',
    'i');

/**
 * @final
 */
export default class SimplelabelsController {
  /**
   * Constructs simplelabels controller.
   * @ngInject
   */
  constructor() {
    /** @export {!Object<string, string>} Initialized from the scope. */
    this.simplelabels;

    /** @private {boolean} */
    this.isShowingAllSimplelabels_ = false;
  }

  /**
   * Returns true if element at index position should be visible.
   *
   * @param {number} index
   * @return {boolean}
   * @export
   */
  isVisible(index) {
    return this.isShowingAllSimplelabels_ || index < alwaysVisibleSimplelabelsNumber;
  }

  /**
   * Returns true if more simplelabels than alwaysVisibleSimplelabelsNumber is available.
   *
   * @return {boolean}
   * @export
   */
  isMoreAvailable() {
    return Object.keys(this.simplelabels).length > alwaysVisibleSimplelabelsNumber;
  }

  /**
   * Returns true if all simplelabels are showed.
   *
   * @return {boolean}
   * @export
   */
  isShowingAll() {
    return this.isShowingAllSimplelabels_;
  }

  /**
   * Switches simplelabels view between two states, which are showing only alwaysVisibleSimplelabelsNumber of
   * simplelabels and showing all simplelabels.
   *
   * @export
   */
  switchSimplelabelsView() {
    this.isShowingAllSimplelabels_ = !this.isShowingAllSimplelabels_;
  }

  /**
   * Returns true if given value is URL.
   *
   * @return {boolean}
   * @export
   */
  isHref(value) {
    return urlRegexp.test(value.trim());
  }
}

/**
 * Simplelabels component definition.
 *
 * @type {!angular.Component}
 */
export const simplelabelComponent = {
  bindings: {
    'simplelabels': '=',
  },
  controller: SimplelabelsController,
  controllerAs: 'simplelabelsCtrl',
  templateUrl: 'common/components/simplelabels/simplelabels.html',

};
