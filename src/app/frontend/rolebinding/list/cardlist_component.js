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
 * @final
 */
export class RolebindingCardListController {
  /**
   * @ngInject
   * @param {!./../../common/namespace/service.NamespaceService} kdNamespaceService
   */
  constructor(kdNamespaceService) {
    /**
     * List of rolebindings. Initialized from the scope.
     */
    this.rolebindingList;

    /** @export {!angular.Resource} Initialized from binding. */
    this.rolebindingListResource;

    /** @private {!./../../common/namespace/service.NamespaceService} */
    this.kdNamespaceService_ = kdNamespaceService;
  }

  /**
   * Returns select id string or undefined if rolebindingList or rolebindingListResource are not defined.
   * It is needed to enable/disable data select support (pagination, sorting) for particular list.
   *
   * @return {string}
   * @export
   */
  getSelectId() {
    const selectId = 'rolebindings';

    if (this.rolebindingList !== undefined && this.rolebindingListResource !== undefined) {
      return selectId;
    }

    return '';
  }

  /**
   * @return {boolean}
   * @export
   */
  showMetrics() {
    if (this.rolebindingList.rolebindings && this.rolebindingList.rolebindings.length > 0) {
      let firstRolebinding = this.rolebindingList.rolebindings[0];
      return !!firstRolebinding.metrics;
    }
    return false;
  }

  /**
   * @return {boolean}
   * @export
   */
  areMultipleNamespacesSelected() {
    return this.kdNamespaceService_.areMultipleNamespacesSelected();
  }
}

/**
 * Definition object for the component that displays rolebindings list card.
 *
 * Rolebinding list factory should expose endpoint that will return list of rolebindings (all or related to some
 * resource).
 *
 * @type {!angular.Component}
 */
export const rolebindingCardListComponent = {
  transclude: {
    // Optional header that is transcluded instead of the default one.
    'header': '?kdHeader',
    // Optional zerostate content that is shown when there are zero items.
    'zerostate': '?kdEmptyListText',
  },
  templateUrl: 'rolebinding/list/cardlist.html',
  controller: RolebindingCardListController,
  bindings: {
    'rolebindingList': '<',
    /** {!angular.Resource} */
    'rolebindingListResource': '<',
    /** {boolean} */
    'selectable': '<',
    /** {boolean} */
    'withStatuses': '<',
  },
};
