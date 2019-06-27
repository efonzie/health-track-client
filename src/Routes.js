import React from "react";
import { Route, Switch } from "react-router-dom";
import AppliedRoute from "./components/Navigation/AppliedRoute";
import AuthenticatedRoute from "./components/Navigation/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/Navigation/UnauthenticatedRoute";
import Home from "./containers/Home/Home";
import NotFound from "./containers/NotFound/NotFound";
import Login from "./containers/Login/Login";
import Signup from "./containers/Signup/Signup";
import Configure from "./containers/Configure/Configure";
import EditNote from "./containers/EditNote/EditNote";
import Summary from "./containers/Summary/Summary";
import Goals from "./containers/Goals/Goals";
import EditGoal from "./containers/EditGoal/EditGoal";

export default ({ childProps }) =>
	<Switch>
		<AppliedRoute path="/" exact component={Home} props={childProps} />
		<UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
		<UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
		<AuthenticatedRoute path="/configure" exact component={Configure} props={childProps} />
		<AuthenticatedRoute path="/notes/new" exact component={EditNote} props={childProps} />
		<AuthenticatedRoute path="/notes/:id" exact component={EditNote} props={childProps} />
		<AuthenticatedRoute path="/goals" exact component={Goals} props={childProps} />
		<AuthenticatedRoute path="/goals/new" exact component={EditGoal} props={childProps} />
		<AuthenticatedRoute path="/summary" exact component={Summary} props={childProps} />

		{ /* Finally, catch all unmatched routes */}
		<Route component={NotFound} />
	</Switch>;