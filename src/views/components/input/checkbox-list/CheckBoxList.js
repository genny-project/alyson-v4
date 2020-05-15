import React from 'react';
import { array, bool, number, object, func, string } from 'prop-types';
import debounce from 'lodash.debounce';
import { Box, Text } from '../../index';
import { isArray, isString } from '../../../../utils';
import BaseCheckBox from '../base-checkbox';
import { SubcomponentThemeHandler } from '../../form/theme-handlers';

class CheckBoxList extends React.Component {
  static defaultProps = {
    items: [],
    // value: [],
    multiSelect: true,
    numberOfColumns: 3,
    updateIconForPreviousItems: false,
  };

  static propTypes = {
    // value: array,
    value: string,
    numberOfColumns: number,
    items: array,
    multiSelect: bool,
    icons: object,
    onChangeValue: func,
    subcomponentProps: object,
    editable: bool,
    disabled: bool,
    error: string,
    radio: bool,
    updateIconForPreviousItems: bool,
    rating: bool,
  };

  constructor( props ) {
    super( props );

    this.handleChangeDebounced = debounce( this.handleChangeDebounced, 1000 );
  }

  state = {
    items: [],
    selected: null,
  };

  componentDidMount() {
    // eslint-disable-next-line max-len
    if ( isArray( this.props.value, { ofMinLength: 1 }) && isArray(( this.props.items, { ofMinLength: 1 }))) {
      this.setState({
        items: this.props.items,
        selected: this.props.value,
      });
    }
  }

  componentDidUpdate( prevProps, prevState ) {
    if  ( this.props.items !== prevProps.items ) {
      this.prePopulate( 'items', this.props.items );
    }
    if ((
      prevProps.value !== this.props.value &&
        this.state.selected !== this.props.value
    ) ||
        prevState.selected !== this.state.selected
    ) {
      this.prePopulate( 'selected', this.props.value );
    }
  }

  prePopulate = ( key, value ) => {
    this.setState({
      [key]: value,
    });
  }

  handlePress = value => () => {
    const { selected } = this.state;
    const { multiSelect } = this.props;

    this.setState(
      state => {
        if (
          !isArray( state.selected ) ||
          !isString( value )
        ) {
          return { selected: [value] };
        }

        /* Dont allow to select more than one button/icon */
        if ( !multiSelect && selected.length >= 1 ) {
          /* if the selected value is more or equal to 1 dont allow to add the value */

          return { selected: [value] };
        }

        if ( state.selected.includes( value )) {
          return { selected: state.selected.filter( item => item !== value ) };
        }

        return { selected: [...state.selected, value] };
      },
      () => {
        this.handleChangeDebounced ( value );
      }
    );
  };

    handleChangeDebounced = ( value ) => {
      this.props.onChangeValue( value );
    };

    render() {
      const { numberOfColumns, icons, radio, updateIconForPreviousItems, rating } = this.props;

      const numberOfButtonsToRender = radio
        ? numberOfColumns > 3 ? 3 : numberOfColumns
        : rating
          ? numberOfColumns > 5 ? 5 : numberOfColumns
          : numberOfColumns;

      const { items, selected } = this.state;

      const filteredValue = items.map(( item, index ) => {
        // eslint-disable-next-line max-len
        if (( isArray( selected ) || isString( selected )) && ( selected[0] === item.value || this.state.selected === item.value )) {
          var  selectedIndex = index;

          return selectedIndex;
        }
      }).filter(( item ) => ( item !== undefined ));

      return (
        <SubcomponentThemeHandler
          subcomponentProps={this.props.subcomponentProps}
          editable={this.props.editable}
          disabled={this.props.disabled}
          error={this.props.error}
        >
          {({
            filterComponentProps,
          }) => {
            return (
              <Box
                flexDirection="row"
                flexWrap="wrap"
              >
                {isArray( items, { ofMinLength: 1 }) ? (

                  items.map(( item, index ) => {
                    const isBeforeSelectedItem = index < filteredValue;

                    return (
                      <Box
                        width={rating  ? `${100 / ( numberOfButtonsToRender * 4 )}%` : `${100 / numberOfButtonsToRender}%`}
                        key={item.value}
                      >
                        <BaseCheckBox
                          icons={icons}
                          onPress={this.handlePress( item.value )}
                          key={item.value}
                          checkBoxStatus={updateIconForPreviousItems
                            ?  ( isArray( selected ) || isString( selected )) &&
                              selected.includes( item.value )
                              ? true
                              : isBeforeSelectedItem
                                ? true
                                : false
                            : (
                              ( isArray( selected ) || isString( selected )) &&
                          selected.includes( item.value )
                                ? true
                                : false
                            )}
                          id={item.value}
                          label={rating ? null : item.label}
                          stateBasedProps={
                        filterComponentProps( 'input-item', { selected: isArray( selected ) && selected.includes( item.value ) })
                      }
                        />
                      </Box>
                    );
                  })
                ) : (
                  <Text
                    text="No Items to Show"
                  />
                )}
              </Box>
            );
          }
    }
        </SubcomponentThemeHandler>

      );
    }
}

export default CheckBoxList;
