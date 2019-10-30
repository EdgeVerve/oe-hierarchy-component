/** ©2017-2018 EdgeVerve Systems Limited (a fully owned Infosys subsidiary), Bangalore, India. All Rights Reserved.
* The EdgeVerve proprietary software program ("Program"), is protected by copyrights laws, international treaties 
* and other pending or existing intellectual property rights in India, the United States and other countries.
* The Program may contain/reference third party or open source components, the rights to which continue to
* remain with the applicable third party licensors or the open source community as the case may be and nothing
* here transfers the rights to the third party and open source components, except as expressly permitted.
* Any unauthorized reproduction, storage, transmission in any form or by any means (including without limitation 
* to electronic, mechanical, printing, photocopying, recording or  otherwise), or any distribution of this 
* Program,or any portion of it, may result in severe civil and criminal penalties, and will be prosecuted to 
* the maximum extent possible under the law.
*/
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import '@polymer/polymer/lib/elements/dom-bind';
import '@polymer/iron-demo-helpers/demo-pages-shared-styles';
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";

window.customElements.define("custom-node", class extends OECommonMixin(PolymerElement) {
    static get template() {
        return html`
            <style include="iron-flex iron-flex-alignment">
                :host{
                    position:relative;
                    display:block;
                    box-sizing:border-box;
                }
                .component-container{
                    width:150px;
                    height:100px;
                    outline:1px solid red;
                    background: #FFF;
                    outline-offset:-1px;
                }
                .node-header{
                    background: red;
                    height: 30px;
                    padding: 0px 8px;
                }

                .type-GCIF{
                    background: blueviolet;
                }
                .type-ECIF{
                    background: yellowgreen;
                }
                .type-GPIF{
                    background: grey;
                    color:#FFF;
                }

                .node-header label{
                    color: #FFF;
                    font-size: 12px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .node-header iron-icon{
                    color: #FFF;
                    transform: rotate(-90deg);
                }
                iron-icon{
                    --iron-icon-width:16px;
                    --iron-icon-height:16px;
                }
                .node-footer{
                    height: 30px;
                    font-size: 12px;
                }

                .footer-btn iron-icon{
                    padding: 0px 8px;
                } 

                .strech-horizontal{
                    @apply --layout-horizontal;
                    @apply --layout-around-justified;
                    @apply --layout-center;
                }
            </style>
            <div class="component-container layout vertical">
                <div class$="node-header strech-horizontal type-[[data.type]]">
                        <label class="flex">
                            Name : [[data.name]]
                        </label>
                        <iron-icon hidden=[[!hasChildren]] icon="[[_computeIcon(showChildren)]]" id="toggleIcon" on-tap="_toggle"></iron-icon>
                </div>
                <div class="node-main-detail flex layout horizontal center-center">
                    <label  hidden=[[!hasChildren]] >
                            Children : [[data.children.length]]
                    </label>
                    <label  hidden=[[hasChildren]] >
                            Has no children
                    </label>
                </div>
                <div class="node-footer strech-horizontal">
                    <div class="footer-btn  strech-horizontal">
                        <iron-icon icon="add-circle"></iron-icon>
                        <label>Add</label>
                    </div>
                    <div class="footer-btn  layout horizontal around-justified center">
                            <iron-icon icon="create"></iron-icon>
                            <label>Modify</label>
                    </div>
                </div>                
            </div>`;
    }

    static get properties() {
        return {

            data: {
                type: Object
            },
            showChildren: {
                type: Boolean
            }
        };
    }
    static get observers() {
        return [
            // Observer method name, followed by a list of dependencies, in parenthesis
            '_calculateChildren(data.*)'
        ]
    }

    _calculateChildren() {
        this.set('hasChildren', !!(this.data.children && (this.data.children.length > 0)))
    }
    _toggle(ev) {
        ev.stopPropagation();
        this.fire('toggle-children');
        this.set('showChildren', !this.showChildren);
    }
    _computeIcon(showChildren) {
        return showChildren ? "expand-less" : "expand-more";
    }
});