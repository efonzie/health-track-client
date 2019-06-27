import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import GoalAdder from './GoalAdder';

import { getGoalSummary } from '../../libs/awsLib';

class GoalSummaryIndicator extends Component {
    state = {
        goalsSummary: null,
        measure: 'Week'
    }

    async componentDidMount() {
        try {
            const goalsSummary = await getGoalSummary();
            if (goalsSummary) {
                this.setState({ goalsSummary: goalsSummary });
            }
        } catch (e) {
            alert(e);
        }
    }

    renderGoalIndicator() {
        return this.state.goalsSummary.map(goal => {
            const percentComplete = goal.current * 100 / goal.target;
            return (
                <div key={goal.measure}>
                    <span>
                        <h3>{goal.measure.toUpperCase()}</h3>
                        <ProgressBar striped bsStyle={percentComplete >= 100 ? "success" : "info"} now={percentComplete} />
                    </span>
                </div>
            );
        })
    }

    render() {
        if (!this.state.goalsSummary) {
            return null;
        }

        return (
            <div className="GoalSummaryIndicator">
                {this.state.goalsSummary.length > 0 ? this.renderGoalIndicator() : <GoalAdder/>}
            </div>
        )
    }
}

export default GoalSummaryIndicator;