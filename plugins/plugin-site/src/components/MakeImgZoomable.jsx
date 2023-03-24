import React, {useEffect, useState} from 'react';
import parse from 'html-react-parser';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

function MakeImgZoomable(reactObj) {
    // convert dangerouslySetInnerHTML string to React component
    const htmlString = reactObj.props.dangerouslySetInnerHTML.__html;
    let node = parse(htmlString);
    // process recursively
    node = wrapImgWithZoomRecursively(node);
    return node;
}

function wrapImgWithZoomRecursively(node) {
    const props = node.props || {};
    const children = React.Children.toArray(props.children);
    // stop recursion when there are no children
    if(children.length === 0) {
        return node;
    }
    const newProps = {};
    // traverse each child
    const newChildren = children.map(child => {
        if(child.type === 'img') {
            // disable parent from jumping to another page when the child is an img
            if(node.type === 'a'){
                newProps['target'] = '';
                newProps['href'] = '#/';
            }
            // wrap the img with Zoom, making it zoomable
            return wrapWithZoom(child);
        }else {
            // process recursively
            return wrapImgWithZoomRecursively(child);
        }
    });
    return React.cloneElement(node, newProps, ...newChildren);
}

const wrapWithZoom = (img) => {
    // link: https://github.com/rpearce/react-medium-image-zoom
    const [wrapElement, setWrapElement] = useState('span');
    useEffect(() => {
        setWrapElement('span');
    });
    return (<Zoom wrapElement={wrapElement}>
        {img}
    </Zoom>);
};

export default MakeImgZoomable;
