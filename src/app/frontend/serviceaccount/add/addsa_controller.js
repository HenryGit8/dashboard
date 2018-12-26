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
export class AddSaController {
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
      $mdDialog, $log,$http, clipboard, $mdToast, resourceKindName, localizerService,kdDataSelectService,
    $scope,kdCsrfTokenService, kdCsrfTokenHeader,$stateParams, $resource,errorDialog,$q,$state,$mdSelect,$timeout,$document) {
    /** @export {string} */
    this.resourceKindName = resourceKindName;
    this.scope= $scope;
    /** @private {!angular.$timeout} */
    this.timeout_ = $timeout;
    /** @private {!md.$select} */
    this.mdSelect_ = $mdSelect;
    /** @private {!angular.$document} */
    this.document_ = $document;
    /** @private {!ui.router.$state} */
    this.state_ = $state;
    this.defaultNamespace = "kube-public";
    /** @private {!../common/errorhandling/dialog.ErrorDialog} */
    this.errorDialog_ = errorDialog;
    this.q_ = $q;
    /** @private {!angular.$log} */
    this.log_ = $log;
    this.serviceAccountObject = new Object();
    this.roleBindingObjects = new Array();
    this.clusterRoleBindingObjects = new Array();
    this.roles = new Array();
    this.clusterroles  = new Array();
    /** @private {!md.$dialog} */
    this.mdDialog_ = $mdDialog;
    /** @private {!angular.$http} */
    this.http_ = $http;
    /** @private {!kdClipboard.Clipboard} */
    this.clipboard_ = clipboard;
    /** @private {!md.$toast} */
    this.toast_ = $mdToast;
    this.namespaceInput;
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
    this.selectNamespace = "";
    this.roleList = resolveRoleList($resource, kdDataSelectService,this.selectNamespace);
    console.info(this.roleList)
    this.roleListResource = roleListResource($resource);
    this.isfinishs = 0;
    this.watitimes = 1;
    this.errormsg = "";

    this.init_();
  }

  /**
   * @private
   */
  init_() {
    this.serviceAccountObject.apiVersion = "v1";
    this.serviceAccountObject.kind = this.resourceKindName;
    let medata = new Object();
    medata.name = "";
    medata.namespaces = this.defaultNamespace;
    this.serviceAccountObject.metadata = medata;
  }


  getFirstN(rolenames){
    let re = "";
    angular.forEach(rolenames, function (value, key) {
      re = re+value.substr(0,1);
    })
    return re;
  }

  /**
   * @export
   */
  commit() {
    this.deployContent(angular.toJson(this.serviceAccountObject, true),this.defaultNamespace);
    console.info("start")
    console.info(this.serviceAccountObject.metadata.name)
    console.info(this.watitimes);
    this.watitimes = this.watitimes + this.clusterroles.length + this.roles.length;
    console.info(this.watitimes);
    for (var i=0;i<this.clusterroles.length;i++)
    {
      this.addClusterRolebinding(this.serviceAccountObject.metadata.name, this.clusterroles[i]);
    }
    for (var i=0;i<this.roles.length;i++)
    {
      this.addRolebinding(this.serviceAccountObject.metadata.name, this.roles[i]);
    }
    for (var i=0;i<this.roleBindingObjects.length;i++)
    {
      let truenamespace = this.roleBindingObjects[i].metadata.namespace;
      this.deployContent(angular.toJson(this.roleBindingObjects[i], true),truenamespace);
    }
    for (var i=0;i<this.clusterRoleBindingObjects.length;i++)
    {
      this.deployContent(angular.toJson(this.clusterRoleBindingObjects[i], true));
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

  addRolebinding(saname,rolename){
    let truename = rolename.split(':')[0];
    let truenamespace = rolename.split(':')[1];
    let rbobj = new Object();
    rbobj.apiVersion = "rbac.authorization.k8s.io/v1";
    rbobj.kind = "RoleBinding";
    let rbmedata = new Object();
    rbmedata.name = "user--"+saname+"-role--"+truename;
    rbmedata.namespaces = truenamespace;
    rbobj.metadata = rbmedata;
    let roleRef = new Object();
    roleRef.apiGroup = "rbac.authorization.k8s.io";
    roleRef.kind = "Role";
    roleRef.name = truename;
    roleRef.namespace = truenamespace;
    rbobj.roleRef = roleRef;
    let subjects = new Array();
    let roleobj = new Object();
    roleobj.kind = this.resourceKindName;
    roleobj.namespace = this.defaultNamespace;
    roleobj.name = saname;
    subjects.push(roleobj);
    rbobj.subjects = subjects;
    this.roleBindingObjects.push(rbobj)
  }
  addClusterRolebinding(saname,rolename){
    let rbobj = new Object();
    rbobj.apiVersion = "rbac.authorization.k8s.io/v1";
    rbobj.kind = "ClusterRoleBinding";
    let rbmedata = new Object();
    rbmedata.name = "user--"+saname+"-clusterrole--"+rolename;
    rbobj.metadata = rbmedata;
    let roleRef = new Object();
    roleRef.apiGroup = "rbac.authorization.k8s.io";
    roleRef.kind = "ClusterRole";
    roleRef.name = rolename;
    rbobj.roleRef = roleRef;
    let subjects = new Array();
    let roleobj = new Object();
    roleobj.kind = this.resourceKindName;
    roleobj.namespace = this.defaultNamespace;
    roleobj.name = saname;
    subjects.push(roleobj);
    rbobj.subjects = subjects;
    this.clusterRoleBindingObjects.push(rbobj)
  }

  /**
   * @param {string} content
   * @param {boolean} validate
   * @param {string} name
   * @return {!angular.$q.Promise}
   */
  deployContent(content, namespace = '',validate = true, name = '') {
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
              this.errormsg = response.error;
              //this.errorDialog_.open('Deployment has been partly completed', response.error);
            }
            //this.state_.go(overview);;
          },
          (err) => {
            defer.reject(err);
            if (this.hasValidationError_(err.data)) {
              this.handleDeployAnywayDialog_(content, err.data);
            } else {
              let errMsg = this.localizerService_.localize(err.data);
              console.info(errMsg)
              this.log_.error('Error deploying application:', err);
              //this.errorDialog_.open(this.i18n.MSG_DEPLOY_DIALOG_ERROR, errMsg);
              this.errormsg = errMsg;
            }
          });
      },
      (err) => {
        defer.reject(err);
        this.log_.error('Error deploying application:', err);
      });

    defer.promise
    .finally(() => {
      console.info("finish")
      console.info(this.isfinishs);
      console.info(this.watitimes);
      this.isfinishs = this.isfinishs+1;
      if(this.isfinishs == this.watitimes){
        this.mdDialog_.hide();
        this.mdDialog_.cancel();
      }
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

/**
 * @param {!angular.$resource} $resource
 * @return {!angular.Resource}
 * @ngInject
 */
export function roleListResource($resource) {
  return $resource('api/v1/rbac/role');
}

/**
 * @param {!angular.Resource} kdRoleListResource
 * @param {!./../../common/dataselect/service.DataSelectService} kdDataSelectService
 * @return {!angular.$q.Promise}
 * @ngInject
 */
export function resolveRoleList($resource, kdDataSelectService,selectNamespace) {
  let query = kdDataSelectService.getDefaultResourceQuery('');
  if(selectNamespace.length > 0){
    query.filterBy = "namespace,"+selectNamespace
  }
  console.info(query)
  return $resource('api/v1/rbac/role').get(query);
}
