import React, { Component } from 'react';
import { Link as div } from 'react-router-dom';
import { PageHeader, ListGroup, ProgressBar, Button } from 'react-bootstrap'
import { getGoalProgress, removeGoal } from '../../libs/awsLib';
import GoalAdder from '../../components/Goals/GoalAdder';
import LoadingIndicator from '../../components/UI/LoadingIndicator/LoadingIndicator';

class Goals extends Component {
    state = {
        goals: null,
        isLoading: true
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }
        const goals = await getGoalProgress();
        if (goals) {
            this.setState({ goals: goals })
        }

        this.setState({ isLoading: false });
    }

    handleDelete = async (goal) => {
        const confirmed = window.confirm("Are you sure you want to delete this goal?");
        if (!confirmed) {
            return;
        }

        const goals = [...this.state.goals];
        var index = goals.indexOf(goal);
        if (index > -1) {
            goals.splice(index, 1);
        }
        this.setState({ goals });

        try {
            await removeGoal(goal.goalId);
        } catch (e) {
            alert(e);
        }
    }

    renderGoalList(goals) {
        return goals.map((goal, i) => {
            const percentComplete = goal.current * 100 / goal.target
            return (
                <div key={goal.habit + goal.measure} className="clearfix">
                    <h3>{goal.habit} {goal.target} times per {goal.measure}
                        <Button className="btn btn-danger pull-right" onClick={() => this.handleDelete(goal)}>
                            <span className="glyphicon glyphicon-trash"></span>
                        </Button>
                    </h3>
                    <ProgressBar striped bsStyle={percentComplete >= 100 ? "success" : "info"} now={percentComplete} />
                </div>
            )
        }
        );
    }

    render() {
        return (
            <div className="Goals">
                <GoalAdder />
                <PageHeader>Your Goals</PageHeader>
                <ListGroup>
                    {this.state.isLoading ? <LoadingIndicator /> : this.renderGoalList(this.state.goals)}
                </ListGroup>
            </div>
        )
    }
}
export default Goals;