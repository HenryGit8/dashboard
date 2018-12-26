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

import showAddDialog from "../add/addsa_dialog";

/**
 * @final
 */
export class ServiceAccountCardListController {
  /**
   * @param {!./../../common/namespace/service.NamespaceService} kdNamespaceService
   * @ngInject
   */
  constructor(kdNamespaceService,$mdDialog,$state,$q) {
    /** @private {!./../../common/namespace/service.NamespaceService} */
    this.kdNamespaceService_ = kdNamespaceService;
    /** @export {!backendApi.ServiceAccountList} - Initialized from binding. */
    this.saList;
    /** @export {!angular.Resource} - Initialized from binding. */
    this.saListResource;
    this.mdDialog_ = $mdDialog;
    this.state = $state;
    this.q_ = $q;
  }

  /**
   * Returns select id string or undefined if list or list resource are not defined.
   * It is needed to enable/disable data select support (pagination, sorting) for particular list.
   *
   * @return {string}
   * @export
   */
  getSelectId() {
    const selectId = 'serviceAccounts';

    if (this.saList !== undefined && this.saListResource !== undefined) {
      return selectId;
    }

    return '';
  }

  /**
   * @return {boolean}
   * @export
   */
  areMultipleNamespacesSelected() {
    return this.kdNamespaceService_.areMultipleNamespacesSelected();
  }

  addSaDialog() {
    let deferred = this.q_.defer();
    showAddDialog(this.mdDialog_, "ServiceAccount")
    .then(() => {
      this.state.reload();
      deferred.resolve();
    })
    .catch((err) => {
      //this.editErrorCallback(err);
      deferred.reject(err);
    });
    return deferred.promise;
  }
}

/**
 * Definition object for the component that displays serviceAccount list card.
 *
 * @type {!angular.Component}
 */
export const serviceAccountCardListComponent = {
  transclude: {
    // Optional header that is transcluded instead of the default one.
    'header': '?kdHeader',
    // Optional zerostate content that is shown when there are zero items.
    'zerostate': '?kdEmptyListText',
  },
  templateUrl: 'serviceaccount/list/cardlist.html',
  controller: ServiceAccountCardListController,
  bindings: {
    /** {!backendApi.ServiceAccountList} */
    'saList': '<',
    'saListResource': '<',
  },
};
