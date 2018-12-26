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
export class ServiceAccountDetailController {
  /**
   * @param {!backendApi.ServiceAccountDetail} serviceAccountDetail
   * @param {!angular.$window} $window
   * @ngInject
   */
  constructor(serviceAccountDetail, $window) {
    /** @export {!backendApi.ServiceAccountDetail} */
    this.serviceAccountDetail = serviceAccountDetail;
    this.name = this.reName(this.serviceAccountDetail.objectMeta.name);
    this.serviceAccountDetail.objectMeta.secretName = this.serviceAccountDetail.objectMeta.name;
    this.serviceAccountDetail.objectMeta.name = this.name;
    /** @private {!angular.$window} */
    this.window_ = $window;
  }

  /**
   * @param {string} valueB64
   * @return {string}
   * @export
   */
  formatDataValue(valueB64) {
    return this.window_.atob(valueB64);
  }
  reName(name){
    var str_before = name.split("-token")[0];
    return str_before;
  }
}
