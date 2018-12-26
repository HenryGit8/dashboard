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

import {StateParams} from '../../common/resource/resourcedetail';
import {stateName} from '../../serviceaccount/detail/state';

class ServiceAccountCardController {
  /**
   * @param {!./../../common/namespace/service.NamespaceService} kdNamespaceService
   * @param {!ui.router.$state} $state
   * @ngInject
   */
  constructor($state, kdNamespaceService, kdResourceVerberService, $resource, kdDataSelectService) {
    /** @export {!backendApi.ServiceAccount} ServiceAccount initialised from a bindig. */
    this.serviceAccount;

    /** @export {string} Initialized from a binding.*/
    this.resourceKindName = "ServiceAccount";

    /** @private {!./../../resource/verber_service.VerberService} */
    this.kdResourceVerberService_ = kdResourceVerberService;

    /** @private {!ui.router.$state} */
    this.state_ = $state;

    this.kdDataSelectService_ = kdDataSelectService;

    /** @private {!./../../common/namespace/service.NamespaceService} */
    this.kdNamespaceService_ = kdNamespaceService;

    /** @private {!angular.$resource} */
    this.resource_ = $resource;

  }

  remove() {
    this.kdResourceVerberService_
    .showDeleteDialog(
      this.resourceKindName, this.serviceAccount.typeMeta, this.serviceAccount.objectMeta)
    .then(() => {
      this.removeRolebinding(this.reName(this.serviceAccount.objectMeta.name));
      // For now just reload the state. Later we can remove the item in place.
      this.state_.reload();
    })
    .catch((err) => {
      if (err) {
        console.log('Error showing delete dialog:', err);
      }
    });
  }

  removeRolebinding(sa){
    sa = "user--"+sa
    let rolebindings = resolveRolebindingList(this.resource_, this.kdDataSelectService_,sa);
    let resuc = this.resource_;
    rolebindings.then(function(data){
      console.info(resuc)
      let items = data.items;
      console.info(items)
      console.info(items.length)
      for (var i=0;i<items.length;i++)
      {
        console.info(resuc)
        let typeMeta = items[i].typeMeta;
        let objectMeta = items[i].objectMeta;
        console.info(typeMeta);
        console.info(objectMeta);
        deleteRolebinding(resuc,typeMeta, objectMeta)
        /*let resource = this.resource_(getRawResourceUrl(typeMeta, objectMeta));
        resource.remove(function () {
          console.info("delete finish")
        }, function () {
        });*/
      }
    });
  }

  /**
   * @return {string}
   * @export
   */
  getServiceAccountDetailHref() {
    return this.state_.href(
        stateName, new StateParams(this.serviceAccount.objectMeta.namespace, this.serviceAccount.objectMeta.name));
  }

  /**
   * @return {boolean}
   * @export
   */
  areMultipleNamespacesSelected() {
    return this.kdNamespaceService_.areMultipleNamespacesSelected();
  }

  reName(name){
    var str_before = name.split("-token")[0];
    return str_before;
  }
}

/**
 * @type {!angular.Component}
 */
export const serviceAccountCardComponent = {
  bindings: {
    'serviceAccount': '=',
  },
  controller: ServiceAccountCardController,
  templateUrl: 'serviceaccount/list/card.html',
};

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
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function rolebindingListResource($resource) {
  return $resource('api/v1/rbac/rolebinding');
}

/**
 * @param {!angular.Resource} kdRolebindingListResource
 * @param {!./../../common/dataselect/service.DataSelectService} kdDataSelectService
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveRolebindingList($resource, kdDataSelectService,que) {
  let dataSelectQuery = kdDataSelectService.getDefaultResourceQuery();
  dataSelectQuery.filterBy = "name,"+que;
  console.log(dataSelectQuery)
  return rolebindingListResource($resource).get(dataSelectQuery).$promise;
}
export function deleteRolebinding($resource, typeMeta,objectMeta) {
  let resource = $resource(getRawResourceUrl(typeMeta, objectMeta));
  resource.remove(function () {
    console.info("delete finish")
  }, function () {
  });
}
