var React = require('react');
var ReactDOM = require('react-dom');
var GeminiScrollbar = require('gemini-scrollbar');

module.exports = React.createClass({
    displayName: 'GeminiScrollbar',

    propTypes: {
        autoshow: React.PropTypes.bool,
        forceGemini: React.PropTypes.bool,
        onResize: React.PropTypes.func,
    },

    getDefaultProps() {
        return {
            autoshow: false,
            forceGemini: false
        }
    },

    /**
     * Holds the reference to the GeminiScrollbar instance.
     * @property scrollbar <public> [Object]
     */
    scrollbar: null,

    componentDidMount() {
        var self = this;
        var element = ReactDOM.findDOMNode(this);

        // We need to arrange for self.scrollbar.update to be called whenever
        // the DOM is changed resulting in a size-change for our div. To make
        // this happen, we use a technique described here:
        // http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/.
        //
        // The idea is that we create an <object> element in our div, which we
        // arrange to have the same size as that div. The <object> element
        // contains a Window object, to which we can attach an onresize handler.

        var sizeObj = element.querySelector('.gm-size-monitor');
        if (sizeObj.contentDocument) {
            this._onSizeMonitorLoad(sizeObj);
        } else {
            sizeObj.onload = function (e) { self._onSizeMonitorLoad(this) };
        };

        this.scrollbar = new GeminiScrollbar({
            element: element,
            autoshow: this.props.autoshow,
            forceGemini: this.props.forceGemini,
            createElements: false
        }).create();
    },

    componentDidUpdate() {
        this.scrollbar.update();
    },

    componentWillUnmount() {
        this.scrollbar.destroy();
        this.scrollbar = null;
    },

    _onSizeMonitorLoad(obj) {
        var win = obj.contentDocument.defaultView;
        win.addEventListener('resize', this._onResize);
    },

    _onResize() {
        if (this.scrollbar) {
            this.scrollbar.update();
        }
        if (this.props.onResize) {
            this.props.onResize();
        }
    },

    render() {
        var {className, children, onResize, ...other} = this.props,
            classes = '';

        if (className) {
            classes += ' ' + className;
        }

        return (
            <div {...other} className={classes}>
                <div className='gm-scrollbar -vertical'>
                    <div className='thumb'></div>
                </div>
                <div className='gm-scrollbar -horizontal'>
                    <div className='thumb'></div>
                </div>
                <div className='gm-scroll-view' ref='scroll-view'>
                    {children}
                </div>
                <object className='gm-size-monitor'
                    type='text/html' data='about:blank'
                    style={{
                        display: "block", position: "absolute",
                        top: 0, left: 0,
                        height: "100%", width: "100%",
                        overflow: "hidden", pointerEvents: "none",
                        zIndex: -1,
                    }} />
            </div>
        );
    }
});
