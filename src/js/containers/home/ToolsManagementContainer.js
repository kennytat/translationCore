import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ToolsCards from "../../components/home/toolsManagement/ToolsCards";
import HomeContainerContentWrapper
  from "../../components/home/HomeContainerContentWrapper";
import * as ProjectDetailsActions from "../../actions/ProjectDetailsActions";
import {
  getTools, getIsUserLoggedIn, getProjectSaveLocation, getProjectBookId,
  getToolGatewayLanguage
} from "../../selectors";
import { openTool } from "../../actions/ToolActions";
import { openAlertDialog } from "../../actions/AlertModalActions";
import * as PopoverActions from "../../actions/PopoverActions";

class ToolsManagementContainer extends Component {
  constructor(props) {
    super(props);
    this.handleSelectTool = this.handleSelectTool.bind(this);
  }

  componentDidMount() {
    const {tools, reducers} = this.props;
    const projectSaveLocation = getProjectSaveLocation(reducers);
    const bookId = getProjectBookId(reducers);
    if (projectSaveLocation && bookId) {
      tools.forEach(({name:toolName}) => {
        const currentGatewayLanguage = getToolGatewayLanguage(reducers, toolName);
        this.props.actions.loadCurrentCheckCategories(toolName, projectSaveLocation, currentGatewayLanguage);
      });
    }
  }

  /**
   *
   * @param toolName
   */
  handleSelectTool(toolName) {
    const {isUserLoggedIn, openTool, translate, openAlertDialog} = this.props;
    if(isUserLoggedIn) {
      openTool(toolName);
    } else {
      openAlertDialog(translate("please_log_in"));
    }
  }

  render() {
    const {
      tools,
      reducers: {
        loginReducer: { loggedInUser },
        projectDetailsReducer: {
          currentProjectToolsSelectedGL,
          manifest,
          projectSaveLocation,
          currentProjectToolsProgress,
          toolsCategories
        },
        invalidatedReducer
      },
      translate
    } = this.props;
 
    const instructions = (
      <div>
        <p>{translate("tools.select_tool_from_list")}</p>
        <p>{translate("projects.books_available",
          { app: translate("_.app_name") })}</p>
      </div>
    );
    return (
      <HomeContainerContentWrapper
        translate={translate}
        instructions={instructions}
      >
        <div style={{ height: "100%" }}>
          {translate("tools.tools")}
          <ToolsCards
            tools={tools}
            onSelectTool={this.handleSelectTool}
            toolsCategories={toolsCategories}
            manifest={manifest}
            translate={translate}
            bookName={name}
            loggedInUser={loggedInUser}
            actions={{
              ...this.props.actions
            }}
            currentProjectToolsSelectedGL={currentProjectToolsSelectedGL}
            invalidatedReducer={invalidatedReducer}
            projectSaveLocation={projectSaveLocation}
            currentProjectToolsProgress={currentProjectToolsProgress}
          />
        </div>
      </HomeContainerContentWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isUserLoggedIn: getIsUserLoggedIn(state),
    tools: getTools(state),
    reducers: {
      homeScreenReducer: state.homeScreenReducer,
      projectDetailsReducer: state.projectDetailsReducer,
      loginReducer: state.loginReducer,
      invalidatedReducer: state.invalidatedReducer
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openTool: name => dispatch(openTool(name)),
    openAlertDialog: message => dispatch(openAlertDialog(message)),
    actions: {
      loadCurrentCheckCategories: (toolName, projectSaveLocation) => {
        dispatch(ProjectDetailsActions.loadCurrentCheckCategories(toolName, projectSaveLocation));
      },
      getProjectProgressForTools: (toolName) => {
        dispatch(ProjectDetailsActions.getProjectProgressForTools(toolName));
      },
      setProjectToolGL: (toolName, selectedGL) => {
        dispatch(ProjectDetailsActions.setProjectToolGL(toolName, selectedGL));
      },
      updateCheckSelection: (id, value, toolName) => {
        dispatch(ProjectDetailsActions.updateCheckSelection(id, value, toolName));
      },
      showPopover: (title, bodyText, positionCoord) => {
        dispatch(PopoverActions.showPopover(title, bodyText, positionCoord));
      } 
    }
  };
};

ToolsManagementContainer.propTypes = {
  isUserLoggedIn: PropTypes.bool.isRequired,
  openTool: PropTypes.func.isRequired,
  openAlertDialog: PropTypes.func.isRequired,
  tools: PropTypes.array.isRequired,
  reducers: PropTypes.shape({
    projectDetailsReducer: PropTypes.object.isRequired,
    loginReducer: PropTypes.shape({
      loggedInUser: PropTypes.bool
    }).isRequired
  }).isRequired,
  actions: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ToolsManagementContainer);
