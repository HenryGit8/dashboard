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

import {breadcrumbsConfig} from '../../common/components/breadcrumbs/service';
import {stateName as workloadsStateName} from '../../workloads/state';

import {stateName as parentState, stateUrl} from '../state';
import {RolebindingListController} from './controller';

/**
 * I18n object that defines strings for translation used in this file.
 */
const i18n = {
  /** @type {string} @desc Label 'Rolebindings' that appears as a breadcrumbs on the action bar. */
  MSG_BREADCRUMBS_PODS_LABEL: goog.getMsg('Rolebindings'),
};

/**
 * Config state object for the Rolebinding list view.
 *
 * @type {!ui.router.StateConfig}
 */
export const config = {
  url: stateUrl,
  parent: parentState,
  resolve: {
    'rolebindingList': resolveRolebindingList,
  },
  data: {
    [breadcrumbsConfig]: {
      'label': i18n.MSG_BREADCRUMBS_PODS_LABEL,
      'parent': workloadsStateName,
    },
  },
  views: {
    '': {
      controller: RolebindingListController,
      controllerAs: '$ctrl',
      templateUrl: 'rolebinding/list/list.html',
    },
  },
};

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
export function resolveRolebindingList(kdRolebindingListResource, kdDataSelectService) {
  let dataSelectQuery = kdDataSelectService.getDefaultResourceQuery();
  console.log(dataSelectQuery)
  return kdRolebindingListResource.get(dataSelectQuery).$promise;
}
