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
export default class RolebindingInfoController {
  /**
   * Constructs rolebinding info object.
   */
  constructor() {
    /**
     * Rolebinding details. Initialized from the scope.
     * @export {!backendApi.RolebindingDetail}
     */
    this.rolebinding;
  }

  /*getAccount(){
    let subjects = this.rolebinding.subjects;
    console.log(subjects)
    let accounts=new Object();
    for (var i=0;i<subjects.length;i++)
    {
      console.log(subjects[i].name)
      console.log(JSON.stringify(subjects[i]))
      accounts.subjects[i].name=JSON.stringify(subjects[i]);
    }
    console.log(JSON.stringify(accounts))
    return JSON.stringify(accounts);
  }*/
}

/**
 * Definition object for the component that displays replica set info.
 *
 * @type {!angular.Component}
 */
export const rolebindingInfoComponent = {
  controller: RolebindingInfoController,
  templateUrl: 'rolebinding/detail/info.html',
  bindings: {
    'rolebinding': '=',
  },
};
