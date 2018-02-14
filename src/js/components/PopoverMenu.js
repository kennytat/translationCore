import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover/Popover';
import Menu from 'material-ui/Menu';

/**
 * Generates the styles needed for the menu
 * @param {object} props the component props
 * @param {object} state the component state
 * @return {object}
 */
const makeStyles = (props, state) => {
  const {variant} = props;
  const {hover} = state;

  let buttonStyles = {};
  let iconStyles = {};
  if(variant === 'dark') {
    buttonStyles = {
      backgroundColor: 'transparent',
      border: 'solid 1px #ffffff',
      borderRadius: '5px',
      color: '#ffffff',
      fontSize: '12px',
      outline: 'none'
    };
    iconStyles = {
      width:15,
      height:15,
      color: '#ffffff'
    };

    if(hover) {
      buttonStyles = {
        ...buttonStyles,
        backgroundColor: '#ffffff',
        color: '#000000'
      };
      iconStyles = {
        ...iconStyles,
        color: '#000000'
      };
    }
  } else if(variant === 'primary') {
    iconStyles = {
      color: '#ffffff'
    };
  }

  return {
    icon: {
      verticalAlign: 'middle',
      marginRight: '5px',
      color: 'var(--accent-color-dark)',
      ...iconStyles
    },
    button: buttonStyles
  };
};

/**
 * Represents a generic popover menu
 */
export default class PopoverMenu extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleButtonOut = this.handleButtonOut.bind(this);
    this.handleButtonOver = this.handleButtonOver.bind(this);
    const {open} = props;
    this.state = {
      open: Boolean(open),
      hover: false
    };
  }

  componentDidCatch(error, info) {
    console.error(error);
    console.warn(info);
  }

  /**
   * Handles clicks on the button that opens the menu
   * @param event
   */
  handleClick(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  /**
   * Handles requests to close the menu
   */
  handleRequestClose() {
    this.setState({
      open: false
    });
  }

  /**
   * Intercepts a click on the child
   * before calling the original listener
   */
  hijackChildClick(child) {
    const closeMenu = this.handleRequestClose;
    return (event) => {
      closeMenu();
      if(child.props.onClick) {
        child.props.onClick(event);
      }
    };
  }

  /**
   * Enables hover state
   */
  handleButtonOver() {
    this.setState({
      hover: true
    });
  }

  /**
   * Disables hover state
   */
  handleButtonOut() {
    this.setState({
      hover: false
    });
  }

  render () {
    const {label, icon, variant, children} = this.props;
    const {anchorEl, open} = this.state;

    let childrenWithAutoClose = React.Children.map(children, child =>
      React.cloneElement(child, {onClick: this.hijackChildClick(child)}));

    const styles = makeStyles(this.props, this.state);

    const iconCloned = icon && React.cloneElement(icon, {
      color: styles.icon.color,
      style: Object.assign(styles.icon, icon.props.style),
      key: 'iconCloned'
    });

    let buttonClassName = '';
    if(variant === 'primary') {
      buttonClassName = 'btn-prime';
    } else if(variant === 'secondary') {
      buttonClassName = 'btn-second';
    }

    return (
      <React.Fragment>
        <button onClick={this.handleClick}
                onMouseOver={this.handleButtonOver}
                onMouseOut={this.handleButtonOut}
                style={styles.button}
                className={buttonClassName}>
          {iconCloned}
          {label}
        </button>
        <Popover className='popover-root'
                 open={open}
                 anchorEl={anchorEl}
                 anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                 targetOrigin={{horizontal: 'left', vertical: 'top'}}
                 onRequestClose={this.handleRequestClose}>
          <Menu>
            {childrenWithAutoClose}
          </Menu>
        </Popover>
      </React.Fragment>
    );
  }
}
PopoverMenu.propTypes = {
  label: PropTypes.any.isRequired,
  open: PropTypes.bool,
  icon: PropTypes.any,
  variant: PropTypes.string,
  children: PropTypes.any
};
PopoverMenu.defaultProps = {
  variant: 'secondary'
};
