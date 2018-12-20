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

import {actionbarViewName, stateName as chromeStateName} from '../../chrome/state';
import {breadcrumbsConfig} from '../../common/components/breadcrumbs/service';
import {appendDetailParamsToUrl} from '../../common/resource/resourcedetail';
import {stateName as rolebindingList} from '../../rolebinding/list/state';

import {stateName as parentState, stateUrl} from '../state';
import {ActionBarController} from './actionbar_controller';
import {RolebindingDetailController} from './controller';

/**
 * Config state object for the Rolebinding detail view.
 *
 * @type {!ui.router.StateConfig}
 */
export const config = {
  url: appendDetailParamsToUrl(stateUrl),
  parent: parentState,
  resolve: {
    'rolebindingDetailResource': getRolebindingDetailResource,
    'rolebindingDetail': getRolebindingDetail,
  },
  data: {
    [breadcrumbsConfig]: {
      'label': '{{$stateParams.objectName}}',
      'parent': rolebindingList,
    },
  },
  views: {
    '': {
      controller: RolebindingDetailController,
      controllerAs: 'ctrl',
      templateUrl: 'rolebinding/detail/detail.html',
    },
    [`${actionbarViewName}@${chromeStateName}`]: {
      controller: ActionBarController,
      controllerAs: '$ctrl',
      templateUrl: 'rolebinding/detail/actionbar.html',
    },
  },
};

/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function rolebindingEventsResource($resource) {
  return $resource('api/v1/rolebinding/:namespace/:name/event');
}

/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function rolebindingOldReplicaSetsResource($resource) {
  return $resource('api/v1/rolebinding/:namespace/:name/oldreplicaset');
}

/**
 * @param {!./../../common/resource/resourcedetail.StateParams} $stateParams
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function getRolebindingDetailResource($resource, $stateParams) {
  if($stateParams.objectNamespace !== "_all"){
    return $resource(`api/v1/_raw/rolebinding/namespace/${$stateParams.objectNamespace}/name/${$stateParams.objectName}`);
    //return $resource(`api/v1/rolebinding/${$stateParams.objectNamespace}/${$stateParams.objectName}`);
  }else {
    return $resource(`api/v1/_raw/clusterrolebinding/name/${$stateParams.objectName}`);
  }
}

/**
 * @param {!angular.Resource} rolebindingDetailResource
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function getRolebindingDetail(rolebindingDetailResource) {
  return rolebindingDetailResource.get().$promise;
}
