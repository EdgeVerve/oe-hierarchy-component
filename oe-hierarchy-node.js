/** ©2017-2018 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
* The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties and other pending or existing intellectual property rights in India, the United States and other countries.
* The Program may contain/reference third party or open source components, the rights to which continue to
* remain with the applicable third party licensors or the open source community as the case may be and nothing
* here transfers the rights to the third party and open source components, except as expressly permitted.
* Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this Program,or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under the law.
*/

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import { Templatizer } from '@polymer/polymer/lib/legacy/templatizer-behavior.js';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class.js';
import 'oe-utils/oe-utils.js';
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-menu-button/paper-menu-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import '@polymer/iron-icons/iron-icons.js';
import "@polymer/paper-item/paper-item.js";
import '@polymer/paper-listbox/paper-listbox.js';
var OEUtils = window.OEUtils || {};
/**
 *`oe-hierarchy-node`
 *
 * @customElement
 * @polymer
 * 
 */
class OeHierarchyNode extends mixinBehaviors([Templatizer],PolymerElement) {
    static get is() { return 'oe-hierarchy-node'; }

    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment">
            :host {
                position: relative;
                display: block;
                box-sizing: border-box;
                --animation-time: 0ms;
                --pre-connector-relation-bg: #ffffff;
            }

            :host([is-parent]) > .component-container {
                justify-content: flex-end;
            }

            .node-detail-container {
                position: relative;
            }

            .current-node-detail {
                padding-top: 40px;
            }

            .node-detail {
                position: relative;
                @apply --oe-node-item;
            }

            .node-default-display {
                height: 70px;
                width: 130px;
                box-sizing: border-box;
                padding: 16px 8px;
                background: #0288d1;
                text-align: center;
                user-select: none;
            }

            .node-children-container {
                margin-left: calc(32px + var(--pre-connector-width));
                position: relative;
            }

            .node-parent-container {
                position: relative;
            }

            .parent-nodes {
                float: right;
            }

            .connector-lines {
                position: absolute;
                background: var(--path-color);
                z-index: 1;
                top: 32px;
            }

