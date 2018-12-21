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

import showMyEditDialog from '../detailedit/editrole_dialog';
/**
 * @final
 */
export default class RoleInfoController {
  /**
   * Constructs rolebinding info object.
   */
  constructor($mdDialog, $q,$state) {
    this.mdDialog_ = $mdDialog;
    /** @private {!angular.$q} */
    this.q_ = $q;
    /**
     * Rolebinding details. Initialized from the scope.
     * @export {!backendApi.RolebindingDetail}
     */
    this.role;
    this.state = $state;
  }

  thisShowEditDialog() {
    let ro = this.role;
    ro.kind = this.role.kind.toLowerCase();
    let deferred = this.q_.defer();

    showMyEditDialog(this.mdDialog_, "Role", getRawResourceUrl(ro, this.role.metadata),this.state)
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
 * Create a string with the resource url for the given resource
 * @param {!backendApi.TypeMeta} typeMeta
 * @param {!backendApi.ObjectMeta} objectMeta
 * @return {string}
 */
function getRawResourceUrl(typeMeta, objectMeta) {
  let resourceUrl = `api/v1/_raw/${typeMeta.kind}`;
  if (objectMeta.namespace !== undefined) {
    resourceUrl += `/namespace/${objectMeta.namespace}`;
  }
  resourceUrl += `/name/${objectMeta.name}`;
  return resourceUrl;
}

/**
 * Definition object for the component that displays replica set info.
 *
 * @type {!angular.Component}
 */
export const roleInfoComponent = {
  controller: RoleInfoController,
  templateUrl: 'role/detail/info.html',
  bindings: {
    'role': '=',
  },
};
