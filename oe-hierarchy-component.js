/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import '@polymer/polymer/lib/mixins/element-mixin.js';
import "oe-utils/oe-utils.js";
import "./oe-hierarchy-node.js";


/**
 * `oe-hierarchy-component`
 *  ### oe-hierarchy-component
 *
 * `<oe-hierarchy-component>` is a control to recursively render a tree structured data.
 *
 * ### Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * CSS Variable | Description | Default
 * ----------------|-------------|----------
 * `--oe-connector-color` | line color that connects the different nodes | `--primary-color`
 * `--oe-node-item` | Mixin for the node | `{}`
 * `--oe-node-selected` | Mixin for the selected node | `{}`
 *
 * @customElement
 * @polymer
 * @appliesMixin OECommonMixin
 * @demo demo/demo-oe-hierarchy-component.html
 */
class OeHierarchyComponent extends OECommonMixin(PolymerElement) {

    static get is() { return 'oe-hierarchy-component'; }

    static get template() {
        return html`
        <style>
            :host {
                position: relative;
                display: block;
                box-sizing: border-box;
                padding: 16px;
            }

            oe-hierarchy-node {
                --path-color: var(--oe-connector-color, #0288d1);
                --connector-thickness: var(--oe-connector-thickness, 4px);
                --connector-selected-color: var(--oe-connector-selected, red);
                --pre-connector-width: var(--connector-width, 32px);
            }
        </style>
        <div class="component-container">
            <template is="dom-if" if="{{data}}" restamp id="container">
                <oe-hierarchy-node data={{data}} label-key=[[labelKey]] children-key=[[childrenKey]] relation-key=[[relationKey]] node-template=[[_nodeTemplate]] actions=[[nodeActions]] unique-key=[[uniqueKey]]
                    node-data-as=[[nodeDataAs]] is-parent-node></oe-hierarchy-node>
            </template>
        </div>`;
    }

    static get properties() {
        return {

            /**
             * The data based on which the tree is rendered.
             */
            data: {
                type: Object,
                value: function () {
                    return null;
                },
                observer: '_dataChanged'
            },
            /**
             * The property name containing the label in nodes.
             */
            labelKey: {
                type: String,
                value: "label"
            },
            /**
             * The property name of array containing the next level nodes.
             */
            childrenKey: {
                type: String,
                value: "children"
            },

            /**
             * The property name of array containing the prev level nodes.
             */
            parentKey: {
                type: String,
                value: "parent"
            },

            /**
             * The property name containing the relation name in nodes.
             */
            relationKey: {
                type: String,
                value: "relationType"
            },
            /**
             * The list of actions that are available in the node in addition to add/edit.
             */
            nodeActions: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            /**
             * The property name to get node data in local DOM implementation.
             */
            nodeDataAs: {
                type: String,
                value: "data"
            },
            preConnectorWidth: {
                type: Number,
                value: 0
            },
          
            /**
         * Fired when connector before a node is selected.
         *
         * @event pre-connector-selected
         */

            /**
             * Fired when connector after a node is selected.
             *
             * @event post-connector-selected
             */

            /**
             * Fired when an node is selected
             *
             * @event node-selected
             */

            /**
             * Fired when any of the selected element are reset.
             *
             * @event deselect-item
             */

            /**
             * Fired when delete key is pressed after a pre-connector is selected.
             * Denotes that the current child is removed from its parent obcject.
             *
             * @event unlink-child-node
             */

            /**
             * Fired when delete key is pressed after a post-connector is selected.
             * Denotes that the current parent node request removal of all children.
             *
             * @event unlink-all-child-node
             */

            /**
             * Fired when delete key is pressed after a node is selected.
             * Denotes that the current node request deletion.
             *
             * @event remove-node
             */
        };
    }
    /**
    * Connected Callback to initiate 'change' listener with validation function.
    */
    connectedCallback() {
        super.connectedCallback();
        this.selectedData = {};
        this.addEventListener('node-item-selected', e => this._nodeItemSelected(e));
        this.addEventListener('reset-selected', e => this._resetSelected(e));
        this.addEventListener('update-pre-connector-width', e => this._updatePreConnectorWidth(e));
    }
    ready() {
        super.ready();
        if (!this.ctor) {
            const nodeTemplate = this.querySelector('template');
            if (nodeTemplate) {
                this.set('_nodeTemplate', nodeTemplate);
            }
        }
    }
    _dataChanged() {
        this.$.container.render();
    }
    _nodeItemSelected(event) {
        var key = event.detail.key;
        if (key !== this.selectedData.key) {
            var prevSelected = this.querySelector('[key="' + this.selectedData.key + '"]');
            if (prevSelected) {
                prevSelected.classList.remove('selected');
            }
            var curSelected = this.querySelector('[key="' + key + '"]');
            if (curSelected) {
                curSelected.classList.add('selected');
                var selected = {
                    key: key,
                    data: event.detail.node.data,
                    node: event.detail.node,
                    type: curSelected.id
                };
                this.set('selectedData', selected);

                var eventName = "";
                switch (this.selectedData.type) {
                    case "pre-connector":
                        eventName = "pre-connector-selected";
                        break;
                    case "post-connector":
                        eventName = "post-connector-selected";
                        break;
                    case "node-detail":
                        eventName = "node-selected";
                        break;
                    default:
                        eventName = "selection-changed";
                }
                this.fire(eventName, {
                    node: this.selectedData.data,
                    parent: this.selectedData.node.parentData
                });
            }
        }
        this.listen(document, 'keydown', '_keyDownListener');
    }
    _keyDownListener(event) {
        var key = event.key;
        if (key === "Delete") {
            var eventName = "";
            switch (this.selectedData.type) {
                case "pre-connector":
                    eventName = "unlink-child-node";
                    break;
                case "post-connector":
                    eventName = "unlink-all-child-node";
                    break;
                case "node-detail":
                    eventName = "remove-node";
                    break;
                default:
                    eventName = "delete-key-pressed";
            }
            this.fire(eventName, {
                node: this.selectedData.data,
                parent: this.selectedData.node.parentData
            });
        }
    }
    _resetSelected(event) {
        var prevSelected = this.querySelector('[key="' + this.selectedData.key + '"]');
        if (prevSelected) {
            prevSelected.classList.remove('selected');
        }
        this.set('selectedData', {});
        this.fire('deselect-item');
        this.unlisten(document, 'keydown', '_keyDownListener');
    }
    _updatePreConnectorWidth(event) {
        if (this.preConnectorWidth < event.detail.width) {
            this.set('preConnectorWidth', event.detail.width);
           // getComputedStyle(this).getPropertyValue('--connector-width') = this.preConnectorWidth + 'px';
        //    this.updateStyles({
        //     '--connector-width': this.preConnectorWidth + 'px',
        //   });
        this.changeTheme();
        }
    }
   changeTheme() {
          this.updateStyles({
            '--connector-width': this.preConnectorWidth + 'px',
          });
        }
    
}
window.customElements.define(OeHierarchyComponent.is, OeHierarchyComponent);