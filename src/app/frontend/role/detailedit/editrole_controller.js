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
    this.scope.rules;
    this.scope.databool = [];
    this.be = false;
    this.resources = ["namespaces","nodes","persistentvolumeclaims","pods","services","horizontalpodautoscalers",
      "resourcequotas","replicationcontrollers","limitranges","persistentvolumes","endpoints","secrets","configmaps",
    "daemonsets","deployments","replicasets","statefulsets","cronjobs","jobs","pods/exec","pods/log"]
    this.apiGroups = ["","extensions","apps","batch","autoscaling","rbac.authorization.k8s.io"]
    this.scope.apiGroups=this.apiGroups
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

    this.scope.existArray = function (array,arrar2) {
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < arrar2.length; j++) {
          if (array[i] == arrar2[j]) {
            return true;
          }
        }
      }
      return false;
    }
    this.scope.click = function(self){
      console.log(self);
      console.log($scope.rules);
    }
  }

  updatebool(){
    var newobj = new Array();
    var api = this.apiGroups;
    var res = this.resources;
    var ver = this.verbs;
    for (var k = 0; k < this.scope.rules.length; k++){
      var dapi = new Array();
      var dres = new Array();
      var dver = new Array();
      dapi = this.scope.rules[k].apiGroups;
      dres = this.scope.rules[k].resources;
      dver = this.scope.rules[k].verbs;
      var apire = new Array();
      var resre = new Array();
      var verre = new Array();
      for (var j=0;j<api.length;j++)
      {
        var apiname = api[j];
        apire[j] = this.checkArray(dapi, apiname);
      }
      console.info(apire)
      for (var j=0;j<res.length;j++)
      {
        var apiname = res[j];
        resre[j] = this.checkArray(dres, apiname);
      }
      for (var j=0;j<ver.length;j++)
      {
        var apiname = ver[j];
        verre[j] = this.checkArray(dver, apiname);
      }
      var obj = new Object();
      obj.apiGroups = apire;
      obj.resources = resre;
      obj.verbs = verre;
      newobj[k] = obj;
    }
    this.scope.databool = newobj;
  }

  updateData(){
    let newrules = new Array();
    var api = this.apiGroups;
    var res = this.resources;
    var ver = this.verbs;
    for (var k = 0; k < this.scope.databool.length; k++){
      let dapi = this.scope.databool[k].apiGroups;
      let dres = this.scope.databool[k].resources;
      let dver = this.scope.databool[k].verbs;
      var apire = new Array();
      var resre = new Array();
      var verre = new Array();
      for (var j=0;j<api.length;j++)
      {
        var name = api[j];
        if(dapi[j]){
          apire.push(name);
        }
      }
      for (var j=0;j<res.length;j++)
      {
        var name = res[j];
        if(dres[j]){
          resre.push(name);
        }
      }
      for (var j=0;j<ver.length;j++)
      {
        var name = ver[j];
        if(dver[j]){
          verre.push(name);
        }
      }
      var obj = new Object();
      obj.apiGroups = apire;
      obj.resources = resre;
      obj.verbs = verre;
      newrules[k] = obj;
    }
    this.scope.rules = newrules;
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
          this.scope.rules = this.dataObj.rules;
          this.updatebool();
        },
        (err) => {
          this.showMessage_(`Error: ${this.localizerService_.localize(err.data)}`);
        });
  }

  /**
   * @export
   */
  update() {
    this.updateData();
    this.dataObj.rules = this.scope.rules;
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
    this.scope.databool.splice(index,1);
    console.info(this.scope.rules)
  }

  add(){
    let obj = new Object();
    obj.verbs = new Array();
    obj.apiGroups = new Array();
    obj.resources = new Array();
    this.scope.databool.push(obj);
    console.info(this.scope.rules)
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
  checkN(vname,index,val){
    /*console.info("checkN")
    console.info(vname+" "+index+" "+val)*/
    if(vname === "verbs"){
      return this.scope.rules[index].verbs.indexOf(val) > -1
    }else if (vname === "apiGroups"){
      return this.scope.rules[index].apiGroups.indexOf(val) > -1
    } else if (vname === "resources"){
      return this.scope.rules[index].resources.indexOf(val) > -1
    }
    return false;
  }

  changN(vname,index,val){
    console.info(vname+" "+index+" "+val);
    console.info("change")
    console.info(this.scope.rules);
    if(vname === "verbs"){
      let ind = this.scope.rules[index].verbs.indexOf(val);
      console.info(this.scope.rules)
      console.info(ind)
      if(ind === -1){
        this.scope.rules[index].verbs.push(val);
      }else {
        console.info("verbs have")
        this.scope.rules[index].verbs.splice(ind, 1)
      }
    }else if (vname === "apiGroups"){
      let ind = this.scope.rules[index].apiGroups.indexOf(val);
      console.info(this.scope.rules)
      console.info(ind)
      if(ind === -1){
        this.scope.rules[index].apiGroups.push(val);
      }else {
        console.info("apiGroups have")
        this.scope.rules[index].apiGroups.splice(ind, 1)
      }
    } else if (vname === "resources"){
      let ind = this.scope.rules[index].resources.indexOf(val);
      console.info(this.scope.rules)
      console.info(ind)
      if(ind === -1){
        this.scope.rules[index].resources.push(val);
      }else {
        console.info("resources have")
        this.scope.rules[index].resources.splice(ind, 1)
      }
    }
    console.info(this.scope.rules)
    //this.updatebool();
  }
}
