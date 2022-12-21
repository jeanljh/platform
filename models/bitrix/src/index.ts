//
// Copyright © 2020, 2021 Anticrm Platform Contributors.
// Copyright © 2021 Hardcore Engineering Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { Builder, Collection, Mixin, Model, Prop, TypeRef, TypeString } from '@hcengineering/model'
import core, { TAttachedDoc, TDoc } from '@hcengineering/model-core'
import bitrix from './plugin'

import { BitrixEntityMapping, BitrixFieldMapping, BitrixSyncDoc, Fields } from '@hcengineering/bitrix'
import { AnyAttribute, Class, Doc, Domain, Ref } from '@hcengineering/core'

import view, { createAction } from '@hcengineering/model-view'

import setting from '@hcengineering/setting'

const DOMAIN_BITRIX = 'bitrix' as Domain

@Mixin(bitrix.mixin.BitrixSyncDoc, core.class.Doc)
export class TBitrixSyncDoc extends TDoc implements BitrixSyncDoc {
  type!: string
  bitrixId!: string
}

@Model(bitrix.class.EntityMapping, core.class.Doc, DOMAIN_BITRIX)
export class TBitrixEntityMapping extends TDoc implements BitrixEntityMapping {
  @Prop(TypeRef(core.class.Attribute), core.string.ClassPropertyLabel)
    ofClass!: Ref<Class<Doc>>

  type!: string

  @Prop(Collection(bitrix.class.FieldMapping), bitrix.string.FieldMapping)
    fields!: number

  bitrixFields!: Fields
  comments!: boolean
  activity!: boolean
  attachments!: boolean
}

@Model(bitrix.class.FieldMapping, core.class.Doc, DOMAIN_BITRIX)
export class TBitrixFieldMapping extends TAttachedDoc implements BitrixFieldMapping {
  @Prop(TypeRef(core.class.Attribute), core.string.ClassPropertyLabel)
    ofClass!: Ref<Class<Doc>>

  @Prop(TypeString(), core.string.ClassPropertyLabel)
    attributeName!: Ref<AnyAttribute>

  bitrixTitle!: string
  bitrixType!: string
  operation!: any
}

export function createModel (builder: Builder): void {
  builder.createModel(TBitrixEntityMapping, TBitrixFieldMapping, TBitrixSyncDoc)

  builder.createDoc(
    setting.class.IntegrationType,
    core.space.Model,
    {
      label: bitrix.string.Bitrix,
      description: bitrix.string.BitrixDesc,
      icon: bitrix.component.BitrixIcon,
      createComponent: bitrix.component.BitrixConnect,
      configureComponent: bitrix.component.BitrixConfigure
    },
    bitrix.integrationType.Bitrix
  )

  createAction(
    builder,
    {
      action: view.actionImpl.ShowPopup,
      actionProps: {
        component: bitrix.component.BitrixImport
      },
      label: bitrix.string.BitrixImport,
      icon: bitrix.icon.Bitrix,
      input: 'any',
      category: view.category.General,
      target: core.class.Doc,
      context: { mode: ['workbench', 'browser', 'editor', 'panel', 'popup'], group: 'create' }
    },
    bitrix.action.BitrixImport
  )
}

export { bitrixOperation } from './migration'