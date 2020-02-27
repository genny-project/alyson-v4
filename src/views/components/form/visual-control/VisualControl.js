import React, { Component } from 'react';
import { string, object, bool, number, func, array } from 'prop-types';
import { connect } from 'react-redux';
import dlv from 'dlv';
import { isArray, isObject, isString, getLayoutLinksOfType, checkForNewLayoutLinks, filterThemes, getPropsFromThemes, objectMerge } from '../../../../utils';
import { Box /* Tooltip */ } from '../../../components';
import FormInput from '../input';
import { StatefulThemeHandler, StatelessThemeHandler } from '../theme-handlers';
import VisualControlLabel from './visual-control-label';
import VisualControlHint from './visual-control-hint';
import VisualControlRequired from './visual-control-required';
import VisualControlDescription from './visual-control-description';
import VisualControlError from './visual-control-error';

const components = [
  'vcl-wrapper',
  'vcl-input',
  'vcl-icon',
  'vcl-label',
  'vcl-description',
  'vcl-hint',
  'vcl-error',
  'vcl-required',
];

/*
const inputStates = [
  'default',
  'hover',
  'active',
  'disabled',
];
*/

const subcomponents = [
  'input-field',
  'input-wrapper',
  'input-icon',
  'input-item-wrapper',
  'input-item',
  'input-selected-wrapper',
  'input-selected',
  'input-placeholder',
];

class VisualControl extends Component {
  static propTypes = {
    // type: string.isRequired,
    question: object,
    // onChangeValue: func.isRequired,
    ask: object,
    asks: object,
    attributes: object,
    inheritedProps: object,
    inheritedThemes: array,
    themes: object,
    error: string,
    required: bool,
    editable: bool,
    disabled: bool,
    isClosed: bool,
    flexWrapper: bool,
    index: number,
    onBlur: func,
    onFocus: func,
    onChange: func,
    onChangeValue: func,
    type: string,
    dttCode: string,
  }

  state = {
    themes: [],
  }

  /* eslint-disable react/sort-comp */

  componentDidMount() {
    this.getThemes();
  }

  componentDidUpdate( nextProps ) {
    if ( isObject( dlv( nextProps, `asks.${nextProps.question.code}` ))) {
      const hasNewLinks = checkForNewLayoutLinks(
        this.state.themes,
        dlv( nextProps, `asks.${nextProps.question.code}.links` ),
        this.props,
      );

      if ( hasNewLinks ) {
        this.getThemes();
      }
    }
  }

  getThemes = () => {
    const { ask, asks } = this.props;

    if ( !ask ) return null;

    const { questionCode } = ask;

    if ( !asks || !asks[questionCode] ) return null;

    const askData = asks[questionCode];

    /* filter each of the links based on their type */
    const linkedThemes = getLayoutLinksOfType( askData.links, this.props, 'theme' );

    /* update the state  */
    this.updateThemes( linkedThemes );
  }

  getIcon = () => {
    const { ask, asks } = this.props;

    if ( !ask ) return null;

    const { questionCode } = ask;

    if ( !asks || !asks[questionCode] ) return null;

    if (
      isObject( ask, { withProperty: 'questionCode' }) &&
      isObject( asks, { withProperty: questionCode }) &&
      isObject(  asks[questionCode], { withProperty: 'links' }) &&
      isArray( asks[questionCode].links.filter( link => link.type === 'icon' ), { ofMinLength: 1 })
    ) {
      const icon = dlv( this.props.attributes, `${asks[questionCode].links.filter( link => link.type === 'icon' )[0].code}.PRI_ICON_CODE.value` );

      return icon;
    }

    return null;
  }

  updateThemes = ( links ) => {
    /* check if the stateKey is valid  */
    this.setState({
      ['themes']: [
        ...links,
      ],
    }, () => {});
  }

  getInhertiableThemes = () => {
    return [
      ...this.props.inheritedThemes,
      ...filterThemes(
        this.state.themes,
        this.props.themes,
        {
          onlyInheritableThemes: true,
        }
      ),
    ];
  }

  getStyling = ( componentType ) => {
    const inheritedLinks = [
      ...filterThemes(
        this.props.inheritedThemes,
        this.props.themes,
        {
          component: componentType,
          acceptTypes: ['vcl', 'group'],
          // dataType: this.props.type,
          dataType: this.props.type,
          dttCode: this.props.dttCode,
        }
      ),
    ];

    const panelLinks = [
      ...filterThemes(
        this.state.themes,
        this.props.themes,
        {
          component: componentType,
          acceptTypes: ['vcl', 'group'],
          // dataType: this.props.type,
          dataType: this.props.type,
          dttCode: this.props.dttCode,
        }
      ),
    ];

    // get props from theme links
    const inheritedThemeProps = getPropsFromThemes( inheritedLinks, this.props.themes );
    const themeProps = getPropsFromThemes( panelLinks, this.props.themes );

    const combinedThemeProps = objectMerge(
      isObject( this.props.inheritedProps ) ? this.props.inheritedProps : {},
      objectMerge( inheritedThemeProps, themeProps ),
    );

    return {
      ...combinedThemeProps,
    };
  }

