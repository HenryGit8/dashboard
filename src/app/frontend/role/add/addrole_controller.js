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

import {stateName as overview} from "../../overview/state";
import {ALL_NAMESPACES} from "../../common/namespace/component";
import {namespaceParam} from "../../chrome/state";

/**
 * Controller for the edit resource dialog.
 *
 * @final
 */
export class AddRoleController {
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
      $mdDialog, $log,$http, clipboard, $mdToast, resourceKindName, localizerService,
    $scope,kdCsrfTokenService, kdCsrfTokenHeader,$stateParams, $resource,errorDialog,$q,$state,$mdSelect,$timeout,$document) {
    /** @export {string} */
    this.resourceKindName = resourceKindName;
    this.scope= $scope;
    this.dataObj;
    /** @private {!angular.$timeout} */
    this.timeout_ = $timeout;

    /** @private {!md.$select} */
    this.mdSelect_ = $mdSelect;

    /** @private {!angular.$document} */
    this.document_ = $document;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
    /** @private {!../common/errorhandling/dialog.ErrorDialog} */
    this.errorDialog_ = errorDialog;
    this.scope.rules = [];
    this.databool = [];
    this.be = false;
    this.q_ = $q;
    this.scope.databool = [];
    /** @private {!angular.$log} */
    this.log_ = $log;
    this.resources = ["namespaces","nodes","persistentvolumeclaims","pods","services","horizontalpodautoscalers",
      "resourcequotas","replicationcontrollers","limitranges","persistentvolumes","endpoints","secrets","configmaps",
    "daemonsets","deployments","replicasets","statefulsets","cronjobs","jobs","pods/exec","pods/log"]
    this.apiGroups = ["","extensions","apps","batch","autoscaling","rbac.authorization.k8s.io"]
    this.verbs = ["get","list","watch","patch","update","create","delete","proxy"]
    this.conf = [];
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @private {!angular.$http} */
    this.http_ = $http;
    /** @private {!kdClipboard.Clipboard} */
    this.clipboard_ = clipboard;
    /** @private {!md.$toast} */
    this.toast_ = $mdToast;
    this.namespaceInput;
    this.namespaces = [];
    /** @private {./../errorhandling/localizer_service.LocalizerService} */
    this.localizerService_ = localizerService;
    /** @private {string} */
    this.csrfHeaderName_ = kdCsrfTokenHeader;
    /** @private {!angular.$resource} */
    this.resource_ = $resource;
    /** @private {!./../common/csrftoken/service.CsrfTokenService} */
    this.tokenService_ = kdCsrfTokenService;
    /** @private {!../chrome/state.StateParams} */
    this.stateParams_ = $stateParams;

    /** @private {boolean} */
    this.isDeployInProgress_ = false;
    this.selectedNamespace;
    this.init_();
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

  /**
   * @private
   */
  init_() {
    let obj = new Object();
    obj.kind = this.resourceKindName;
    obj.apiVersion = "rbac.authorization.k8s.io/v1";
    obj.metadata = new Object();
    obj.metadata.name = "";
    obj.metadata.namespace = this.stateParams_.namespace;
    let ruleobj = new Object();
    ruleobj.verbs = [];
    ruleobj.apiGroups = [];
    ruleobj.resources = [];
    obj.rules = [];
    this.scope.rules.push(ruleobj);
    this.dataObj = obj;
    this.updatebool();
  }

  /**
   * @export
   */
  commit() {
    this.updateData();
    this.dataObj.rules = this.scope.rules;
    this.deployContent(angular.toJson(this.dataObj, true),this.dataObj.metadata.namespace);
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
  }

  add(){
    let obj = new Object();
    obj.verbs = [];
    obj.apiGroups = [];
    obj.resources = [];
    this.scope.databool.push(obj);
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

  selectNamespace() {
    if (this.namespaceInput.length > 0) {
      this.selectedNamespace = this.namespaceInput;
      this.namespaceInput = '';
      this.mdSelect_.hide();
    }
  }

/*

  changN(vname,index,val){
    console.info(vname+" "+index+" "+val);
    console.info("change")
    console.info(this.scope.rules);
    if(vname === "verbs"){
      let ind = this.scope.rules[index].verbs.indexOf(val);
      console.info(this.scope.rules)
      console.info(ind)
      if(ind === -1){
        console.info("befo")
        console.info(this.scope.rules[index])
        this.scope.rules[index].verbs.push(val);
        console.info("end")
        console.info(this.scope.rules[index])
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
*/


  /**
   * @param {string} content
   * @param {boolean} validate
   * @param {string} name
   * @return {!angular.$q.Promise}
   */
  deployContent(content, namespace,validate = true, name = '') {
    let defer = this.q_.defer();
    let tokenPromise = this.tokenService_.getTokenForAction('appdeploymentfromfile');

    /** @type {!backendApi.AppDeploymentContentSpec} */
    let spec = {
      name: name,
      namespace: namespace || this.stateParams_.namespace || '',
      content: content,
      validate: validate,
    };

    tokenPromise.then(
      (token) => {
        /** @type {!angular.Resource} */
        let resource = this.resource_(
          'api/v1/appdeploymentfromfile', {},
          {save: {method: 'POST', headers: {[this.csrfHeaderName_]: token}}});
        this.isDeployInProgress_ = true;
        resource.save(
          spec,
          (response) => {
            defer.resolve(response);
            this.log_.info('Deployment is completed: ', response);
            if (response.error.length > 0) {
              this.errorDialog_.open('Deployment has been partly completed', response.error);
            }
            //this.state_.go(overview);
            this.mdDialog_.hide();
            this.mdDialog_.cancel();
          },
          (err) => {
            defer.reject(err);
            if (this.hasValidationError_(err.data)) {
              this.handleDeployAnywayDialog_(content, err.data);
            } else {
              let errMsg = this.localizerService_.localize(err.data);
              this.log_.error('Error deploying application:', err);
              this.errorDialog_.open(this.i18n.MSG_DEPLOY_DIALOG_ERROR, errMsg);
            }
          });
      },
      (err) => {
        defer.reject(err);
        this.log_.error('Error deploying application:', err);
      });

    defer.promise
    .finally(() => {
      this.isDeployInProgress_ = false;
    })
    .catch((err) => {
      this.log_.error('Error:', err);
    });

    return defer.promise;
  }

  /**
   * Returns true if given error contains information about validate=false argument, false
   * otherwise.
   *
   * @param {string} err
   * @return {boolean}
   * @private
   */
  hasValidationError_(err) {
    return err.indexOf('validate=false') > -1;
  }
  /** @export */
  loadNamespacesIfNeeded() {
    this.focusNamespaceInput_();
    if (!this.namespacesInitialized_) {
      /** @type {!angular.Resource} */
      let resource = this.resource_('api/v1/namespace');

      return resource.get().$promise.then((namespaceList) => {
        this.namespaces = namespaceList.namespaces.map((n) => n.objectMeta.name);
        this.namespacesInitialized_ = true;
      });
    }
  }

  /**
   * Focuses namespace input field after clicking on namespace selector menu.
   *
   * @private
   */
  focusNamespaceInput_() {
    // Wrap in a timeout to make sure that element is rendered before looking for it.
    this.timeout_(() => {
      let elem = this.document_.find('md-select-menu').find('input');
      elem[0].focus();
    }, 150);
  }

  /**
   * @return {string}
   * @export
   */
  formatNamespace() {
    let namespace = this.dataObj.metadata.namespace;
    return namespace;

  }

  /**
   * Ask user if he would like to try deploy once more with validation turned off this time.
   *
   * @param {string} content
   * @param {string} err
   * @private
   */
  handleDeployAnywayDialog_(content, err) {
    this.showDeployAnywayDialog(err).then(() => {
      this.deployContent(content, false);
    });
  }

  /**
   * Displays deploy anyway confirm dialog.
   *
   * @param {string} errorMessage
   * @return {!angular.$q.Promise}
   */
  showDeployAnywayDialog(errorMessage) {
    let dialog = this.mdDialog_.confirm()
    .title(i18n.MSG_DEPLOY_ANYWAY_DIALOG_TITLE)
    .htmlContent(`${errorMessage}<br><br>${i18n.MSG_DEPLOY_ANYWAY_DIALOG_CONTENT}`)
    .ok(i18n.MSG_DEPLOY_ANYWAY_DIALOG_OK)
    .cancel(i18n.MSG_DEPLOY_ANYWAY_DIALOG_CANCEL);

    return this.mdDialog_.show(dialog);
  }


}
