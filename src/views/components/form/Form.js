import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { string, object, bool } from 'prop-types';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import dlv from 'dlv';
import dset from 'dset';
import { isArray, isObject, isString } from '../../../utils';
import { Bridge } from '../../../utils/vertx';
import { Box, Text, Fragment } from '../index';
import FormGroup from './group';

class Form extends Component {
  static defaultProps = {
    loadingText: 'Loading form...',
    testID: 'form',
    shouldSetInitialValues: true,
    inheritedProps: {},
  }

  static propTypes = {
    questionGroupCode: string,
    asks: object,
    baseEntities: object,
    loadingText: string,
    testID: string,
    shouldSetInitialValues: bool,
    inheritedProps: object,
    fullWidth: bool,
    isClosed: bool,
  }

  inputRefs = {}
  errors = {}
  values = {}
  lastSentValues = {}
  randId = Math.floor( Math.random() * Math.floor( 1000 ));

  state = {
    validationList: {},
    initialValues: {},
    questionGroups: [],
    // formStatus: null,
    missingBaseEntities: [],
  }

  componentDidMount() {
    this.setInitialValues();
    this.setValidationList();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { questionGroupCode } = this.props;
    const { questionGroups } = this.state;
    // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
    // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP"
    // )
    //   console.warn('update', {questionGroupCode, questionGroups, newGroups: this.getQuestionGroups()})

    const checkIfSetNeeded = () => {
      return (
        this.state.questionGroups.length !== prevState.questionGroups.length ||
        questionGroupCode !== prevProps.questionGroupCode
      );
    };

    if (
      questionGroupCode !== prevProps.questionGroupCode ||
      isArray( questionGroups, { ofExactLength: 0 })
    ) {
      // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
      // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
      //   console.warn('update1', questionGroupCode)

      const newGroups = this.getQuestionGroups();

      if ( newGroups.length > 0 ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups, missingBaseEntities: [] }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();

            return;
          }
        });
      }
    }

    if (
      isArray( this.state.missingBaseEntities, { ofMinLength: 1 })
    ) {
      // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
      // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
      //   console.warn('update2', questionGroupCode, this.state.missingBaseEntities)

      if (
        this.checkIfNewBaseEntities( this.props )
      ) {
        // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
        // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
        //   console.warn('update2checked')

        this.setInitialValues();
        this.setValidationList();

        return;
      }
    }

    if (
      this.checkForUpdatedQuestionTargets( this.props )
    ) {
      // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
      // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
      //   console.warn('update3', questionGroupCode)

      const newGroups = this.getQuestionGroups();

      if ( newGroups.length > 0 ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups, missingBaseEntities: [] }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();

            return;
          }
        });
      }
    }

    if (
      this.checkForUpdatedAttributeValues( this.props )
    ) {
      // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
      // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
      //   console.warn('update4', questionGroupCode)

      this.setInitialValues();
      this.setValidationList();

      return;
    }

    if (
      this.checkForRemovedQuestions( this.props )
    ) {
      // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
      // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
      // console.warn('update5', questionGroupCode)

      const newGroups = this.getQuestionGroups();

      if ( newGroups.length > 0 ) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ questionGroups: newGroups, missingBaseEntities: [] }, () => {
          if ( checkIfSetNeeded ) {
            this.setInitialValues();
            this.setValidationList();

            return;
          }
        });
      }
    }

    // if ( questionGroupCode === "QUE_BUCKET_CONTENT_SBE_APPLIED_APPLICATIONS_GRP" ||
    // questionGroupCode === "QUE_BUCKET_CONTENT_SBE_SHORTLISTED_APPLICATIONS_GRP" )
    //   console.warn('no-update')
  }

  setInitialValues = () => {
    const { questionGroups } = this.state;
    const { attributes } = this.props.baseEntities;

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      return;
    }

    const checkForBE = ( code ) => {
      const beAttributes = dlv( attributes, `${code}` );

      if (
        !isObject( beAttributes, { isNotEmpty: true }) &&
        !this.state.missingBaseEntities.includes( code )
      ) {
        this.setState( state => ({
          missingBaseEntities: state.missingBaseEntities.includes( code )
            ? [...state.missingBaseEntities]
            : [...state.missingBaseEntities, code],
        }));
      }
      else if (
        isObject( beAttributes, { isNotEmpty: true }) &&
        this.state.missingBaseEntities.includes( code )
      ) {
        this.setState( state => ({
          missingBaseEntities: state.missingBaseEntities.filter( beCode => beCode !== code ),
        }));
      }
    };

    const initialValues = {};

    const setQuestionValue = ( ask ) => {
      // handle targetCode
      let askValue = null;

      if ( isObject( ask, { withProperty: 'targetCode' })) {
        checkForBE( ask.targetCode );
        const value = dlv( attributes, `${ask.targetCode}.${ask.attributeCode}.value` );
        // console.log('ask', ask, value, value || null);

        if ( value !== null || ask.mandatory )
          askValue = value !== null ? value : null;
      }

      const childValues = {};

      if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
        ask.childAsks.forEach( childAsk => {
          childValues[childAsk.questionCode] = setQuestionValue( childAsk );
        });
      }

      return isArray( ask.childAsks, { ofMinLength: 1 })
        ? childValues
        : askValue;
    };

    questionGroups.map( questionGroup => {
      initialValues[questionGroup.questionCode] = setQuestionValue( questionGroup );
    });

    if ( Object.keys( initialValues ).length > 0 && this.props.shouldSetInitialValues ) {
      this.setState({
        initialValues,
      });
      this.values = JSON.parse( JSON.stringify( initialValues ));
    }
  }

  setValidationList() {
    const { questionGroups } = this.state;
    const { data } = this.props.baseEntities.definitions;

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      this.setState({ validationList: {} });

      return;
    }

    const validationList = {};

    const setValidation = ( ask ) => {
      // handle targetCode
      let validation = null;

      if ( isObject( ask, { withProperty: 'targetCode' })) {
        const dataType = dlv( data, `${ask.attributeCode}.dataType` );

        validation = {
          dataType,
          required: ask.mandatory,
        };
      }
      const childValidation = {};

      if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
        ask.childAsks.forEach( childAsk => {
          childValidation[childAsk.questionCode] = setValidation( childAsk );
        });
      }

      return isArray( ask.childAsks, { ofMinLength: 1 })
        ? childValidation
        : validation;
    };

    questionGroups.forEach( questionGroup => {
      validationList[questionGroup.questionCode] = setValidation( questionGroup );
    });

    this.setState({ validationList });
  }

  /* Default to using `this.props`, allowing for `prevProps` to be
   * passed to this fn inside of `componentDidUpdate`. */
  getQuestionGroups( props = this.props ) {
    const { questionGroupCode, asks } = props;

    /* questionGroupCode from here is a string, so check if the ask exists
     * for this questionGroupCode key. If exists, return it inside of an array. */
    if ( asks[questionGroupCode] ) {
      return [
        asks[questionGroupCode],
      ];
    }

    /* If nothing works, return an empty array. */
    return [];
  }

  checkIfNewBaseEntities = ( newProps ) => {
    const { missingBaseEntities } = this.state;

    const result = missingBaseEntities.some( beCode => {
      return (
        dlv( newProps, `baseEntities.data.${beCode}` ) &&
        isObject( dlv( newProps, `baseEntities.attributes.${beCode}` ), { isNotEmpty: true })
      );
    });

    return result;
  }

  checkForUpdatedQuestionTargets = ( newProps ) => {
    const { questionGroups } = this.state;
    const newQuestionGroup = newProps.asks[newProps.questionGroupCode];

    if ( questionGroups.length < 1 ) return false;

    const compareTargetCode = ( newAsk, existingAsk, level ) => {
      if ( !newAsk && !existingAsk ) return false;
      if ( !newAsk || !existingAsk ) return true;
      if ( !newAsk.question && !existingAsk.question ) return false;
      if ( !newAsk.question || !existingAsk.question ) return true;

      const newQuestionCode = newAsk.questionCode;
      const newTargetCode = newAsk.targetCode;

      const existingQuestionCode = existingAsk.questionCode;
      const existingTargetCode = existingAsk.targetCode;

      const isMatch = (
        newQuestionCode === existingQuestionCode &&
        newTargetCode === existingTargetCode
      );

      if ( isMatch ) return false;

      if ( isArray(  newAsk.childAsks, { ofMinLength: 1 })) {
        const isChildMatch = newAsk.childAsks.some(( childAsk, index ) => {
          return compareTargetCode( childAsk, existingAsk.childAsks[index], level + 1 );
        });

        return isChildMatch;
      }

      return true;
    };

    let isDifference = false;

    if ( isArray( newQuestionGroup.childAsks, { ofMinLength: 1 })) {
      isDifference = newQuestionGroup.childAsks.some(( childAsk, index ) => {
        return compareTargetCode( childAsk, questionGroups[0].childAsks[index], 1 );
      });
    } else {
      isDifference = compareTargetCode( newQuestionGroup, questionGroups[0], 1 );
    }

    return isDifference;
  };

  checkForUpdatedAttributeValues = ( newProps ) => {
    /* identify the attributes for each question */
    const { initialValues } = this.state;
    const newQuestionGroup = newProps.asks[newProps.questionGroupCode];

    // let currentPath = newProps.questionGroupCode;
    const rootPath = newProps.questionGroupCode;

    const compareAttributeValues = ( ask, path ) => {
      if ( !ask.question ) {
        return false;
      }

      const questionCode = ask.questionCode;
      const target = ask.targetCode;
      const attributeCode = ask.question.attributeCode;
      const baseEntityAttributeValue = dlv( newProps, `baseEntities.attributes.${target}.${attributeCode}.value` );

      // const path = `${currentPath}.${ask.questionCode}`;

      const initialValue = dlv( initialValues, `${path}.${ask.questionCode}` );

      const isMatch = (
        initialValue == null &&
        baseEntityAttributeValue == null
      ) ||
      initialValue === baseEntityAttributeValue;

      if ( isMatch ) {
        return false;
      }

      if ( isArray( ask.childAsks, { ofMinLength: 1 })) {
        const currentPath = `${path}.${questionCode}`;

        const isChildMatch = ask.childAsks.some(
          childAsk => compareAttributeValues( childAsk, currentPath )
        );

        return isChildMatch;
      }

      return true;
    };

    const isDifference = newQuestionGroup.childAsks.some(
      childAsk => compareAttributeValues( childAsk, rootPath )
    );

    return isDifference;
  }

  checkForRemovedQuestions = ( newProps ) => {
    // console.warn( 'checkForRemovedQuestions');

    const { questionGroups } = this.state;
    const newQuestionGroup = newProps.asks[newProps.questionGroupCode];

    // console.warn( 'checkForRemovedQuestions', { questionGroups, currentQuestionGroup: questionGroups[0], newQuestionGroup});

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      return false;
    }

    const compareChildAskCount = ( currentAsk, nextAsk, level ) => {
      const currentChildAsks = isArray( currentAsk.childAsks ) ? currentAsk.childAsks.length : 0;
      const nextChildAsks = isArray( nextAsk.childAsks ) ? nextAsk.childAsks.length : 0;

      // console.warn( 'compare', level, { currentChildAsks, nextChildAsks });

      if ( currentChildAsks === nextChildAsks ) {
        if ( currentChildAsks === 0 ) {
          return false;
        }

        return currentAsk.childAsks.some(( childAsk, index ) => {
          return compareChildAskCount( childAsk, nextAsk.childAsks[index], level + 1 );
        });
      }

      return true;
    };

    let isDifference = false;

    isDifference = compareChildAskCount( questionGroups[0], newQuestionGroup, 1 );

    // console.warn({ isDifference });

    return isDifference;
  };

  checkIfFullWidth = ( questionGroups ) => {
    return questionGroups.some( questionGroup => {
      return isObject( questionGroup.contextList, { withProperty: 'fullWidth' })
        ? questionGroup.contextList.fullWidth
        : false;
    });
  }

  doValidate = values => {
    if ( !values )
      return {};

    const { validationList } = this.state;
    const { types } = this.props.baseEntities.definitions;
    const errorList = {};

    const validate = ( value, validation ) => {
      // handle targetCode
      // console.log( 'data', value, validation );
      let error = null;

      if ( !validation ) {
        return;
      }

      const { dataType, required } = validation;

      // console.log( 'dataType', types, dataType, validation, validation.dataType );

      const validationArray = types[dataType] && types[dataType].validationList;

      // console.log( 'validationArray', validationArray );

      if (
        value == null &&
        required
      ) {
        error = 'Please enter this field';
      // errors.push( 'Please enter this field' );
      }

      if ( isArray( validationArray, { ofMinLength: 1 })) {
      // newState[field] = error;
      // newState[field] = errors;
        validationArray.every( validation => {
          if ( !isObject( validation, { withProperty: 'regex' })) {
            console.warn( 'Warning: validation does not contain regex field', validation, validationArray ); // eslint-disable-line

            return true;
          }

          const doesPass = new RegExp( validation.regex ).test( String( value ));

          // console.log( 'doesPass', doesPass );

          if ( !doesPass ) {
            // errors.push( validation.errorMessage );
            const hasErrorMessage = isString( validation.errorMessage, { ofMinLength: 1 });

            if ( hasErrorMessage ) {
              error = validation.errorMessage;
            }
            else {
                // console.warn( 'Warning: object "validation" does not contain an errorMessage field', validation ); // eslint-disable-line
              error = 'Error: Answer Invalid';
            }
          }

          return doesPass;
        });
      }

      // console.log( 'errors', errors );

      // console.log( 'validation', validation );

      let childValidation = null;

      // recurse

      // console.log( 'TYPE', value, isObject( value ));

      // console.log( 'TYPE array',
        // isObject( value ) && isArray( Object.keys( value ), { ofMinLength: 1 }));

      const hasChildren = isObject( value ) && isArray( Object.keys( value ), { ofMinLength: 1 });

      if ( hasChildren ) {
        // console.log( 'hasChildren' );

        Object.keys( value ).forEach( valueKey => {
          const hasError = validate( value[valueKey], validation[valueKey] );

          if ( hasError ) {
            if ( !childValidation ) {
              childValidation = {};
            }
            childValidation[valueKey] = validate( value[valueKey], validation[valueKey] );
          }
        });
      }

      return hasChildren
        ? childValidation
        : error;
    };

    Object.keys( values ).forEach( valueKey => {
      // console.log( 'value',  valueKey );

      errorList[valueKey] = validate( values[valueKey], validationList[valueKey] );
    });

    this.errors = errorList;

    return errorList;
  }

  shouldSendAnswer = ({ value, valuePath }) => {
    const initialValue = dlv( this.state.initialValues, valuePath );
    const lastSentValue = dlv( this.lastSentValues, valuePath );

    if ( lastSentValue != null ) {
      if ( lastSentValue !== value ) {
        return true;
      }
    }
    else if ( initialValue !== value ) {
      return true;
    }

    return false;
  }

  sendAnswer = ({ ask, value, valuePath }) => {
    let finalValue = value;
    let finalAttributeCode = ask.attributeCode;

    if ( ask.attributeCode.indexOf( 'ADDRESS_FULL' ) !== -1 ) {
      finalAttributeCode = ask.attributeCode.replace( 'ADDRESS_FULL', 'ADDRESS_JSON' );
    }
    else if ( ask.attributeCode.indexOf( 'PRI_RATING' ) !== -1 ) {
      finalAttributeCode = 'PRI_RATING_RAW';
    }

    /* If the form is an object or an array, stringify it. */
    if (
      isObject( finalValue ) ||
      isArray( finalValue )
    ) {
      finalValue = JSON.stringify( finalValue );
    }

    dset( this.lastSentValues, valuePath, value );

    // eslint-disable-next-line no-console
    console.warn( 'form attempting to send answer:', {
      askId: ask.id,
      attributeCode: finalAttributeCode,
      sourceCode: ask.sourceCode,
      targetCode: ask.targetCode,
      code: ask.questionCode,
      questionGroup: this.getQuestionGroups().name, // doesnt work, returns an array
      identifier: ask.questionCode,
      weight: ask.weight,
      value: finalValue,
    });

    Bridge.sendFormattedAnswer({
      askId: ask.id,
      attributeCode: finalAttributeCode,
      sourceCode: ask.sourceCode,
      targetCode: ask.targetCode,
      code: ask.questionCode,
      questionGroup: this.getQuestionGroups().name, // doesnt work, returns an array
      identifier: ask.questionCode,
      weight: ask.weight,
      value: finalValue,
    });
  }

  handleChange = (
    field,
    setFieldValue,
    setFieldTouched,
    ask,
    valuePath,
  ) => (
    value,
    sendOnChange,
  ) => {
    this.state.isUpdating = true; // eslint-disable-line
    if ( value == null )
      return;

    setFieldValue( valuePath, value );
    setFieldTouched( valuePath, true );

    dset( this.values, valuePath, value );

    if ( isArray( value, { ofMinLength: 1 })) {
      if  ( this.shouldSendAnswer({ value, valuePath })) {
        this.sendAnswer({ ask, value, valuePath });
      }
    }

    else if ( sendOnChange && this.shouldSendAnswer({ value, valuePath })) {
      this.sendAnswer({ ask, value, valuePath });
    }
  }

  handleFocusNextInput = ( questionGroupCode, currentFocusedIndex ) => () => {
    if (
      this.inputRefs[questionGroupCode] &&
      this.inputRefs[questionGroupCode][currentFocusedIndex + 1] &&
      this.inputRefs[questionGroupCode][currentFocusedIndex + 1].focus
    ) {
      this.inputRefs[questionGroupCode][currentFocusedIndex + 1].focus();
    }
  }

  handleBlur = ( ask, valuePath ) => async () => {
    await this.state.isUpdating === false;

    if ( ask ) {
      const questionCode = ask.questionCode;

      if (
        questionCode &&
        this.values &&
        isString( valuePath )
      ) {
        const value = dlv( this.values, valuePath );

        if (
          value &&
          (
            !this.errors ||
            !dlv( this.errors, valuePath ) &&
            this.shouldSendAnswer({ value, valuePath })
          )
        ) {
          this.sendAnswer({ ask, value, valuePath });
        }
      }
    }
  }

  renderQuestionGroup = ( questionGroup, index, form, ) => {
    const functions = {
      handleChange: this.handleChange,
      handleFocusNextInput: this.handleFocusNextInput( index ),
      handleBlur: this.handleBlur,
      addRef: ( input ) =>
        this.inputRefs[questionGroup.questionGroupCode] = {
          ...this.inputRefs[questionGroup.questionGroupCode],
          [index]: input,
        },
    };

    return (
      <FormGroup
        key={questionGroup.questionCode}
        questionGroup={questionGroup}
        form={form}
        rootCode={this.props.questionGroupCode}
        inheritedProps={this.props.inheritedProps}
        index={index}
        functions={functions}
        inputRefs={this.inputRefs}
        isClosed={this.props.isClosed}
        groupPath={questionGroup.questionCode}
      />
    );
  }

  render() {
    const {
      loadingText,
      testID,
      fullWidth,
    } = this.props;
    const { questionGroups } = this.state;

    if ( !isArray( questionGroups, { ofMinLength: 1 })) {
      return (
        <Box
          flexDirection="column"
          {...fullWidth ? { width: '100%' } : {}}
          justifyContent="center"
          alignItems="center"
          flexShrink={0}
          testID={testID}
        >
          <ActivityIndicator size="large" />
          {
            loadingText != null &&
            isString( loadingText )
              ? (
                <Box
                  marginTop={10}
                >
                  <Text
                    align="center"
                  >
                    {loadingText}
                  </Text>
                </Box>
              )
              : null
          }
        </Box>
      );
    }

    const { initialValues } = this.state;

    // let oldProps = {};

    return (
      <Formik
        initialValues={initialValues}
        validate={( values ) => this.doValidate( values )}
        onSubmit={this.handleSubmit}
        validateOnBlur
        enableReinitialize
      >
        {( form ) => {
          /*
            Form values come from here
          */

          // const showKeys = [
          //   'dirty',
          //   'error',
          //   'errors',
          //   'isSubmitting',
          //   'isValid',
          //   'isValidating',
          //   'touched',
          //   'values',
          // ];

          // console.log( '===================' );
          // console.log( 'form props', Object.keys( form )
          //  .filter( k => showKeys.includes( k )).map( key => form[key] ), oldProps );

          // oldProps = form;

          const {
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            validateField,
            validateForm,
            handleBlur,
//             dirty: false
//             error: undefined
//             errors: {}
//             handleBlur: ƒ (eventOrPath)
//             handleChange: ƒ (eventOrPath)
//             handleReset: ƒ ()
//             handleSubmit: ƒ (e)
//             isSubmitting: false
//             isValid: false
//             isValidating: true
//             registerField: ƒ (name, Comp)
//             resetForm: ƒ (nextValues)
//             setError: ƒ (error)
//             setErrors: ƒ (errors)
//             setFieldError: ƒ (field, message)
//             setFieldTouched: ƒ (field, touched, shouldValidate)
//             setFieldValue: ƒ (field, value, shouldValidate)
//             setFormikState: ƒ (s, callback)
//             setStatus: ƒ (status)
//             setSubmitting: ƒ (isSubmitting)
//             setTouched: ƒ (touched)
//             setValues: ƒ (values)
//             status: undefined
//             submitCount: 0
//             submitForm: ƒ ()
//             touched: {}
//             unregisterField: ƒ (name)
//             validateField: ƒ (field)
//             validateForm: ƒ (values)
//             validateOnBlur: true
//             validateOnChange: true
//              values

          } = form;

          this.errors = errors;

          // const isFormValid = shallowCompare( this.doValidate( values ), {});

          return (
            <Fragment>
              {questionGroups.map(( questionGroup, index ) => {
                return this.renderQuestionGroup(
                  questionGroup,
                  index,
                  {
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                    // isFormValid,
                    validateField,
                    validateForm,
                    onBlur: handleBlur,
                  }
                );
              })}
            </Fragment>
          );
        }}
      </Formik>
    );
  }
}

export { Form };

const mapStateToProps = state => ({
  baseEntities: state.vertx.baseEntities,
  aliases: state.vertx.aliases,
  asks: state.vertx.asks,
});

export default connect( mapStateToProps )( Form );
