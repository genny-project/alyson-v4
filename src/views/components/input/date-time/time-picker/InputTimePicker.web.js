/**
 * Adapted from https://codesandbox.io/s/j47zv28xkw
 */

import React, { PureComponent } from 'react';
import { string, func, oneOfType, object, bool, shape } from 'prop-types';
import { getHours, getMinutes } from 'date-fns';
import { Input, Box, Touchable, Icon, Fragment } from '../../../../components';
import { getDeviceSize } from '../../../../../utils';
import DateTimeBase from '../date-time-base';

class InputDatePicker extends PureComponent {
  static defaultProps = {
    displayFormat: 'hh:mm A',
    calendarHeaderColor: 'white',
    calendarHeaderTextColor: 'black',
    placeholder: 'Please select a date...', // eslint-disable-line
    // placeholder: 'day month, year',
  }

  static propTypes = {
    displayFormat: string,
    calendarHeaderColor: string,
    calendarHeaderTextColor: string,
    onChangeValue: func,
    value: oneOfType( [string, object] ),
    testID: string,
    editable: bool,
    placeholder: string,
    subcomponentProps: shape({
      'input-field': object,
      'input-wrapper': object,
      'input-icon': object,
      'input-item-wrapper': object,
      'input-item': object,
      'input-selected-wrapper': object,
      'input-selected': object,
    }),
  }

  selectionValues = {};

  selectionFields = [];

  inputSections = [];

  state = {
  }

