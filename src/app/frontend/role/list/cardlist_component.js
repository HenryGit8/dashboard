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

import showAddDialog from "../add/addrole_dialog";

/**
 * @final
 */
class RoleCardListController {
  /** @export */
  constructor($state,$q,$mdDialog) {
    this.mdDialog_ = $mdDialog;
    this.q_ = $q;
    /** @export {!backendApi.RoleList} - Initialized from binding. */
    this.roleList;
    /** @export {!angular.Resource} - Initialized from binding. */
    this.roleListResource;
    this.ise;
    this.state = $state;
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

  addRoleDialog() {
    let deferred = this.q_.defer();

    showAddDialog(this.mdDialog_, "Role")
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
  addClusterRoleDialog() {
    let deferred = this.q_.defer();
    showAddDialog(this.mdDialog_, "ClusterRole")
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
 * @return {!angular.Component}
 */
export const roleCardListComponent = {
  transclude: {
    // Optional header that is transcluded instead of the default one.
    'header': '?kdHeader',
    // Optional zerostate content that is shown when there are zero items.
    'zerostate': '?kdEmptyListText',
  },
  controller: RoleCardListController,
  controllerAs: '$cardListCtrl',
  bindings: {
    'roleList': '<',
    'roleListResource': '<',
    'ise':'<',
  },
  templateUrl: 'role/list/cardlist.html',
};
