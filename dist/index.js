'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var ReactDOM = require('react-dom');
var GeminiScrollbar = require('gemini-scrollbar');

module.exports = React.createClass({
    displayName: 'GeminiScrollbar',

    propTypes: {
        autoshow: React.PropTypes.bool,
        forceGemini: React.PropTypes.bool
    },

    getDefaultProps: function getDefaultProps() {
        return {
            autoshow: false,
            forceGemini: false
        };
    },

    /**
     * Holds the reference to the GeminiScrollbar instance.
     * @property scrollbar <public> [Object]
     */
    scrollbar: null,

    componentDidMount: function componentDidMount() {
        this.scrollbar = new GeminiScrollbar({
            element: ReactDOM.findDOMNode(this),
            autoshow: this.props.autoshow,
            forceGemini: this.props.forceGemini,
            createElements: false
        }).create();
    },

    componentDidUpdate: function componentDidUpdate() {
        this.scrollbar.update();
    },

    componentWillUnmount: function componentWillUnmount() {
        this.scrollbar.destroy();
        this.scrollbar = null;
    },

    _onSizeMonitorMounted: function _onSizeMonitorMounted(ref) {
        // We need to arrange for self.scrollbar.update to be called whenever
        // the DOM is changed resulting in a size-change for our div. To make
        // this happen, we use a technique described here:
        // http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/.
        //
        // The idea is that we create an <object> element in our div, which we
        // arrange to have the same size as that div. The <object> element
        // contains a Window object, to which we can attach an onresize handler.

        // ignore unmounting.
        if (!ref) return;

        // when the size monitor object is first mounted, it may or may not
        // have been loaded. If it has, we can attach an onResize eventlistener
        // now. If not, we first need to add an onLoad handler.

        var self = this;
        var onLoad = function onLoad() {
            var win = ref.contentDocument.defaultView;
            win.addEventListener('resize', self._onResize);
        };

        if (ref.contentDocument) {
            onLoad();
        } else {
            ref.addEventListener('load', onLoad);
        }
    },

    _onResize: function _onResize() {
        if (this.scrollbar) {
            this.scrollbar.update();
        }
    },

    render: function render() {
        var _props = this.props;
        var className = _props.className;
        var children = _props.children;
        var other = _objectWithoutProperties(_props, ['className', 'children']);
        var classes = '';

        if (className) {
            classes += ' ' + className;
        }

        return React.createElement(
            'div',
            _extends({}, other, { className: classes }),
            React.createElement(
                'div',
                { className: 'gm-scrollbar -vertical' },
                React.createElement('div', { className: 'thumb' })
            ),
            React.createElement(
                'div',
                { className: 'gm-scrollbar -horizontal' },
                React.createElement('div', { className: 'thumb' })
            ),
            React.createElement(
                'div',
                { className: 'gm-scroll-view', ref: 'scroll-view' },
                children
            ),
            React.createElement('object', { ref: this._onSizeMonitorMounted, type: 'text/html',
                data: 'about:blank', style: {
                    display: "block", position: "absolute",
                    top: 0, left: 0,
                    height: "100%", width: "100%",
                    overflow: "hidden", pointerEvents: "none",
                    zIndex: -1
                } })
        );
    }
});
