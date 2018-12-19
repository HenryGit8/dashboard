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

import chromeModule from '../chrome/module';
import componentsModule from '../common/components/module';
import filtersModule from '../common/filters/module';
import namespaceModule from '../common/namespace/module';
import configMapModule from '../configmap/module';
import eventsModule from '../events/module';
import persistentvolumeclaimModule from '../persistentvolumeclaim/module';

import {containerInfoComponent} from './detail/containerinfo_component';
import {creatorInfoComponent} from './detail/creatorinfo_component';
import {rolebindingInfoComponent} from './detail/info_component';
import {rolebindingEventsResource} from './detail/stateconfig';
import {rolebindingPersistentVolumeClaimsResource} from './detail/stateconfig';
import {rolebindingCardComponent} from './list/card_component';
import {rolebindingCardListComponent} from './list/cardlist_component';
import {rolebindingListResource} from './list/stateconfig';
import stateConfig from './stateconfig';

/**
 * Angular module for the Rolebinding resource.
 */
export default angular
    .module(
        'kubernetesDashboard.rolebinding',
        [
          'ngMaterial',
          'ngResource',
          'ui.router',
          chromeModule.name,
          componentsModule.name,
          configMapModule.name,
          eventsModule.name,
          filtersModule.name,
          namespaceModule.name,
          persistentvolumeclaimModule.name,
        ])
    .config(stateConfig)
    .component('kdContainerInfo', containerInfoComponent)
    .component('kdCreatorInfo', creatorInfoComponent)
    .component('kdRolebindingCard', rolebindingCardComponent)
    .component('kdRolebindingCardList', rolebindingCardListComponent)
    .component('kdRolebindingInfo', rolebindingInfoComponent)
    .factory('kdRolebindingEventsResource', rolebindingEventsResource)
    .factory('kdRolebindingListResource', rolebindingListResource)
    .factory('kdRolebindingPersistentVolumeClaimsResource', rolebindingPersistentVolumeClaimsResource);
