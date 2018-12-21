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
 * Controller for the edit resource dialog.
 *
 * @final
 */
export class EditRoleController {
  /**
   * @param {!md.$dialog} $mdDialog
   * @param {!angular.$http} $http
   * @param {!kdClipboard.Clipboard} clipboard
   * @param {!md.$toast} $mdToast
   * @param {string} resourceKindName
   * @param {string} resourceUrl
   * @param {./../errorhandling/localizer_service.LocalizerService} localizerService
   * @ngInject
   */
  constructor(
      $mdDialog, $http, clipboard, $mdToast, resourceKindName, resourceUrl, localizerService, $scope) {
    /** @export {string} */
    this.resourceKindName = resourceKindName;
    /** @export {string} */
    this.data = '';
    this.scope= $scope;
    this.dataObj;
    this.rules;
    this.be = false;
    this.resources = ["namespaces","nodes","persistentvolumeclaims","pods","services","horizontalpodautoscalers",
      "resourcequotas","replicationcontrollers","limitranges","persistentvolumes","endpoints","secrets","configmaps",
    "daemonsets","deployments","replicasets","statefulsets","cronjobs","jobs","pods/exec","pods/log"]
    this.apiGroups = ["extensions","apps","batch","autoscaling","rbac.authorization.k8s.io"]
    this.verbs = ["get","list","watch","patch","update","create","delete","proxy"]
    this.conf = [];
    /** @private {string} */
    this.resourceUrl = resourceUrl;
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @private {!angular.$http} */
    this.http_ = $http;
    /** @private {!kdClipboard.Clipboard} */
    this.clipboard_ = clipboard;
    /** @private {!md.$toast} */
    this.toast_ = $mdToast;
    /** @private {./../errorhandling/localizer_service.LocalizerService} */
    this.localizerService_ = localizerService;

    this.init_();
  }

  /**
   * @private
   */
  init_() {
    let promise = this.http_.get(this.resourceUrl);
    promise.then(
        (/** !angular.$http.Response<Object>*/ response) => {
          this.data = angular.toJson(response.data, true);
          this.dataObj = response.data;
          this.rules = this.dataObj.rules;
        },
        (err) => {
          this.showMessage_(`Error: ${this.localizerService_.localize(err.data)}`);
        });
  }

  /**
   * @export
   */
  update() {
    this.dataObj.rules = this.rules;
    return this.http_.put(this.resourceUrl, angular.toJson(this.dataObj, true))
        .then(this.mdDialog_.hide, this.mdDialog_.cancel);
  }

  /**
   * @export
   */
  copy() {
    /**
     * @type {string} @desc Toast message appears when browser does not support clipboard
     */
    let MSG_UNSUPPORTED_TOAST = goog.getMsg('Unsupported browser');
    /**
     * @type {string} @desc Toast message appears when copied to clipboard.
     */
    let MSG_COPIED_TOAST = goog.getMsg('Copied to clipboard');
    if (!this.clipboard_.supported) {
      this.showMessage_(MSG_UNSUPPORTED_TOAST);
    } else {
      this.clipboard_.copyText(this.data);
      this.showMessage_(MSG_COPIED_TOAST);
    }
  }

  /**
   * Cancels and closes the dialog.
   *
   * @export
   */
  cancel() {
    this.mdDialog_.cancel();
  }

  delete(index){
    console.info("delete"+index)
    this.rules.splice(index,1);
    console.info(this.rules)
    this.scope.$apply();
  }

  add(){
    console.info("add")
    let obj = new Object();
    let empAry = new Array();
    empAry.push("4424")
    obj.verbs = empAry;
    obj.apiGroups = empAry;
    obj.resources = empAry;
    this.rules.push(obj);
    console.info(this.rules)
    this.scope.$apply();
  }

  /**
   * show an error message
   *
   * @private
   * @param {string} message
   */
  showMessage_(message) {
    this.toast_
        .show(this.toast_.simple()
                  .textContent(message)
                  .position('top right')
                  .parent(document.getElementsByTagName('md-dialog')[0]))
        .then(() => {
          this.cancel();
        });
  }

  checkN(vname,index,val){
    /*console.info("checkN")
    console.info(vname+" "+index+" "+val)*/
    if(vname === "verbs"){
      return this.rules[index].verbs.indexOf(val) > -1
    }else if (vname === "apiGroups"){
      return this.rules[index].apiGroups.indexOf(val) > -1
    } else if (vname === "resources"){
      return this.rules[index].resources.indexOf(val) > -1
    }
    return false;
  }

  changN(vname,index,val){
    console.info(vname+" "+index+" "+val);
    console.info("change")
    console.info(this.rules);
    if(vname === "verbs"){
      let ind = this.rules[index].verbs.indexOf(val);
      console.info(this.rules)
      console.info(ind)
      if(ind === -1){
        this.rules[index].verbs.push(val);
      }else {
        console.info("verbs have")
        this.rules[index].verbs.splice(ind, 1)
      }
    }else if (vname === "apiGroups"){
      let ind = this.rules[index].apiGroups.indexOf(val);
      console.info(this.rules)
      console.info(ind)
      if(ind === -1){
        this.rules[index].apiGroups.push(val);
      }else {
        console.info("apiGroups have")
        this.rules[index].apiGroups.splice(ind, 1)
      }
    } else if (vname === "resources"){
      let ind = this.rules[index].resources.indexOf(val);
      console.info(this.rules)
      console.info(ind)
      if(ind === -1){
        this.rules[index].resources.push(val);
      }else {
        console.info("resources have")
        this.rules[index].resources.splice(ind, 1)
      }
    }
  }
}