            .node-detail-container #pre-connector {
                width: var(--pre-connector-width);
                height: var(--connector-thickness);
                left: calc(var(--pre-connector-width) * -1);
                cursor: pointer;
            }

            .node-detail-container #pre-connector label {
                padding: 0px 2px;
                background-color: var(--pre-connector-relation-bg);
            }
            #pre-connector[hidden] {
                visibility: hidden;
            }
            #post-connector[hidden] {
                visibility: hidden;
            }
            .node-detail-container #post-connector {
                width: 32px;
                height: var(--connector-thickness);
                right: -32px;
                cursor: pointer;
            }

            .node-detail-container #pre-connector.selected,
            .node-detail-container #post-connector.selected {
                background: var(--connector-selected-color, --accent-color);
            }

            .node-detail.selected {
                box-shadow: 3px 3px 1px 1px rgba(0, 0, 0, 0.5);
                @apply --oe-node-selected;
            }

            #connector {
                width: var(--connector-thickness);
                height: 0px;
                left: calc(var(--pre-connector-width) * -1);
                top: calc(var(--connector-thickness) + 72px);
                transition: height var(--animation-time);
            }

            #parentconnector {
                width: var(--connector-thickness);
                height: 0px;
                right: var(--pre-connector-width);
                top: calc(var(--connector-thickness) + 72px);
                transition: height var(--animation-time);
            }

            .action-panel {
                position: absolute;
                z-index: 2;
                height: 28px;
                right: 0px;
                top: -28px;
                background: rgba(0, 0, 0, 0.7);
                color: #FFF;
                border-radius: 1px;
                box-sizing: border-box;
                visibility: hidden;
                width: 0;
                opacity: 0;
                transition: opacity 300ms;
            }
            #action-panelId[hidden] {
                visibility: hidden;
            }

            .action-panel paper-icon-button,
            .action-panel paper-menu-button {
                padding: 0px;
                height: 18px;
                width: 18px;
                line-height: 16px;
                cursor: pointer;
            }

            .node-detail-container:hover .action-panel {
                width: 28px;
                visibility: visible;
                opacity: 1;
            }

            .node-action-item {
                font-size: 12px;
                min-height: 32px;
                padding: 0 8px;
            }

            .node-action-item iron-icon {
                --iron-icon-width: 16px;
                --iron-icon-height: 16px;
                margin-right: 8px;
            }
        </style>
        <div class="component-container layout horizontal">
            <div class="node-parent-container" hidden=[[!showParent]]>
                <div id="parentconnector" class="connector-lines"></div>
                <div id="parentcollapse" class="layout vertical">
                    <template is="dom-repeat" items="[[_getConditionalValue(data,parentKey,isChild,isParentNode)]]">
                        <oe-hierarchy-node label-key=[[labelKey]] is-parent parent-key=[[parentKey]] relation-key=[[relationKey]] node-template=[[nodeTemplate]]
                            node-data-as=[[nodeDataAs]] level=[[_nextLevel(level)]] parent-data=[[data]] actions=[[actions]]
                            path=[[_getPath(index)]] class="parent-nodes" data={{item}}></oe-hierarchy-node>
                    </template>
                </div>
            </div>
            <div class="current-node-detail">
                <div class="node-detail-container">             
                    <div id="action-panelId" class="action-panel layout horizontal around-justified center" hidden=[[!actions.length]]>
                        <paper-menu-button no-animations id="menuBtn" vertical-offset="20" horizontal-offset="-5">
                            <paper-icon-button icon="more-vert" class="dropdown-trigger" slot="dropdown-trigger"></paper-icon-button>
                            <paper-listbox class="dropdown-content" slot="dropdown-content">
                                <template is="dom-repeat" items=[[actions]]>
                                    <paper-item class="node-action-item" on-tap="_fireEvent" event-name$="[[item.event]]">
                                        <iron-icon icon$="[[item.icon]]"></iron-icon>
                                        <label>[[item.label]]</label>
                                    </paper-item>
                                </template>
                            </paper-listbox>
                        </paper-menu-button>                  
                    </div>
                    <div id="pre-connector" key$="pre-[[uniqueId]]" on-tap="_selectElement" class="connector-lines selectable layout horizontal center-center"
                        hidden$="[[!__showConnector(showParent,'pre',isChild,data.*)]]">
                        <label>[[_getConditionalValue(data, relationKey, isParent,isParentNode)]]</label>
                    </div>
                    <div class="node-detail selectable" key$="node-[[uniqueId]]" id="node-detail" on-tap="_selectElement">
                        <div class="node-default-display" on-dblclick="_toggleSubTree">
                            <label>[[_getConditionalValue(data, labelKey)]]</label>
                        </div>
                    </div>
                    <div id="post-connector" key$="post-[[uniqueId]]" on-tap="_selectElement" class="connector-lines selectable layout horizontal center-center"
                        hidden$="[[!__showConnector(showChildren,'post',isParent,data.*)]]">
                        <label>[[_getConditionalValue(data, relationKey, isChild,isParentNode)]]</label>
                    </div>
                </div>
            </div>
            <div class="node-children-container" hidden=[[!showChildren]]>
                <div id="connector" class="connector-lines"></div>
                <div id="collapse" class="layout vertical">
                    <template is="dom-repeat" items="[[_getConditionalValue(data,childrenKey,isParent,isParentNode)]]">
                        <oe-hierarchy-node label-key=[[labelKey]] children-key=[[childrenKey]] relation-key=[[relationKey]] node-template=[[nodeTemplate]]
                            node-data-as=[[nodeDataAs]] level=[[_nextLevel(level)]] parent-data=[[data]] actions=[[actions]] is-child
                            path=[[_getPath(index)]] class="child-nodes" data={{item}}></oe-hierarchy-node>
                    </template>
                </div>
            </div>
        </div>`;
    }
   

    static get properties() {
        return {

            data: {
                type: Object,
                value: function () {
                    return {};
                }
            },
            parentData: {
                type: Object,
                value: null
            },
            isParentNode: {
                type: Boolean,
                value: false
            },
            isParent: {
                type: Boolean,
                value: false
            },
            isChild: {
                type: Boolean,
                value: false
            },
            level: {
                type: Number,
                reflectToAttribute: true
            },
            showParent: {
                type: Boolean,
                value: true
            },
            showChildren: {
                type: Boolean,
                value: true
            },
            actions: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            childIndex: {
                type: Number
            },
            path: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            labelKey: {
                type: String,
                value: "label"
            },
            childrenKey: {
                type: String,
                value: "children"
            },
            parentKey: {
                type: String,
                value: "parent"
            },
            relationKey: {
                type: String,
                value: "relationType"
            },
            nodeTemplate: {
                type: Object
            }
           
        };
    }
    /**
* Connected Callback to initiate 'change' listener with validation function.
*/
    connectedCallback() {
        super.connectedCallback();
        if (this.isParentNode) {
            this.set('level', 0);
            this.set('path', []);
        }
        var uniqValue = OEUtils.generateGuid();
        this.set('uniqueId', uniqValue);
        this.async(function () {
            this.fire('redraw-connector');
            this.set('_attached', true);
        }, 100);
        this.addEventListener('redraw-connector', e => this._drawConnector(e));
        this.addEventListener('tap', e => this._handleTap(e));
        this.addEventListener('toggle-sub-tree', e => this._toggleSubTree(e));
        this.addEventListener('toggle-parent', e => this._toggleParent(e));
        this.addEventListener('toggle-children', e => this._toggleChildren(e));
        this.addEventListener('select-node', e => this._selectNode(e));
    }
    static get observers() {
        return [
            // Observer method name, followed by a list of dependencies, in parenthesis
            '_renderNodeTemplate(data,nodeTemplate)',
            '_drawConnector(showChildren,showParent)',
            '_computeConnector(_attached, data.*)'
            
        ];
    }
    _nextLevel(level) {
        return level + 1;
    }
    _computeConnector(_attached) {
        var self = this;
        var newData = self.data;
        if (_attached && newData && newData[self.childrenKey]) {
            var childrenNodes = newData[self.childrenKey];
            var relationLengths = [];
            childrenNodes && childrenNodes.forEach(element => {
                if (element[self.relationKey]) {
                    relationLengths.push(element[self.relationKey].length);
                }
            });
            if (relationLengths.length > 0) {
                var preConnectorLength = Math.max(...relationLengths) * 7 + 36;
                self.fire('update-pre-connector-width', { width: preConnectorLength });
            }
        }
    }
    _renderNodeTemplate(data, nodeTemplate) {
        var template = nodeTemplate;
        if (template) {
            if(template.__templatizeOwner) {
                template.__templatizeOwner = null;
              }
            this.templatize(template);
            var stampObj = {};
            stampObj[this.nodeDataAs] = data;
            stampObj.showChildren = this.showChildren;
            var itemNode = this.stamp(stampObj);
            var parent = this.shadowRoot.querySelector('#node-detail');
            parent.innerHTML = "";
            parent.appendChild(itemNode.root);
            //dom(this).appendChild(itemNode.root);
            
            
        }
    }
    _getPath(index) {
        var curPath = this.path.slice();
        curPath.push(index);
        return curPath;
    }


    _drawConnector() {
        if (this.isParentNode) {
            //draw both
            this.__drawConnector(this.$.collapse, this.$.connector, this.showChildren);
            this.__drawConnector(this.$.parentcollapse, this.$.parentconnector, this.showParent);
        } else if (this.isParent) {
            this.__drawConnector(this.$.parentcollapse, this.$.parentconnector, this.showParent);
        } else {
            this.__drawConnector(this.$.collapse, this.$.connector, this.showChildren);
        }
    }
    __drawConnector(targetContainer, connector, showSubTree) {
        if (!showSubTree) {
            connector.style.height = "0px";
            return;
        }
        var curTagName = this.tagName;
        var currentChildren = [].filter.call(targetContainer.children, function (node) {
            return (node.tagName && node.tagName === curTagName);
        });
        if (currentChildren.length === 0) {
            return;
        }
        var firstChild = currentChildren[0];
        var lastChild = currentChildren[currentChildren.length - 1];
        var height = lastChild.getBoundingClientRect().top - firstChild.getBoundingClientRect().top;
        connector.style.height = height + "px";
    }



    _toggleSubTree(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (this.isParentNode) {
            this._toggleParent();
            this._toggleChildren();
        } else if (this.isParent) {
            this._toggleParent();
        } else {
            this._toggleChildren();
        }

        this.async(function () {
            this.fire('redraw-connector');
        }, 0);
    }
    _toggleChildren(event) {
        if (this.showChildren) {
            this.set('showChildren', false);
        } else if (this.data && this._hasChildren) {
            this.set('showChildren', true);
        }
    }
    _toggleParent(event) {
        if (this.showParent) {
            this.set('showParent', false);
        } else if (this.data && this._hasParent) {
            this.set('showParent', true);
        }
    }


    __showConnector(showArrFlag, name, forceFlag, deltaChange) {
        if (forceFlag) {
            return true;
        } else {
            return showArrFlag && ((name == "pre") ? this._hasParent : this._hasChildren);
        }
    }


    get _hasParent() {
        var parent = this.data[this.parentKey];
        return !!(parent && parent.length > 0);
    }
    get _hasChildren() {
        var children = this.data[this.childrenKey];
        return !!(children && children.length > 0);
    }


    _fireEvent(event) {
        var target = event.currentTarget;
        var eventName = target.getAttribute('event-name');
        if (eventName) {
            this.fire(eventName, {
                'data': this.data,
                'path': this.path,
                'node': this
            });
        }
    }
    _selectNode(event) {
        event.stopPropagation();
        this.fire('node-item-selected', {
            key: ("node-" + this.uniqueId),
            node: this
        });
    }
    _selectElement(event) {
        event.stopPropagation();
        var target = event.currentTarget;
        var selectedKey = target.getAttribute('key');
        this.fire('node-item-selected', {
            key: selectedKey,
            node: this
        });
    }
    _handleTap(event) {
        var target = event.currentTarget;
        var isSelectable = target.classList.contains('selectable');
        if (!isSelectable) {
            this.fire('reset-selected');
        }
    }



    _getConditionalValue(data, key, ignoreFlag, forceFlag) {
        if (ignoreFlag && !forceFlag) {
           
            return;
        } else {
            return data[key];
        }
    }
}
window.customElements.define(OeHierarchyNode.is, OECommonMixin(OeHierarchyNode));