  handleStateChange = ( newState ) => {
    this.setState( state => ({
      ...state,
      ...newState,
    }));
  }

  render() {
    const {
      inheritedThemes,
      themes,
      flexWrapper,
      index,
      onBlur,
      ...restProps
    } = this.props;

    let properties = {};

    const checkThemeForProperties = ( themeArray ) => {
      if ( !isArray( themeArray )) return;

      const linkedThemes = [
        ...filterThemes(
          themeArray,
          this.props.themes,
          {
            // dataType: this.props.type,
            dataType: this.props.type,
            dttCode: this.props.dttCode,
          }
        ),
      ];

      linkedThemes.forEach( linkedTheme => {
        const themeProperties = dlv( themes, `${linkedTheme.code}.properties` );

        if ( isObject( themeProperties )) {
          properties = {
            ...properties,
            ...themeProperties,
          };
        }
      });
    };

    checkThemeForProperties( inheritedThemes );
    checkThemeForProperties( this.state.themes );

    return (
      <StatelessThemeHandler
        getStyling={this.getStyling}
        getIcon={this.getIcon}
        componentTypes={components}
        editable={this.props.editable}
        disabled={this.props.disabled}
        error={this.props.error}
      >
        {({
          componentProps,
        }) => {
          return (
            /* WRAPPER */
            <Box
              flexDirection="column"
              flex={flexWrapper ? 1 : null}
              justifyContent="center"
              zIndex={100 - index}
              componentID="VCL-WRAPPER"
              componentCode={this.props.ask.questionCode}
              {...componentProps['vcl-wrapper']}
            >
              {(
                properties.renderVisualControlLabel
              ) && (
              <Box
                flexDirection="row"
              >
                <VisualControlLabel
                  question={this.props.question}
                  questionCode={this.props.ask.questionCode}
                  {...componentProps['vcl-label']}
                />

                {(
                  properties.renderVisualControlRequired &&
                  this.props.required
                ) && (
                  <VisualControlRequired
                    questionCode={this.props.ask.questionCode}
                    {...componentProps['vcl-required']}
                  />
                )}

                {/* HINT */}
                {(
                  properties.renderVisualControlHint
                ) && (
                  <VisualControlHint
                    questionCode={this.props.ask.questionCode}
                    {...componentProps['vcl-hint']}
                  />
                )}
              </Box>
              )}

              {/* DESCRIPTION */}
              {(
                properties.renderVisualControlDescription
              ) && (
                <VisualControlDescription
                  questionCode={this.props.ask.questionCode}
                  {...componentProps['vcl-description']}
                />
              )}

              {/* INPUT COMPONENT */}
              {(
                properties.renderVisualControlInput !== false
              ) && (
                <StatefulThemeHandler
                  // onChangeState={this.handleStateChange}
                  getStyling={this.getStyling}
                  getIcon={this.getIcon}
                  subcomponentTypes={subcomponents}
                  editable={this.props.editable}
                  disabled={this.props.disabled}
                  error={this.props.error}
                  closed={this.props.isClosed}
                  identifier={this.props.ask.questionCode}
                >
                  {({
                    onChangeState,
                    inputProps,
                    subcomponentProps,
                  }) => {
                    return (
                      <FormInput
                        {...restProps}
                        {...componentProps['vcl-input']}
                        inputFieldProps={inputProps}
                        subcomponentProps={subcomponentProps}
                        onBlur={onBlur}
                        iconProps={properties.renderVisualControlIcon ? componentProps['vcl-icon'] : null}
                        iconOnly={(
                        properties.renderIconOnly != null
                          ? properties.renderIconOnly
                          : false
                      )}
                        useAttributeNameAsValue={isObject( properties, { withProperty: 'useAttributeNameAsValue' }) ? properties.useAttributeNameAsValue : null}
                        useQuestionNameAsValue={isObject( properties, { withProperty: 'useQuestionNameAsValue' }) ? properties.useQuestionNameAsValue : null}
                        inheritedProps={this.getInhertiableThemes()}
                        padding={3}
                        onChangeState={onChangeState}
                      />
                    );
                  }}
                </StatefulThemeHandler>
              )}

              {/* ERROR MESSAGE */}
              {(
                isString( this.props.error )
              ) && (
                <VisualControlError
                  error={this.props.error}
                  questionCode={this.props.ask.questionCode}
                  {...componentProps['vcl-error']}
                />
              )}
            </Box>
          );
        }
      }
      </StatelessThemeHandler>
    );
  }
}

export { VisualControl };

const mapStateToProps = state => ({
  themes: state.vertx.layouts.themes,
  asks: state.vertx.layouts.asks,
  attributes: state.vertx.baseEntities.attributes,
});

export default connect( mapStateToProps )( VisualControl );
