import React, { Component } from 'react';
import { node, object, bool, func } from 'prop-types';
import { Box } from '../../../index';

class InputTagBody extends Component {
  static propTypes = {
    children: node,
    bodyProps: object,
    isOpen: bool,
    handleToggleMenu: func,
    onRef: func,
  }

  render() {
    const { children, bodyProps, isOpen, handleToggleMenu, onRef } = this.props;

    return (
      <Box
        zIndex={1}
        {...bodyProps}
        onRef={onRef}
      >
        <Box
          position="relative"
          flexDirection="column"
        >
          {children}
          {
            isOpen ? (
              <Box
                zIndex={5}
                position="fixed"
                top={0}
                left={0}
                width="100%"
                height="100%"
                onClick={handleToggleMenu}
              />
            ) : null }
        </Box>
      </Box>
    );
  }
}

export default InputTagBody;
