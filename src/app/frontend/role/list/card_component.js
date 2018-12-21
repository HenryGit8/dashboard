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

import {stateName} from "../detail/state";
import {StateParams} from "../../common/resource/resourcedetail";

/**
 * Controller for the RBAC role card.
 *
 * @final
 */
class RoleCardController {
  /**
   * @ngInject
   */
  constructor($state) {
    /**
     * Initialized from the scope.
     * @export {!backendApi.Role}
     */
    this.role;
    this.ise;

    /** @private {!ui.router.$state} */
    this.state_ = $state;
  }

  /**
   * @return {string}
   * @export
   */
  getRoleDetailHref() {
    if(this.role.objectMeta.namespace !== undefined){
      return this.state_.href(
        stateName, new StateParams(this.role.objectMeta.namespace, this.role.objectMeta.name));

    }else {
      return this.state_.href(
        stateName, new StateParams("_all",this.role.objectMeta.name));
    }
  }
}

/**
 * @return {!angular.Component}
 */
export const roleCardComponent = {
  bindings: {
    'role': '=',
    'ise':'<',
  },
  controller: RoleCardController,
  controllerAs: '$cardCtrl',
  templateUrl: 'role/list/card.html',
};
