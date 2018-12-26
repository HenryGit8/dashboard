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
class SaRoleCardController {
  /**
   * @ngInject
   */
  constructor($state) {
    /**
     * Initialized from the scope.
     * @export {!backendApi.Role}
     */
    this.role;

    /** @private {!ui.router.$state} */
    this.state_ = $state;
    this.roles;
    this.clusterroles;
    this.ischeck = false;
  }

  /**
   * @return {string}
   * @export
   */
  getRoleDetailHref() {
    if(this.role.typeMeta.kind == "role" && !this.checkArray(this.roles, this.role.objectMeta.name)){
      let newroles = this.roles;
      newroles.push(this.role.objectMeta.name+":"+this.role.objectMeta.namespace);
      this.roles = newroles;
      console.info(newroles)
    }else if(this.role.typeMeta.kind == "clusterrole" && !this.checkArray(this.clusterroles, this.role.objectMeta.name)){
      let newclusterroles = this.clusterroles;
      newclusterroles.push(this.role.objectMeta.name);
      this.clusterroles = newclusterroles;
      console.info(newclusterroles)
    }
  }

  checkArray(array,e)
  {
    console.info("check"+typeof array)
    let result = false;
    angular.forEach(array, function (value, key) {
      console.info(value+" "+e)
      console.info(value == e)
      if(value == e){
        result = true;
      }
    })
    if(result == true){
      return true;
    }else {
      return false;
    }
  }
}

/**
 * @return {!angular.Component}
 */
export const saRoleCardComponent = {
  bindings: {
    'role': '=',
    'roles': '=',
    'clusterroles': '='
  },
  controller: SaRoleCardController,
  controllerAs: '$cardCtrl',
  templateUrl: 'serviceaccount/rolelist/card.html',
};
