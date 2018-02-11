import React, { Component } from 'react';
import {
    View,
    Animated,
    Dimensions,
    PanResponder,
    Easing,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types'

const propTypes = {
    visibleHeight: PropTypes.number,
    draggableHeight: PropTypes.number,
    contentSection: PropTypes.object,
    dragSection: PropTypes.object,
    dragBgColor: PropTypes.string,
    contentSectionBgColor: PropTypes.string,
    dragArrowColor: PropTypes.string
};

const defaultProps = {
    visibleHeight: 0,
    draggableHeight: 40,
    contentSection: null,
    dragSection: null,
    dragBgColor: '#ddd',
    contentSectionBgColor: '#ddd',
    dragArrowColor: '#888'
};

export default class SlideUp extends Component {

    currentModalPosition = 'bottom';

    constructor (props) {
        super(props);
        this.props = props;

        let visibleHeight = this.props.visibleHeight + 24;

        this._slideDown = this._slideDown.bind(this);
        this._slideUp = this._slideUp.bind(this);

        this._renderContentSection = this._renderContentSection.bind(this);
        this._renderDraggableSection = this._renderDraggableSection.bind(this);
        this._defaultDraggableSection = this._defaultDraggableSection.bind(this);

        this.screenSize = Dimensions.get('window');
        this.maxBottom = this.screenSize.height - (visibleHeight + this.props.draggableHeight);
        this.maxTop = 0;

        this.state = {scrollY: new Animated.Value(this.maxBottom)};
    }

    componentWillMount () {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder.bind(this),
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder.bind(this),
            onPanResponderGrant: this._handlePanResponderGrant.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this),
            onPanResponderRelease: this._handlePanResponderEnd.bind(this),
            onPanResponderTerminate: this._handlePanResponderEnd.bind(this)
        });
    }

    _defaultDraggableSection () {
        const {dragArrowColor} = this.props
        const animatedSkewLeft = this.state.scrollY.interpolate({
            inputRange: [this.maxTop, this.maxBottom],
            outputRange: ['20deg', '-20deg']
        });
        const animatedSkewRight = this.state.scrollY.interpolate({
            inputRange: [this.maxTop, this.maxBottom],
            outputRange: ['-20deg', '20deg']
        });
        const animatedTranslateY = this.state.scrollY.interpolate({
            inputRange: [this.maxTop, this.maxBottom],
            outputRange: [6, -6]
        });
        return <View>
          <Animated.View style={{
              position: 'absolute',
              borderRadius: 4,
              backgroundColor: dragArrowColor,
              width: 20,
              height: 4,
              transform: [{skewY: animatedSkewLeft}, {translateX: -9}, {translateY: animatedTranslateY}]
          }}/>

          <Animated.View style={{
              position: 'absolute',
              borderRadius: 4,
              backgroundColor: dragArrowColor,
              width: 20,
              height: 4,
              transform: [{skewY: animatedSkewRight}, {translateX: 9}, {translateY: animatedTranslateY}]
          }}/>
        </View>
    }

    _renderDraggableSection () {
        const {dragSection} = this.props;
        if (!dragSection) {
            return this._defaultDraggableSection()
        }
        return dragSection;
    }

    _renderContentSection () {
        const {contentSection} = this.props;
        if (!contentSection) {
            return null
        }
        return contentSection;
    }


    render() {
        const { visibleHeight, draggableHeight, contentSectionBgColor, dragBgColor } = this.props
        return (
            <Animated.View
                style={{
                    backgroundColor: contentSectionBgColor,
                    position: 'absolute',
                    width: '100%',
                    zIndex: 300,
                    height: '100%',
                    minHeight: visibleHeight,
                    // borderTopLeftRadius: animatedBorderRaduis,
                    // borderTopRightRadius: animatedBorderRaduis,
                    // margin: animatedMargin,
                    // borderWidth: animatedBorder,
                    borderColor: '#ccc',
                    transform: [
                        {translateY: this.state.scrollY},
                        // {translateX: animatedTranslateX}
                    ]
                }}>

              <View {...this._panResponder.panHandlers}>
                <TouchableOpacity onPress={() => {
                    if (this.currentModalPosition === 'top') {
                        this._slideDown();

                        return null;
                    }

                    this._slideUp();
                }} style={{
                    height: draggableHeight,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: dragBgColor
                    // borderTopWidth: 1,
                    // borderTopColor: '#ddd'
                }}>
                    {this._renderDraggableSection()}
                </TouchableOpacity>
                  {this._renderContentSection()}
              </View>
            </Animated.View>
        );
    }

    _handleStartShouldSetPanResponder () {
        return true;
    }

    _handleMoveShouldSetPanResponder (evt, gestureState) {
        return Math.abs(gestureState.dy) > 5;
    }

    _handlePanResponderGrant () {
        return true;
    }

    _handlePanResponderEnd (e, gestureState) {

        let percent = (e.nativeEvent.pageY - this.maxTop) / (this.maxBottom - this.maxTop);
        if (percent < 0) {
            percent = 0;
        }

        if (percent > 1) {
            percent = 1;
        }

        percent *= 100;

        const way = gestureState.dy < 0 ? 'up' : 'down';
        let animateTo = 0;

        if (way === 'up') {
            if (percent < 85) {
                animateTo = 'up';
            }
            else {
                animateTo = 'down';
            }
        }
        else {
            animateTo = 'down';
        }

        if (percent >= 99 && gestureState.dy === 0) {
            animateTo = 'up';
        }

        if (animateTo === 'up') {
            this._slideUp();

            return true;
        }
        this._slideDown();
    }

    _handlePanResponderMove (e, gestureState) {
        let delta = this.maxBottom - gestureState.y0;
        if (delta > 0 && this.currentModalPosition === 'top') {
            delta = this.maxTop - gestureState.y0;
        }

        let position = gestureState.moveY + delta;

        Animated.timing(this.state.scrollY, {
            toValue: position,
            // speed: 30,
            duration: 0,
            easing: Easing.back()
        }).start();
    }

    _slideUp () {
        this.currentModalPosition = 'top';

        Animated.spring(this.state.scrollY, {
            toValue: this.maxTop,
            easing: Easing.back(),
            duration: 0
        }).start();
    }

    _slideDown () {
        this.currentModalPosition = 'bottom';

        Animated.spring(this.state.scrollY, {
            toValue: this.maxBottom,
            easing: Easing.back(),
            duration: 0
        }).start();
    }
}
SlideUp.propTypes = propTypes;
SlideUp.defaultProps = defaultProps;