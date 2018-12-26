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
class SaRoleCardListController {
  /** @export */
  constructor($state,$q,$mdDialog,$mdSelect,$document,$resource,$timeout) {
    this.mdDialog_ = $mdDialog;
    this.q_ = $q;
    /** @export {!backendApi.RoleList} - Initialized from binding. */
    this.roleList;
    /** @export {!angular.Resource} - Initialized from binding. */
    this.roleListResource;
    this.state = $state;
    this.roles;
    this.clusterroles;
    this.selectNamespace;
    /** @private {!angular.$timeout} */
    this.timeout_ = $timeout;
    this.selectedNamespace;
    this.namespaceInput;
    /** @private {!angular.$document} */
    this.document_ = $document;
    /** @private {!angular.$resource} */
    this.resource_ = $resource;
    this.namespaces = [];
    this.mdSelect_ = $mdSelect;
  }

  selectNamespace() {
    if (this.namespaceInput.length > 0) {
      this.selectedNamespace = this.namespaceInput;
      this.namespaceInput = '';
      this.mdSelect_.hide();
    }
  }
  /**
   * Returns select id string or undefined if podList or podListResource are not defined.
   * It is needed to enable/disable data select support (pagination, sorting) for particular list.
   *
   * @return {string}
   * @export
   */
  getSelectId() {
    const selectId = 'roles';

    if (this.roleList !== undefined && this.roleListResource !== undefined) {
      return selectId;
    }

    return '';
  }


  /**
   * @return {string}
   * @export
   */
  formatNamespace() {
    let namespace = this.selectNamespace;
    return namespace;

  }

  /** @export */
  loadNamespacesIfNeeded() {
    this.focusNamespaceInput_();
    if (!this.namespacesInitialized_) {
      /** @type {!angular.Resource} */
      let resource = this.resource_('api/v1/namespace');

      return resource.get().$promise.then((namespaceList) => {
        this.namespaces = namespaceList.namespaces.map((n) => n.objectMeta.name);
        this.namespacesInitialized_ = true;
      });
    }
  }

  /**
   * Focuses namespace input field after clicking on namespace selector menu.
   *
   * @private
   */
  focusNamespaceInput_() {
    // Wrap in a timeout to make sure that element is rendered before looking for it.
    this.timeout_(() => {
      let elem = this.document_.find('md-select-menu').find('input');
      elem[0].focus();
    }, 150);
  }

}

/**
 * @return {!angular.Component}
 */
export const saRoleCardListComponent = {
  transclude: {
    // Optional header that is transcluded instead of the default one.
    'header': '?kdHeader',
    // Optional zerostate content that is shown when there are zero items.
    'zerostate': '?kdEmptyListText',
  },
  controller: SaRoleCardListController,
  controllerAs: '$cardListCtrl',
  bindings: {
    'roleList': '<',
    'roleListResource': '<',
    'roles': '=',
    'clusterroles': '=',
    'selectNamespace': '='
  },
  templateUrl: 'serviceaccount/rolelist/cardlist.html',
};