  render() {
    // console.warn( '%c Time', 'color:yellow', this.props );
    const {
      displayFormat,
      subcomponentProps,
      value,
      testID,
      editable,
      onChangeValue, // eslint-disable-line no-unused-vars
      ...restProps
    } = this.props;

    return (
      <DateTimeBase
        value={value}
        displayFormat={displayFormat}
        onChangeValue={onChangeValue}
        subcomponentProps={subcomponentProps}
      >
        {({
          getInputProps,
          // getWeeksInMonth,
          inputValue, //
          date, //
          selectedItem, //
          selectItem,
          isOpen,
          setDate,
          hours,
          clockFormat,
          minutes,
          selection,
          onRef,
          open,
          close,
          toggle,
          onBlur,
          onKeyPress,
          onSelectionChange,
          selectHour,
          selectMinute,
          selectAmPm,
          componentProps,
          updateState,
        }) => {
          // console.warn( '%c InputTime', 'color:orange', { getInputProps: getInputProps, inputValue: inputValue, date: date, selectedItem: selectedItem, selectItem: selectItem, setDate: setDate, selection: selection, onRef: onRef, close: close, onBlur: onBlur, onKeyPress: onKeyPress, onSelectionChange: onSelectionChange, isOpen: isOpen,  toggle: toggle });

          // const weeksInCurrentMonth = getWeeksInMonth();
          // const isDisabled = dateValue => !isSameMonth( date, dateValue );
          // const isSelectedDay = date => (
          //   selectedItem &&
          //   format( selectedItem ) === format( date )
          // );

          return (
            <Fragment>
              <Box
                // width="100%"
                zIndex={10}
                position="relative"
              >
                <Input
                  {...getInputProps({
                    ...restProps,
                    type: 'text',
                // editable: false,
                    updateValueWhenFocused: true,
                    isUsingMask: true,
                    value: inputValue || displayFormat,
                // placeholder,
                    onRef: onRef,
                    dynamicWidth: true,
                    ignoreOnChange: true,
                  })}
                  onChange={null}
                  onFocus={close}
                  onBlur={onBlur}
                  onKeyPress={onKeyPress( selectedItem, selectItem, setDate, date )}
                  selection={selection}
                  onSelectionChange={onSelectionChange}
                  testID={`input-date-picker ${testID}`}
                  showLogs
                  identifier="timepicker"
                  onChangeState={updateState( 'input-field' )}
                  // {...this.props.inputFieldProps}
                />
                {
                  editable ? (
                    <Touchable
                      withFeedback
                      disabled={!this.props.editable}
                      onPress={this.props.editable ? toggle : null}
                      onFocus={open}
                      accessibilityRole="link"
                      testID={`input-date-picker ${testID}`}
                      position="absolute"
                      right={0}
                      zIndex={5}
                      transform={[{ translateY: '-50%' }]}
                      top="50%"
                    >
                      <Box
                        height="100%"
                        alignItems="center"
                        transform={[
                          { rotate: isOpen ? '0deg' : '180deg' },
                        ]}
                      >
                        <Icon
                          name="keyboard-arrow-up"
                          color="black"
                          size="md"
                          cursor="pointer"
                        />
                      </Box>
                    </Touchable>
                  ) : null
                }
              </Box>
              {isOpen && editable ? (
                <Box
                  flexDirection="column"
                  marginTop="0.5rem"
                  shadowColor="#000"
                  shadowOpacity={0.4}
                  shadowRadius={5}
                  shadowOffset={{
                    width: 0,
                    height: 0,
                  }}
                // borderRadius={5}
                  overflow="hidden"
                  backgroundColor="#FFF"
                  position="absolute"
                  paddingY={5}
                  zIndex={20}
                  top="100%"
                  {...( getDeviceSize() === 'sm' ? { width: '100%' } : null )}
                  onPress={event => {
                    event.stopPropagation();
                  }}
                  componentID="INPUT-ITEM-WRAPPER"
                  {...componentProps['input-item-wrapper']}
                >
                  <Box
                    justifyContent="space-between"
                    alignItems="center"
                    padding={5}
                    onPress={event => {
                      event.stopPropagation();
                    }}
                    zIndex={1}
                    width="100%"
                  >

                    {/*  ----------------------------
                            HOUR DROPDOWN
                    ------------------------------*/}

                    <Box
                      flex={1}
                    >
                      <Input
                        type="dropdown"
                        items={hours.map(( hour, index ) => (
                          { value: hour, label: hour, weight: index }
                        ))}
                        identifier="TIMEDROPDOWN"
                        sortByWeight
                        onChangeValue={selectHour( setDate, date )}
                        color="#000"
                        backgroundColor="#FFF"
                        padding={5}
                        borderRadius={10}
                        borderWidth={0}
                        textAlign="center"
                        cursor="pointer"
                        testID={`input-date-picker-hour ${testID}`}
                        nonTabable
                        editable
                        placeholder={selectedItem
                          ? getHours( selectedItem ) > 9
                            ? getHours( selectedItem ) > 12 ? `0${getHours( selectedItem ) - 12}` : getHours( selectedItem )
                            : `0${getHours( selectedItem )}`
                          : 'Hours'}
                        onChangeState={updateState( 'input-field' )}
                        value={selectedItem}
                      />
                    </Box>

                    {/*  ----------------------------
                            MINUTES DROPDOWN
                    ------------------------------*/}

                    <Box
                      flex={1}
                    >
                      <Input
                        type="dropdown"
                        items={minutes.map(( minute, index ) => (
                          { value: minute, label: minute, weight: index }
                        ))}
                        identifier="MINUTEDROPDOWN"
                        sortByWeight
                        onChangeValue={selectMinute( setDate, date )}
                        color="#000"
                        backgroundColor="#FFF"
                        padding={5}
                        borderRadius={10}
                        borderWidth={0}
                        textAlign="center"
                        cursor="pointer"
                        testID={`input-date-picker-minute ${testID}`}
                        nonTabable
                        editable
                        placeholder={selectedItem
                          ? getMinutes( selectedItem ) > 9
                            ? getMinutes( selectedItem )
                            : `0${getMinutes( selectedItem )}`
                          : 'Minutes'}
                        onChangeState={updateState( 'input-field' )}
                      />
                    </Box>

                    {/*  ----------------------------
                            AMPM DROPDOWN
                    ------------------------------*/}

                    <Box
                      flex={1}
                    >
                      <Input
                        type="dropdown"
                        items={clockFormat.map(( format, index ) => (
                          { value: format, label: format, weight: index }
                        ))}
                        onChangeValue={selectAmPm( setDate, date )}
                        color="#000"
                        backgroundColor="#FFF"
                        padding={5}
                        borderRadius={10}
                        borderWidth={0}
                        textAlign="center"
                        cursor="pointer"
                        testID={`input-date-picker-ampm ${testID}`}
                        nonTabable
                        editable
                        placeholder={selectedItem
                          ?  getHours( selectedItem ) < 12 ? 'Am' : 'Pm'
                          : 'Am / Pm'
                        }
                      />
                    </Box>
                  </Box>

                </Box>
              ) : null}
            </Fragment>
          );
        }}
      </DateTimeBase>
    );
  }
}

export default InputDatePicker;
