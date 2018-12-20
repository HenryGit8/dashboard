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

import {StateParams} from '../../common/resource/resourcedetail';
import {stateName} from '../../rolebinding/detail/state';

/**
 * @final
 */
export class RolebindingCardController {
  /**
   * @ngInject,
   * @param {!ui.router.$state} $state
   */
  constructor($state, kdNamespaceService) {
/*    this.kdNamespaceService_ = kdNamespaceService;*/

    /** @private {!ui.router.$state} */
    this.state_ = $state;

    /**
     * Initialized from the scope.
     */
    this.rolebinding;
  }

 /* /!**
   * @return {boolean}
   * @export
   *!/
  areMultipleNamespacesSelected() {
    return this.kdNamespaceService_.areMultipleNamespacesSelected();
  }*/


  /**
   * @return {string}
   * @export
   */
  getRolebindingDetailHref() {
    if(this.rolebinding.objectMeta.namespace !== undefined){
        return this.state_.href(
          stateName, new StateParams(this.rolebinding.objectMeta.namespace, this.rolebinding.objectMeta.name));

    }else {
      return this.state_.href(
        stateName, new StateParams("_all",this.rolebinding.objectMeta.name));
    }
  }

  /**
   * Returns a displayable status message for the rolebinding.
   * @return {string}
   * @export
   */
  getDisplayStatus() {
    // See kubectl printers.go for logic in kubectl.
    // https://github.com/kubernetes/kubernetes/blob/39857f486511bd8db81868185674e8b674b1aeb9/pkg/printers/internalversion/printers.go

    let msgState = 'running';
    let reason = undefined;

    // NOTE: Init container statuses are currently not taken into account.
    // However, init containers with errors will still show as failed because
    // of warnings.
    if (this.rolebinding.rolebindingStatus.containerStates) {
      // Container states array may be null when no containers have
      // started yet.

      for (let i = this.rolebinding.rolebindingStatus.containerStates.length - 1; i >= 0; i--) {
        let state = this.rolebinding.rolebindingStatus.containerStates[i];

        if (state.waiting) {
          msgState = 'waiting';
          reason = state.waiting.reason;
        }
        if (state.terminated) {
          msgState = 'terminated';
          reason = state.terminated.reason;
          if (!reason) {
            if (state.terminated.signal) {
              reason = 'Signal:${state.terminated.signal}';
            } else {
              reason = 'ExitCode:${state.terminated.exitCode}';
            }
          }
        }
      }
    }

    /** @type {string} @desc Status message showing a waiting status with [reason].*/
    let MSG_POD_LIST_POD_WAITING_STATUS = goog.getMsg('Waiting: {$reason}', {'reason': reason});
    /** @type {string} @desc Status message showing a terminated status with [reason].*/
    let MSG_POD_LIST_POD_TERMINATED_STATUS =
        goog.getMsg('Terminated: {$reason}', {'reason': reason});

    if (msgState === 'waiting') {
      return MSG_POD_LIST_POD_WAITING_STATUS;
    }
    if (msgState === 'terminated') {
      return MSG_POD_LIST_POD_TERMINATED_STATUS;
    }
    return this.rolebinding.rolebindingStatus.rolebindingPhase;
  }

  /**
   * @return {boolean}
   * @export
   */
  hasMemoryUsage() {
    return !!this.rolebinding && !!this.rolebinding.metrics && !!this.rolebinding.metrics.memoryUsageHistory &&
        this.rolebinding.metrics.memoryUsageHistory.length > 0;
  }

  /**
   * @return {boolean}
   * @export
   */
  hasCpuUsage() {
    return !!this.rolebinding && !!this.rolebinding.metrics && !!this.rolebinding.metrics.cpuUsageHistory &&
        this.rolebinding.metrics.cpuUsageHistory.length > 0;
  }
}

/**
 * @return {!angular.Component}
 */
export const rolebindingCardComponent = {
  bindings: {
    'rolebinding': '=',
    'showMetrics': '<',
  },
  controller: RolebindingCardController,
  templateUrl: 'rolebinding/list/card.html',
};
