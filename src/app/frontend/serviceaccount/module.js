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
import eventsModule from '../events/module';

import {serviceAccountInfoComponent} from './detail/info_component';
import {serviceAccountCardComponent} from './list/card_component';
import {serviceAccountCardListComponent} from './list/cardlist_component';
import {saRoleCardComponent} from './rolelist/card_component.js';
import {saRoleCardListComponent} from './rolelist/cardlist_component.js';
import {serviceAccountListResource} from './list/stateconfig';
import stateConfig from './stateconfig';
import errorHandlingModule from "../common/errorhandling/module";

/**
 * Angular module for the ServiceAccount resource.
 */
export default angular
    .module(
        'kubernetesDashboard.serviceAccount',
        [
          'ngMaterial',
          'ngResource',
          'ui.router',
          chromeModule.name,
          componentsModule.name,
          eventsModule.name,
          filtersModule.name,
          errorHandlingModule.name,
          namespaceModule.name,
        ])
    .config(stateConfig)
    .component('kdServiceAccountCard', serviceAccountCardComponent)
    .component('kdServiceAccountCardList', serviceAccountCardListComponent)
    .component('kdSaRoleCard', saRoleCardComponent)
    .component('kdSaRoleListCard', saRoleCardListComponent)
    .component('kdServiceAccountInfo', serviceAccountInfoComponent)
    .factory('kdServiceAccountListResource', serviceAccountListResource);
