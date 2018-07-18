Without linking. Compatible with expo.

![](https://github.com/greenarea/react-native-overlay-section/blob/master/assets/example.gif)

https://github.com/greenarea/react-native-overlay-section

## Installation

```
yarn add react-native-overlay-section
```
or 
```
npm i react-native-overlay-section --save
```

## Usage example



```javascript
import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import SlideUp from 'react-native-overlay-section';

export default class App extends Component {

    constructor (props) {
        super(props);
    }
    
    exampleContent = () => {
        return (
            <View>
                <Text>This is test text</Text>
            </View>
        )
    }
    
    render() {
        return (
            <View style={{flex: 1}}>
                <Text>Hello</Text>
                <SlideUp contentSection={this.exampleContent()} />
            </View>
        )
    }
}
```

| props           | type | description |
|-----------------|------|-------------|
| visibleHeight   | number     | Height of all visible content include dragSection            |
| draggableHeight | number     | Height of dragSection            |
| contentSection  | component     | Pass your custom object to render it            |
| dragSection     | component     | Section with PanResponder            |
| dragBgColor     | string     | Background color of dragSection            |
| contentSectionBgColor  | string     | backgroundColor of contentSection            |
| dragArrowColor  | string     | Color of default arrow            |

All props are not required*

## Milestones: 
- [ ] Several section stop points, like 30%, 50%, 100% from bottom
- [ ] Arrangement from top to bottom.
- [ ] Fit to content
